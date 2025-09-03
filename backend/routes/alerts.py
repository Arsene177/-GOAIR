# routes/alerts.py
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from database import get_session
from deps import get_current_user
from models import Alert
from schemas import AlertIn, AlertOut

alerts_router = APIRouter()

@alerts_router.post("/", response_model=AlertOut)
def create_alert(payload: AlertIn, current_user=Depends(get_current_user), session: Session = Depends(get_session)):
    alert = Alert(
        user_id=current_user.id,
        name=payload.name,
        departure=payload.departure,
        arrival=payload.arrival,
        departure_date=payload.departure_date,
        return_date=payload.return_date,
        max_price=payload.max_price,
        currency=payload.currency,
        check_frequency_minutes=payload.check_frequency_minutes or 60,
        notify_channel=payload.notify_channel,
        active=True
    )
    session.add(alert)
    session.commit()
    session.refresh(alert)
    return alert

@alerts_router.get("/", response_model=List[AlertOut])
def list_alerts(current_user=Depends(get_current_user), session: Session = Depends(get_session)):
    q = select(Alert).where(Alert.user_id == current_user.id)
    items = session.exec(q).all()
    return items

@alerts_router.get("/{alert_id}", response_model=AlertOut)
def get_alert(alert_id: int, current_user=Depends(get_current_user), session: Session = Depends(get_session)):
    alert = session.get(Alert, alert_id)
    if not alert or alert.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Alert not found")
    return alert

@alerts_router.put("/{alert_id}", response_model=AlertOut)
def update_alert(alert_id: int, payload: AlertIn, current_user=Depends(get_current_user), session: Session = Depends(get_session)):
    alert = session.get(Alert, alert_id)
    if not alert or alert.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Alert not found")
    for k, v in payload.dict(exclude_unset=True).items():
        setattr(alert, k, v)
    session.add(alert)
    session.commit()
    session.refresh(alert)
    return alert

@alerts_router.delete("/{alert_id}")
def delete_alert(alert_id: int, current_user=Depends(get_current_user), session: Session = Depends(get_session)):
    alert = session.get(Alert, alert_id)
    if not alert or alert.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Alert not found")
    session.delete(alert)
    session.commit()
    return {"ok": True}

