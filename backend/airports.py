import os
from amadeus import Client, ResponseError
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

amadeus = Client(
    client_id=os.getenv("AMADEUS_CLIENT_ID"),
    client_secret=os.getenv("AMADEUS_CLIENT_SECRET")
)

try:
    # Example: find all airports related to "LON" (London)
    response = amadeus.reference_data.locations.get(
        keyword='LON',
        subType='AIRPORT'
    )

    for airport in response.data:
        print(airport['iataCode'], "-", airport['name'])
except ResponseError as error:
    print(error)
