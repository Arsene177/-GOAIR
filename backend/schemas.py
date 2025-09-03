# schemas.py
from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime

# --- Auth ---
class RegisterIn(BaseModel):
    email: str
    password: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None

class LoginIn(BaseModel):
    email: str
    password: str

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int

# --- Flights & search ---
class FlightLegOut(BaseModel):
    leg_number: int
    departure_airport: Optional[str]
    arrival_airport: Optional[str]
    departure_time: Optional[datetime]
    arrival_time: Optional[datetime]
    duration_minutes: Optional[int]
    carrier: Optional[str]
    flight_number: Optional[str]

class FlightOut(BaseModel):
    provider_flight_id: Optional[str]
    provider_name: Optional[str]
    airline: Optional[str]
    departure_airport_code: Optional[str]
    arrival_airport_code: Optional[str]
    departure_time: Optional[datetime]
    arrival_time: Optional[datetime]
    duration_minutes: Optional[int]
    price: Optional[float]
    currency: Optional[str]
    stops: Optional[int]
    legs: Optional[List[FlightLegOut]]

class FlightsResponse(BaseModel):
    search_id: str
    flights: List[FlightOut]
    total_count: int

# --- Alerts ---
class AlertIn(BaseModel):
    name: Optional[str]
    departure: Optional[str]
    arrival: Optional[str]
    departure_date: Optional[datetime]
    return_date: Optional[datetime]
    max_price: Optional[float]
    currency: Optional[str] = "USD"
    check_frequency_minutes: Optional[int] = 60
    notify_channel: Optional[str] = "email"

class AlertOut(AlertIn):
    id: int
    user_id: int
    active: bool
    created_at: datetime
    last_checked_at: Optional[datetime]

# --- Notification ---
class NotificationOut(BaseModel):
    id: int
    alert_id: Optional[int]
    user_id: Optional[int]
    channel: Optional[str]
    recipient_address: Optional[str]
    payload: Optional[Any]
    status: Optional[str]
    created_at: Optional[datetime]
    sent_at: Optional[datetime]
