from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from database import get_session
from deps import get_current_user
from models import DeviceToken, User
from datetime import datetime
import os

device_router = APIRouter()

@device_router.post("/register-device")
async def register_device(
    token_data: dict,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Register a device token for push notifications"""
    # Check if token already exists
    q = select(DeviceToken).where(
        DeviceToken.user_id == current_user.id,
        DeviceToken.token == token_data["token"]
    )
    existing_token = session.exec(q).first()
    
    if existing_token:
        # Update last used timestamp
        existing_token.last_used_at = datetime.utcnow()
        session.add(existing_token)
    else:
        # Create new token
        device_token = DeviceToken(
            user_id=current_user.id,
            token=token_data["token"],
            device_type=token_data.get("device_type", "web"),
            last_used_at=datetime.utcnow()
        )
        session.add(device_token)
    
    session.commit()
    return {"message": "Device registered successfully"}

@device_router.post("/unregister-device")
async def unregister_device(
    token_data: dict,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Unregister a device token"""
    q = select(DeviceToken).where(
        DeviceToken.user_id == current_user.id,
        DeviceToken.token == token_data["token"]
    )
    device_token = session.exec(q).first()
    
    if device_token:
        session.delete(device_token)
        session.commit()
    
    return {"message": "Device unregistered successfully"}

@device_router.get("/vapid-key")
async def get_vapid_key():
    """Get the VAPID public key for push notifications"""
    vapid_public_key = os.getenv("VAPID_PUBLIC_KEY")
    if not vapid_public_key:
        raise HTTPException(
            status_code=500,
            detail="VAPID public key not configured"
        )
    return {"vapidKey": vapid_public_key}