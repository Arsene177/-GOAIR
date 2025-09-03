import os
import requests
from fastapi import APIRouter, Query
from fastapi.responses import JSONResponse

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")
BASE_URL = "https://api.openweathermap.org/data/2.5/weather"

weather_router = APIRouter()

@weather_router.get("/", summary="Get current weather by city name")
def get_weather(city: str = Query(..., description="City name")):
    if not OPENWEATHER_API_KEY:
        return JSONResponse(status_code=500, content={"error": "API key not set"})
    params = {
        "q": city,
        "appid": OPENWEATHER_API_KEY,
        "units": "metric"
    }
    try:
        resp = requests.get(BASE_URL, params=params, timeout=5)
        resp.raise_for_status()
        return resp.json()
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
