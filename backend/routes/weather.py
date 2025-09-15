import os
import requests
from fastapi import APIRouter, Query
from fastapi.responses import JSONResponse
import logging

logger = logging.getLogger(__name__)

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")
BASE_URL = "https://api.openweathermap.org/data/2.5/weather"

weather_router = APIRouter()


@weather_router.get("", summary="Get current weather by city name")
@weather_router.get("/", summary="Get current weather by city name")
async def get_weather(city: str = Query(..., description="City name")):
    if not OPENWEATHER_API_KEY:
        logger.error("OPENWEATHER_API_KEY not set")
        return JSONResponse(status_code=500, content={"error": "Weather API key not configured"})
    
    params = {
        "q": city,
        "appid": OPENWEATHER_API_KEY,
        "units": "metric"
    }
    
    try:
        logger.info(f"Querying weather for {city}")
        resp = requests.get(BASE_URL, params=params, timeout=10, allow_redirects=True)
        
        if resp.history:
            logger.warning(f"Request was redirected. History: {[r.status_code for r in resp.history]}")
            logger.warning(f"Final URL: {resp.url}")

        resp.raise_for_status()
        return resp.json()
        
    except requests.exceptions.RequestException as e:
        logger.error(f"Error querying OpenWeather API: {e}")
        if e.response is not None:
            logger.error(f"Response status: {e.response.status_code}")
            logger.error(f"Response body: {e.response.text}")
            return JSONResponse(status_code=e.response.status_code, content={"error": f"Error from weather provider: {e.response.text}"})
        return JSONResponse(status_code=500, content={"error": str(e)})
    except Exception as e:
        logger.error(f"An unexpected error occurred in get_weather: {e}")
        return JSONResponse(status_code=500, content={"error": "An internal error occurred"})


# Support legacy path-style requests from the frontend: /api/weather/{city}
@weather_router.get("/{city}", summary="Get current weather by city name (path)")
async def get_weather_by_path(city: str):
    return await get_weather(city=city)
