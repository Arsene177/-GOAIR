# routes/notifications.py
from fastapi import APIRouter, Depends
from sqlmodel import select
from typing import List
from database import get_session
from deps import get_current_user
from models import Notification
from schemas import NotificationOut

notifications_router = APIRouter()

@notifications_router.get("/", response_model=List[NotificationOut])
def list_notifications(current_user=Depends(get_current_user), session=Depends(get_session)):
    q = select(Notification).where(Notification.user_id == current_user.id).order_by(Notification.created_at.desc())
    items = session.exec(q).all()
    return items

