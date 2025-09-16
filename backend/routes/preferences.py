# routes/preferences.py
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import Optional
from database import get_session
from deps import get_current_user
from models import UserPreference, User
from schemas import UserPreferenceIn, UserPreferenceOut
from datetime import datetime

preferences_router = APIRouter()

@preferences_router.get("/", response_model=UserPreferenceOut)
def get_user_preferences(current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    """Get user preferences"""
    q = select(UserPreference).where(UserPreference.user_id == current_user.id)
    preferences = session.exec(q).first()
    
    if not preferences:
        # Create default preferences if none exist
        preferences = UserPreference(
            user_id=current_user.id,
            timezone="UTC",
            currency="USD",
            default_home_airport=None,
            preferred_notification_time_start=None,
            preferred_notification_time_end=None
        )
        session.add(preferences)
        session.commit()
        session.refresh(preferences)
    
    return preferences

@preferences_router.put("/", response_model=UserPreferenceOut)
def update_user_preferences(
    preferences_data: UserPreferenceIn,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Update user preferences"""
    q = select(UserPreference).where(UserPreference.user_id == current_user.id)
    preferences = session.exec(q).first()
    
    if not preferences:
        # Create new preferences
        preferences = UserPreference(
            user_id=current_user.id,
            **preferences_data.dict()
        )
        session.add(preferences)
    else:
        # Update existing preferences
        for key, value in preferences_data.dict(exclude_unset=True).items():
            setattr(preferences, key, value)
        preferences.updated_at = datetime.utcnow()
        session.add(preferences)
    
    session.commit()
    session.refresh(preferences)
    return preferences

@preferences_router.delete("/")
def delete_user_preferences(current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    """Delete user preferences (reset to defaults)"""
    q = select(UserPreference).where(UserPreference.user_id == current_user.id)
    preferences = session.exec(q).first()
    
    if preferences:
        session.delete(preferences)
        session.commit()
    
    return {"message": "Preferences reset to defaults"}

