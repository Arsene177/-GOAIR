import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from typing import Optional, Dict, Any, Tuple
from datetime import datetime
from fastapi import HTTPException
import firebase_admin
from firebase_admin import credentials, messaging
import json
from models import Notification
import logging

logger = logging.getLogger(__name__)

# Initialize Firebase Admin SDK (non-fatal)
_FIREBASE_AVAILABLE = False
try:
    cred = credentials.Certificate('firebase-service-account.json')
    firebase_admin.initialize_app(cred)
    _FIREBASE_AVAILABLE = True
    logger.info("Firebase Admin SDK initialized successfully")
except Exception as e:
    logger.error(f"Firebase Admin SDK not available or failed to initialize: {e}")
    # Do not raise here; allow app to start but disable push notifications

class NotificationError(Exception):
    """Custom exception for notification-related errors"""
    pass

class NotificationService:
    def __init__(self):
            # Read environment variables but do NOT raise here — allow app to import
            # even if notifications are not configured. Failures will happen at send time.
        self.email_sender: str = os.getenv("EMAIL_SENDER", "")
        if not self.email_sender:
                logger.warning("EMAIL_SENDER not set; email sending disabled until configured")
            
        self.email_password: str = os.getenv("EMAIL_PASSWORD", "")
        if not self.email_password:
                logger.warning("EMAIL_PASSWORD not set; email sending disabled until configured")
            
        self.smtp_server: str = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        self.smtp_port: int = int(os.getenv("SMTP_PORT", "587"))
        self.push_notification_key: str = os.getenv("PUSH_NOTIFICATION_KEY", "")
            if not self.push_notification_key:
                logger.warning("PUSH_NOTIFICATION_KEY not set; push notifications disabled until configured")
        
        # Rate limiting settings
        self.email_rate_limit = int(os.getenv("EMAIL_RATE_LIMIT", "100"))  # emails per hour
        self.push_rate_limit = int(os.getenv("PUSH_RATE_LIMIT", "1000"))  # notifications per hour
        self.rate_limit_window = 3600  # 1 hour in seconds
        
        # Tracking for rate limiting
        self.email_count = 0
        self.push_count = 0
        self.last_reset = datetime.utcnow()
    
    def _check_rate_limits(self) -> None:
        """Check and reset rate limits if needed"""
        now = datetime.utcnow()
        time_diff = (now - self.last_reset).total_seconds()
        
        if time_diff >= self.rate_limit_window:
            self.email_count = 0
            self.push_count = 0
            self.last_reset = now

    async def send_email_notification(self, recipient: str, subject: str, body: str) -> bool:
        try:
            # Check if email is configured
            if not self.email_sender or not self.email_password:
                logger.warning("Email notifications not configured - skipping email send")
                return False
                
            self._check_rate_limits()
            
            if self.email_count >= self.email_rate_limit:
                logger.error("Email rate limit exceeded")
                raise NotificationError("Email rate limit exceeded")
            # Ensure email config is present before attempting to send
            if not self.email_sender or not self.email_password:
                logger.error("Attempted to send email but EMAIL_SENDER/EMAIL_PASSWORD not configured")
                raise NotificationError("Email not configured")
            
            message = MIMEMultipart()
            message["From"] = self.email_sender
            message["To"] = recipient
            message["Subject"] = subject
            
            message.attach(MIMEText(body, "html"))
            
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.email_sender, self.email_password)
                server.send_message(message)
            
            self.email_count += 1
            logger.info(f"Email sent successfully to {recipient}")
            return True
            
        except NotificationError as ne:
            logger.error(f"Notification error: {str(ne)}")
            raise
        except Exception as e:
            logger.error(f"Error sending email: {str(e)}")
            return False
    
    async def send_push_notification(self, user_device_token: str, title: str, message_body: str, data: Optional[Dict[str, Any]] = None) -> bool:
        try:
            self._check_rate_limits()
            
            if self.push_count >= self.push_rate_limit:
                logger.error("Push notification rate limit exceeded")
                raise NotificationError("Push notification rate limit exceeded")
            
            if not _FIREBASE_AVAILABLE:
                logger.error("Push notifications disabled: Firebase not initialized")
                return False

            # Create message
            push_message = messaging.Message(
                notification=messaging.Notification(
                    title=title,
                    body=message_body,
                ),
                data=data or {},
                token=user_device_token,
            )

            # Send message
            response = messaging.send(push_message)
                self.push_count += 1
            logger.info(f"Successfully sent push notification: {response}")
                return True
                
        except NotificationError as ne:
            logger.error(f"Notification error: {str(ne)}")
            raise
        except Exception as e:
            logger.error(f"Error sending push notification: {str(e)}")
            return False

    async def format_price_alert_message(self, alert_data: dict) -> tuple[str, str]:
        subject = f"Price Alert: {alert_data['route']} - Target Price Reached!"
        body = f"""
        <h2>Price Alert Notification</h2>
        <p>Good news! The price for your tracked route has reached your target.</p>
        <ul>
            <li>Route: {alert_data['route']}</li>
            <li>Current Price: {alert_data['currency']} {alert_data['price']}</li>
            <li>Target Price: {alert_data['currency']} {alert_data['target_price']}</li>
            <li>Provider: {alert_data.get('provider', 'Not specified')}</li>
        </ul>
        <p>Click <a href="{alert_data.get('booking_link', '#')}">here</a> to book now!</p>
        """
        return subject, body

    async def process_notification(self, notification: Notification) -> bool:
        """Process a notification based on its type and user preferences"""
        try:
            if not notification.payload:
                logger.error("Notification payload is missing")
                return False
                
            if not notification.recipient_address:
                logger.error("Notification recipient address is missing")
                return False
                
            if notification.channel == "email":
                subject, body = await self.format_price_alert_message(dict(notification.payload))
                return await self.send_email_notification(
                    notification.recipient_address,
                    subject,
                    body
                )
            elif notification.channel == "push":  # recipient_address holds device token for push
                if not notification.recipient_address:
                    logger.error("Missing device token for push notification")
                    return False
                    
                route = notification.payload.get('route', 'your flight')
                price = notification.payload.get('price', 'N/A')
                currency = notification.payload.get('currency', 'USD')
                
                message_body = f"Target price reached for {route}! Current price: {currency} {price}"
                
                return await self.send_push_notification(
                    user_device_token=notification.recipient_address,
                    title="Price Alert",
                    message_body=message_body,
                    data=dict(notification.payload)
                )
            else:
                logger.error(f"Unsupported notification channel: {notification.channel}")
                return False
                
        except NotificationError as ne:
            logger.error(f"Notification error while processing: {str(ne)}")
            return False
        except Exception as e:
            logger.error(f"Error processing notification: {str(e)}")
            return False

notification_service = NotificationService()
