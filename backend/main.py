# main.py
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from database import create_db_and_tables
from routes import auth as auth_routes, flights as flights_routes, alerts as alerts_routes, notifications as notifications_routes, weather as weather_routes, preferences as preferences_routes
from deps import get_current_user
from jobs import start_scheduler

load_dotenv()

app = FastAPI(title="Horizon API (backend) - adapted to extended models")

FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")
JOBS_ENABLED = os.getenv("JOBS_ENABLED", "false").lower() == "true"

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create DB + tables on startup
@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    # start background job scheduler (simple PoC)
    if JOBS_ENABLED:
        start_scheduler()

# Configure routers with root_path_in_servers=False to prevent redirect issues
app.include_router(
    auth_routes.auth_router,
    prefix="/api/auth",
    tags=["auth"],
)
app.include_router(
    flights_routes.flights_router,
    prefix="/api",
    tags=["flights"],
)
app.include_router(
    alerts_routes.alerts_router,
    prefix="/api/alerts",
    tags=["alerts"],
)
app.include_router(
    notifications_routes.notifications_router,
    prefix="/api/notifications",
    tags=["notifications"],
)
app.include_router(
    weather_routes.weather_router,
    prefix="/api/weather",
    tags=["weather"],
)
app.include_router(preferences_routes.preferences_router, prefix="/api/preferences", tags=["preferences"])