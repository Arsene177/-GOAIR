# routes/flights.py
from fastapi import APIRouter, Query, Depends, HTTPException
from typing import List
from sqlmodel import Session
from database import get_session
from schemas import FlightsResponse, FlightOut
from models import Search, Flight, FlightLeg, FlightPriceHistory
import uuid
from datetime import datetime, timedelta
import os
from amadeus import Client, ResponseError

flights_router = APIRouter()

# Initialize Amadeus client
amadeus = Client(
    client_id=os.getenv('AMADEUS_CLIENT_ID'),
    client_secret=os.getenv('AMADEUS_CLIENT_SECRET'),
    hostname='test' if os.getenv('AMADEUS_TEST', 'true').lower() == 'true' else 'production'
)

def fetch_flights_from_provider(departure: str, arrival: str, departure_date: str = None, **kwargs):
    """
    Fetch real flight data from Amadeus API
    """
    try:
        print(f"Starting flight search: {departure} to {arrival} on {departure_date}")
        
        # Format date if provided, otherwise use tomorrow
        if not departure_date:
            tomorrow = datetime.now() + timedelta(days=1)
            departure_date = tomorrow.strftime('%Y-%m-%d')
        
        print(f"Using Amadeus API with credentials: {os.getenv('AMADEUS_CLIENT_ID')} (Test mode: {os.getenv('AMADEUS_TEST', 'true')})")
        
        # Search flights using Amadeus API
        print(f"Searching direct flights first...")
        try:
            response = amadeus.shopping.flight_offers_search.get(
                originLocationCode=departure,
                destinationLocationCode=arrival,
                departureDate=departure_date,
                adults=kwargs.get('passengers', 1),
                currencyCode='XAF',  # Using Central African CFA franc for local flights
                max=5,  # Limit results for faster response
                nonStop=True  # Try to get direct flights first
            )
        except ResponseError:
            print("No direct flights found, searching for all routes...")
            response = amadeus.shopping.flight_offers_search.get(
                originLocationCode=departure,
                destinationLocationCode=arrival,
                departureDate=departure_date,
                adults=kwargs.get('passengers', 1),
                currencyCode='XAF',
                max=5
            )
        
        print(f"Amadeus API response received with {len(response.data)} offers")
        # Debug: Print full response for analysis
        for offer in response.data:
            price = offer['price']['total']
            duration = offer['itineraries'][0]['duration']
            segments = offer['itineraries'][0]['segments']
            route = ' -> '.join([s['departure']['iataCode'] for s in segments] + [segments[-1]['arrival']['iataCode']])
            print(f"Found route: {route}, Duration: {duration}, Price: {price} XAF")

        flights = []
        for offer in response.data:
            # Extract main flight info
            itinerary = offer['itineraries'][0]
            first_segment = itinerary['segments'][0]
            last_segment = itinerary['segments'][-1]

            def parse_duration(duration_str):
                # Parse ISO 8601 duration format (e.g., "PT8H15M" -> 495 minutes)
                duration_str = duration_str.replace('PT', '')
                hours = 0
                minutes = 0
                
                if 'H' in duration_str:
                    h_split = duration_str.split('H')
                    hours = int(h_split[0])
                    duration_str = h_split[1]
                
                if 'M' in duration_str:
                    m_split = duration_str.split('M')
                    minutes = int(m_split[0])
                
                return hours * 60 + minutes

            # Filter out unreasonable routes for domestic flights
            if departure in ['DLA', 'NSI', 'GOU', 'MVR', 'NGE'] and arrival in ['DLA', 'NSI', 'GOU', 'MVR', 'NGE']:
                # For domestic Cameroon flights, skip if duration > 3 hours
                if parse_duration(itinerary['duration']) > 180:
                    print(f"Skipping unreasonable domestic route with duration: {itinerary['duration']}")
                    continue

            flight = {
                "provider_flight_id": offer['id'],
                "provider_name": "Amadeus",
                "airline": first_segment['carrierCode'],
                "departure_airport_code": first_segment['departure']['iataCode'],
                "arrival_airport_code": last_segment['arrival']['iataCode'],
                "departure_time": first_segment['departure']['at'],
                "arrival_time": last_segment['arrival']['at'],
                "duration_minutes": parse_duration(itinerary['duration']),
                "price": float(offer['price']['total']),
                "currency": offer['price']['currency'],
                "stops": len(itinerary['segments']) - 1,
                "legs": []
            }

            # Add individual flight legs
            for idx, segment in enumerate(itinerary['segments'], 1):
                leg = {
                    "leg_number": idx,
                    "departure_airport": segment['departure']['iataCode'],
                    "arrival_airport": segment['arrival']['iataCode'],
                    "departure_time": segment['departure']['at'],
                    "arrival_time": segment['arrival']['at'],
                    "duration_minutes": parse_duration(segment['duration']),
                    "carrier": segment['carrierCode'],
                    "flight_number": segment['number']
                }
                flight['legs'].append(leg)

            flights.append(flight)

        return flights

    except ResponseError as error:
        print(f"Amadeus API error: {error}")
        error_message = f"Flight search failed: {str(error)}"
        if hasattr(error, 'response') and hasattr(error.response, 'body'):
            error_message = error.response.body.get('errors', [{}])[0].get('detail', error_message)
        raise HTTPException(status_code=error.response.status_code, detail=error_message)
    except Exception as error:
        print(f"Error fetching flights: {error}")
        raise HTTPException(
            status_code=500,
            detail="Unable to fetch flights at this time. Please try again in a few minutes."
        )

@flights_router.get("/flights", response_model=FlightsResponse)
def get_flights(departure: str = Query(...), arrival: str = Query(...),
                departureDate: str = Query(None), session: Session = Depends(get_session)):
    results = fetch_flights_from_provider(departure, arrival, departureDate)
    # create a Search record
    search = Search(
        user_id=None,
        params={"departure": departure, "arrival": arrival, "departureDate": departureDate},
        created_at=datetime.utcnow(),
        search_hash=str(uuid.uuid4()),
        results_count=len(results)
    )
    session.add(search)
    session.commit()
    session.refresh(search)

    flights_out = []
    for r in results:
        # Parse times to datetime objects if they are strings
        def parse_dt(val):
            if isinstance(val, str):
                try:
                    return datetime.fromisoformat(val)
                except Exception:
                    return None
            return val

        flight = Flight(
            provider_flight_id=r["provider_flight_id"],
            provider_name=r["provider_name"],
            airline=r["airline"],
            departure_airport_code=r["departure_airport_code"],
            arrival_airport_code=r["arrival_airport_code"],
            departure_time=parse_dt(r["departure_time"]),
            arrival_time=parse_dt(r["arrival_time"]),
            duration_minutes=r.get("duration_minutes"),
            price=r.get("price"),
            currency=r.get("currency"),
            stops=r.get("stops"),
            cached=True,
            search_id=search.id
        )
        session.add(flight)
        session.commit()
        session.refresh(flight)

        # legs
        for leg in r.get("legs", []):
            leg_obj = FlightLeg(
                flight_id=flight.id,
                leg_number=leg.get("leg_number", 1),
                departure_airport=leg.get("departure_airport"),
                arrival_airport=leg.get("arrival_airport"),
                departure_time=parse_dt(leg.get("departure_time")),
                arrival_time=parse_dt(leg.get("arrival_time")),
                duration_minutes=leg.get("duration_minutes"),
                carrier=leg.get("carrier"),
                flight_number=leg.get("flight_number")
            )
            session.add(leg_obj)

        # price history entry
        ph = FlightPriceHistory(flight_id=flight.id, price=flight.price, currency=flight.currency)
        session.add(ph)
        session.commit()

        flights_out.append({
            "provider_flight_id": flight.provider_flight_id,
            "provider_name": flight.provider_name,
            "airline": flight.airline,
            "departure_airport_code": flight.departure_airport_code,
            "arrival_airport_code": flight.arrival_airport_code,
            "departure_time": flight.departure_time,
            "arrival_time": flight.arrival_time,
            "duration_minutes": flight.duration_minutes,
            "price": flight.price,
            "currency": flight.currency,
            "stops": flight.stops,
            "legs": r.get("legs", [])
        })

    return {"search_id": str(search.id), "flights": flights_out, "total_count": len(flights_out)}