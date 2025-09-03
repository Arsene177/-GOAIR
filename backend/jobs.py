# jobs.py
from apscheduler.schedulers.background import BackgroundScheduler
from sqlmodel import select
from database import engine, get_session
from models import Alert, Notification, APIProvider, PriceCheckJobLog
from datetime import datetime
from email.utils import formatdate
import traceback

# Replace with real provider adapter
def query_provider_for_alert(alert: Alert):
    """
    Mock a provider check: returns a dict: {"price": float, "currency": "USD", "provider": "mock-provider", "details": {...}}
    Replace this with actual provider adapter logic.
    """
    import random
    price = random.uniform(50, 400)  # random price
    return {"price": round(price, 2), "currency": alert.currency or "USD", "provider": "mock-provider", "details": {}}

def send_notification(notification: Notification, session):
    """
    Mock send: set status to SENT and sent_at timestamp.
    Replace with actual send logic (SendGrid, Twilio, FCM).
    """
    try:
        # Here you'd branch by notification.channel and call the proper API.
        print(f"[send_notification] sending {notification.channel} to {notification.recipient_address} payload={notification.payload}")
        notification.status = "sent"
        notification.sent_at = datetime.utcnow()
        session.add(notification)
        session.commit()
        return True
    except Exception as e:
        notification.attempts += 1
        notification.last_error = str(e)
        session.add(notification)
        session.commit()
        return False

def check_alerts_job():
    from database import engine
    from sqlmodel import Session
    print("[jobs] Running check_alerts_job", datetime.utcnow().isoformat())
    with Session(engine) as session:
        q = select(Alert).where(Alert.active == True)
        alerts = session.exec(q).all()
        for alert in alerts:
            try:
                result = query_provider_for_alert(alert)
                price = result["price"]
                matched = False
                if alert.max_price is not None and price <= alert.max_price:
                    matched = True

                # record job log
                job_log = PriceCheckJobLog(alert_id=alert.id, ran_at=datetime.utcnow(), checked_price=price, currency=result.get("currency"), matched=matched, details=result.get("details"))
                session.add(job_log)

                alert.last_checked_at = datetime.utcnow()
                session.add(alert)
                session.commit()

                if matched:
                    # create notification (pending)
                    notif = Notification(user_id=alert.user_id, alert_id=alert.id, channel=alert.notify_channel, recipient_address=None, payload={"price": price, "provider": result.get("provider")}, status="pending", created_at=datetime.utcnow())
                    session.add(notif)
                    session.commit()
                    session.refresh(notif)
                    # send immediately (for PoC)
                    send_notification(notif, session)

            except Exception:
                traceback.print_exc()
                continue

def start_scheduler():
    scheduler = BackgroundScheduler()
    # run every minute — adjust for production
    scheduler.add_job(check_alerts_job, "interval", minutes=1, id="check_alerts")
    scheduler.start()
    return scheduler