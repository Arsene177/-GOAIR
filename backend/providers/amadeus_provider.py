from amadeus import Client
from datetime import datetime
from typing import Dict, Optional
import os

class AmadeusProvider:
    def __init__(self):
        self.amadeus = Client(
            client_id=os.getenv('AMADEUS_CLIENT_ID'),
            client_secret=os.getenv('AMADEUS_CLIENT_SECRET'),
            hostname='test' if os.getenv('AMADEUS_TEST_MODE', 'true').lower() == 'true' else None
        )

    def check_price(self, departure: str, arrival: str, departure_date: datetime, return_date: Optional[datetime] = None) -> Dict:
        """
        Query Amadeus API for current prices
        """
        try:
            response = self.amadeus.shopping.flight_offers_search.get(
                originLocationCode=departure,
                destinationLocationCode=arrival,
                departureDate=departure_date.strftime("%Y-%m-%d"),
                returnDate=return_date.strftime("%Y-%m-%d") if return_date else None,
                adults=1,
                currencyCode='XAF',
                max=1  # We just need the lowest price
            )

            if response.data:
                offer = response.data[0]
                return {
                    "price": float(offer['price']['total']),
                    "currency": offer['price']['currency'],
                    "provider": "amadeus",
                    "details": {
                        "flight_id": offer['id'],
                        "validating_airline": offer.get('validatingAirlineCodes', [None])[0],
                        "last_ticketing_date": offer.get('lastTicketingDate'),
                    }
                }
            
            return None
        except Exception as e:
            print(f"Error querying Amadeus: {str(e)}")
            return None
