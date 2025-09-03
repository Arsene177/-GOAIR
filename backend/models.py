# models.py
from __future__ import annotations
from typing import Optional, List
from datetime import datetime
import enum

import sqlalchemy as sa
from sqlmodel import SQLModel, Field, Relationship, Column


# ---------------------------
# Enums
# ---------------------------
class UserRole(str, enum.Enum):
    USER = "user"
    ADMIN = "admin"
    SUPPORT = "support"


class NotificationChannel(str, enum.Enum):
    EMAIL = "email"
    SMS = "sms"
    PUSH = "push"


class NotificationStatus(str, enum.Enum):
    PENDING = "pending"
    SENT = "sent"
    FAILED = "failed"


# ---------------------------
# Core models
# ---------------------------
class User(SQLModel, table=True):
    __tablename__ = "user"

    id: Optional[int] = Field(default=None, primary_key=True)
    # moved index/nullable/unique into sa_column where needed; removed index flag when sa_column present
    email: str = Field(sa_column=Column(sa.String, nullable=False, unique=True))
    hashed_password: str = Field(sa_column=Column(sa.String),)
    first_name: Optional[str] = Field(default=None)
    last_name: Optional[str] = Field(default=None)
    is_active: bool = Field(default=True)
    role: UserRole = Field(
        default=UserRole.USER,
        sa_column=Column(sa.Enum(UserRole), server_default=UserRole.USER.value),
    )
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # relationships (omitted for now to simplify mapper setup under SA 2.x)


# ---------------------------
# Search & cache models
# ---------------------------
class Search(SQLModel, table=True):
    __tablename__ = "search"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: Optional[int] = Field(default=None, foreign_key="user.id", index=True)
    params: Optional[dict] = Field(default=None, sa_column=Column(sa.JSON))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    search_hash: Optional[str] = Field(default=None, index=True)
    results_count: Optional[int] = Field(default=0)
    saved: bool = Field(default=False)

    # relationships omitted


class Flight(SQLModel, table=True):
    __tablename__ = "flight"

    id: Optional[int] = Field(default=None, primary_key=True)
    provider_flight_id: Optional[str] = Field(default=None, index=True)
    provider_name: Optional[str] = Field(default=None, index=True)
    airline: Optional[str] = Field(default=None)
    airline_code: Optional[str] = Field(default=None)
    airline_logo: Optional[str] = Field(default=None)
    departure_airport_code: Optional[str] = Field(default=None, index=True)
    departure_airport_name: Optional[str] = Field(default=None)
    arrival_airport_code: Optional[str] = Field(default=None, index=True)
    arrival_airport_name: Optional[str] = Field(default=None)
    departure_time: Optional[datetime] = Field(default=None, index=True)
    arrival_time: Optional[datetime] = Field(default=None)
    duration_minutes: Optional[int] = Field(default=None)
    duration_str: Optional[str] = Field(default=None)
    stops: Optional[int] = Field(default=0)
    cabin_class: Optional[str] = Field(default="economy")
    price: Optional[float] = Field(default=None)
    currency: Optional[str] = Field(default="USD")
    seats_left: Optional[int] = Field(default=None)
    refundable: Optional[bool] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_seen_at: datetime = Field(default_factory=datetime.utcnow)
    cached: bool = Field(default=True)

    search_id: Optional[int] = Field(default=None, foreign_key="search.id", index=True)

    # relationships omitted


class FlightLeg(SQLModel, table=True):
    __tablename__ = "flight_leg"

    id: Optional[int] = Field(default=None, primary_key=True)
    flight_id: Optional[int] = Field(default=None, foreign_key="flight.id", index=True)
    leg_number: int = Field(default=1)
    departure_airport: Optional[str] = Field(default=None)
    arrival_airport: Optional[str] = Field(default=None)
    departure_time: Optional[datetime] = Field(default=None)
    arrival_time: Optional[datetime] = Field(default=None)
    duration_minutes: Optional[int] = Field(default=None)
    carrier: Optional[str] = Field(default=None)
    flight_number: Optional[str] = Field(default=None)

    # relationship omitted


class FlightPriceHistory(SQLModel, table=True):
    __tablename__ = "flight_price_history"

    id: Optional[int] = Field(default=None, primary_key=True)
    flight_id: Optional[int] = Field(default=None, foreign_key="flight.id", index=True)
    price: float = Field()
    currency: Optional[str] = Field(default="USD")
    recorded_at: datetime = Field(default_factory=datetime.utcnow)

    # relationship omitted


# ---------------------------
# Alerts / notifications
# ---------------------------
class Alert(SQLModel, table=True):
    __tablename__ = "alert"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    name: Optional[str] = Field(default=None)
    departure: Optional[str] = Field(default=None)
    arrival: Optional[str] = Field(default=None)
    departure_date: Optional[datetime] = Field(default=None)
    return_date: Optional[datetime] = Field(default=None)
    max_price: Optional[float] = Field(default=None)
    currency: Optional[str] = Field(default="USD")
    active: bool = Field(default=True, index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_checked_at: Optional[datetime] = Field(default=None)
    last_notified_at: Optional[datetime] = Field(default=None)
    check_frequency_minutes: int = Field(default=60)
    notify_channel: NotificationChannel = Field(
        default=NotificationChannel.EMAIL,
        sa_column=Column(sa.Enum(NotificationChannel)),
    )
    provider_hint: Optional[str] = Field(default=None)

    # relationships omitted


class Notification(SQLModel, table=True):
    __tablename__ = "notification"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: Optional[int] = Field(default=None, foreign_key="user.id", index=True)
    alert_id: Optional[int] = Field(default=None, foreign_key="alert.id", index=True)
    channel: NotificationChannel = Field(
        default=NotificationChannel.EMAIL,
        sa_column=Column(sa.Enum(NotificationChannel)),
    )
    recipient_address: Optional[str] = Field(default=None)
    payload: Optional[dict] = Field(default=None, sa_column=Column(sa.JSON))
    status: NotificationStatus = Field(
        default=NotificationStatus.PENDING,
        sa_column=Column(sa.Enum(NotificationStatus)),
    )
    attempts: int = Field(default=0)
    last_error: Optional[str] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    sent_at: Optional[datetime] = Field(default=None)

    # relationships omitted


# ---------------------------
# Providers / job logs / misc
# ---------------------------
class APIProvider(SQLModel, table=True):
    __tablename__ = "api_provider"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    base_url: Optional[str] = Field(default=None)
    api_key: Optional[str] = Field(default=None)
    active: bool = Field(default=True)
    meta: Optional[dict] = Field(default=None, sa_column=Column(sa.JSON))
    created_at: datetime = Field(default_factory=datetime.utcnow)


class PriceCheckJobLog(SQLModel, table=True):
    __tablename__ = "price_check_job_log"

    id: Optional[int] = Field(default=None, primary_key=True)
    alert_id: Optional[int] = Field(default=None, foreign_key="alert.id", index=True)
    ran_at: datetime = Field(default_factory=datetime.utcnow)
    checked_price: Optional[float] = Field(default=None)
    currency: Optional[str] = Field(default="USD")
    matched: bool = Field(default=False)
    details: Optional[dict] = Field(default=None, sa_column=Column(sa.JSON))

    # relationship omitted


# ---------------------------
# Saved itineraries & device tokens
# ---------------------------
class SavedItinerary(SQLModel, table=True):
    __tablename__ = "saved_itinerary"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: Optional[int] = Field(default=None, foreign_key="user.id", index=True)
    name: Optional[str] = Field(default=None)
    itinerary_data: Optional[dict] = Field(default=None, sa_column=Column(sa.JSON))
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # relationship omitted


class DeviceToken(SQLModel, table=True):
    __tablename__ = "device_token"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: Optional[int] = Field(default=None, foreign_key="user.id", index=True)
    device_type: Optional[str] = Field(default=None)
    token: Optional[str] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_used_at: Optional[datetime] = Field(default=None)

    # relationship omitted


# ---------------------------
# Preferences & audit
# ---------------------------
class UserPreference(SQLModel, table=True):
    __tablename__ = "user_preference"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: Optional[int] = Field(default=None, foreign_key="user.id", index=True)
    timezone: Optional[str] = Field(default="UTC")
    currency: Optional[str] = Field(default="USD")
    default_home_airport: Optional[str] = Field(default=None)
    preferred_notification_time_start: Optional[str] = Field(default=None)
    preferred_notification_time_end: Optional[str] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # relationship omitted


class AuditLog(SQLModel, table=True):
    __tablename__ = "audit_log"

    id: Optional[int] = Field(default=None, primary_key=True)
    entity_table: Optional[str] = Field(default=None)
    entity_id: Optional[int] = Field(default=None)
    action: Optional[str] = Field(default=None)
    actor_id: Optional[int] = Field(default=None)
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    changes: Optional[dict] = Field(default=None, sa_column=Column(sa.JSON))


__all__ = [
    "User",
    "UserRole",
    "Search",
    "Flight",
    "FlightLeg",
    "FlightPriceHistory",
    "Alert",
    "Notification",
    "APIProvider",
    "PriceCheckJobLog",
    "SavedItinerary",
    "DeviceToken",
    "UserPreference",
    "AuditLog",
    "NotificationChannel",
    "NotificationStatus",
]
