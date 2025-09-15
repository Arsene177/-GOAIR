# jobs.py
try:
    from apscheduler.schedulers.background import BackgroundScheduler
    from apscheduler.triggers.interval import IntervalTrigger
    from apscheduler.events import EVENT_JOB_ERROR
except ImportError:
    logger.error("APScheduler not installed. Please install it with: pip install apscheduler")
    raise

import os

try:
    from sqlmodel import select, Session
except ImportError:
    logger.error("SQLModel not installed. Please install it with: pip install sqlmodel")
    raise

from database import engine, get_session
from models import (
    Alert,
    Notification,
    APIProvider,
    PriceCheckJobLog,
    NotificationStatus,
    User,
    DeviceToken,
    NotificationChannel,
)
from datetime import datetime, timedelta
from email.utils import formatdate
import traceback
import logging
from typing import Dict, Any, Optional
import asyncio
from providers.amadeus_provider import AmadeusProvider
from services.notification_service import notification_service

logger = logging.getLogger(__name__)

# Replace with real provider adapter
def query_provider_for_alert(alert: Alert):
    """
    Query the appropriate provider for price information
    """
    try:
        # Initialize Amadeus provider
        provider = AmadeusProvider()
        
        # Query the price
        result = provider.check_price(
            departure=alert.departure,
            arrival=alert.arrival,
            departure_date=alert.departure_date,
            return_date=alert.return_date
        )
        
        if result:
            return result
        
        logger.warning(f"No price found for alert {alert.id}")
        return None
        
    except Exception as e:
        logger.error(f"Error querying provider for alert {alert.id}: {str(e)}")
        return None

async def send_notification(notification: Notification, session) -> bool:
    """
    Send notification using the notification service and update its status.
    """
    try:
        logger.info(f"Sending {notification.channel} notification to {notification.recipient_address}")
        
        # Use the notification service to send the notification
        success = await notification_service.process_notification(notification)
        
        if success:
            notification.status = NotificationStatus.SENT
            notification.sent_at = datetime.utcnow()
        else:
            notification.attempts += 1
            notification.status = NotificationStatus.FAILED
            
        session.add(notification)
        session.commit()
        return success
        
    except Exception as e:
        logger.error(f"Error sending notification: {str(e)}")
        notification.attempts += 1
        notification.last_error = str(e)
        notification.status = NotificationStatus.FAILED
        session.add(notification)
        session.commit()
        return False

async def check_alerts_job():
    """Check all active alerts and send notifications if price targets are met"""
    logger.info("[jobs] Running check_alerts_job at %s", datetime.utcnow().isoformat())
    
    with Session(engine) as session:
        # Query all active alerts
        q = select(Alert).where(Alert.active == True)
        alerts = session.exec(q).all()
        
        for alert in alerts:
            try:
                # Validate required fields
                if not all([alert.departure, alert.arrival, alert.departure_date]):
                    logger.error(f"Alert {alert.id} missing required fields")
                    continue
                
                result = query_provider_for_alert(alert)
                if not result:
                    logger.warning(f"No price information found for alert {alert.id}")
                    continue
                
                price = float(result["price"])
                matched = False
                if alert.max_price is not None and price <= alert.max_price:
                    matched = True
                    logger.info(f"Price target met for alert {alert.id}: {price} <= {alert.max_price}")

                # Record job log
                job_log = PriceCheckJobLog(
                    alert_id=alert.id,
                    ran_at=datetime.utcnow(),
                    checked_price=price,
                    currency=result.get("currency", alert.currency or "USD"),
                    matched=matched,
                    details=result.get("details", {})
                )
                session.add(job_log)

                # Update alert
                alert.last_checked_at = datetime.utcnow()
                session.add(alert)
                
                if matched:
                    # Create and send notification
                    # Determine recipient address: prefer device token if push, otherwise user's email
                    recipient_addr = None
                    user = session.get(User, alert.user_id)

                    try:
                        is_push = (
                            alert.notify_channel == NotificationChannel.PUSH
                            or str(alert.notify_channel).lower() == 'push'
                        )
                    except Exception:
                        is_push = False

                    if is_push:
                        try:
                            dt_q = select(DeviceToken).where(DeviceToken.user_id == alert.user_id).order_by(DeviceToken.last_used_at.desc())
                            dt = session.exec(dt_q).first()
                            if dt and dt.token:
                                recipient_addr = dt.token
                        except Exception:
                            recipient_addr = None

                    if not recipient_addr and user:
                        recipient_addr = user.email

                    notif = Notification(
                        user_id=alert.user_id,
                        alert_id=alert.id,
                        channel=alert.notify_channel,
                        recipient_address=recipient_addr,
                        payload={
                            "price": price,
                            "currency": result.get("currency", alert.currency or "USD"),
                            "provider": result.get("provider", "amadeus"),
                            "route": f"{alert.departure}-{alert.arrival}",
                            "departure_date": alert.departure_date.isoformat(),
                            "return_date": alert.return_date.isoformat() if alert.return_date else None,
                            "target_price": alert.max_price,
                            "details": result.get("details", {})
                        },
                        status=NotificationStatus.PENDING,
                        created_at=datetime.utcnow()
                    )
                    session.add(notif)
                    session.commit()
                    session.refresh(notif)
                    
                    # Send notification
                    await send_notification(notif, session)

            except Exception as e:
                logger.error(f"Error processing alert {alert.id}: {str(e)}")
                traceback.print_exc()
                continue
            
            session.commit()

def start_scheduler():
    """Start the background scheduler with async job support"""
    scheduler = BackgroundScheduler()
    
    async def run_check_alerts():
        try:
            await check_alerts_job()
        except Exception as e:
            logger.error(f"Error in check_alerts_job: {str(e)}")
            traceback.print_exc()
    
    # Add job with async wrapper
    scheduler.add_job(
        lambda: asyncio.run(run_check_alerts()), 
        "interval", 
        minutes=int(os.getenv("PRICE_CHECK_INTERVAL_MINUTES", "60")),
        id="check_alerts",
        max_instances=1  # Prevent overlapping runs
    )
    
    # Add error listener
    def job_error_listener(event):
        if event.exception:
            logger.error(f"Job {event.job_id} raised an exception: {str(event.exception)}")
    
    scheduler.add_listener(job_error_listener, EVENT_JOB_ERROR)
    
    scheduler.start()
    logger.info("Price check scheduler started")
    return scheduler