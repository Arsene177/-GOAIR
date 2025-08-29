import { Flight } from '../types';

export const mockFlights: Flight[] = [
  {
    id: '1',
    airline: 'Air France',
    airlineLogo: 'https://via.placeholder.com/60x40/003366/FFFFFF?text=AF',
    departureAirport: 'CDG',
    arrivalAirport: 'JFK',
    departureTime: '2024-01-15T10:30:00Z',
    arrivalTime: '2024-01-15T13:45:00Z',
    duration: '8h 15m',
    price: 450,
    currency: 'EUR',
    stops: 0,
    prediction: {
      trend: 'down',
      confidence: 85,
      recommendation: 'Prix en baisse, réservez maintenant !'
    }
  },
  {
    id: '2',
    airline: 'Delta Airlines',
    airlineLogo: 'https://via.placeholder.com/60x40/0066CC/FFFFFF?text=DL',
    departureAirport: 'CDG',
    arrivalAirport: 'JFK',
    departureTime: '2024-01-15T14:15:00Z',
    arrivalTime: '2024-01-15T17:30:00Z',
    duration: '8h 15m',
    price: 520,
    currency: 'EUR',
    stops: 0,
    prediction: {
      trend: 'stable',
      confidence: 70,
      recommendation: 'Prix stable, vous pouvez attendre'
    }
  },
  {
    id: '3',
    airline: 'British Airways',
    airlineLogo: 'https://via.placeholder.com/60x40/075698/FFFFFF?text=BA',
    departureAirport: 'CDG',
    arrivalAirport: 'JFK',
    departureTime: '2024-01-15T16:45:00Z',
    arrivalTime: '2024-01-15T20:00:00Z',
    duration: '8h 15m',
    price: 380,
    currency: 'EUR',
    stops: 1,
    prediction: {
      trend: 'up',
      confidence: 90,
      recommendation: 'Prix en hausse, réservez rapidement !'
    }
  },
  {
    id: '4',
    airline: 'Lufthansa',
    airlineLogo: 'https://via.placeholder.com/60x40/05164D/FFFFFF?text=LH',
    departureAirport: 'CDG',
    arrivalAirport: 'JFK',
    departureTime: '2024-01-15T19:30:00Z',
    arrivalTime: '2024-01-15T22:45:00Z',
    duration: '8h 15m',
    price: 410,
    currency: 'EUR',
    stops: 0,
    prediction: {
      trend: 'down',
      confidence: 75,
      recommendation: 'Prix en baisse, bonne opportunité'
    }
  }
];

export const mockFlightSearchResponse = {
  flights: mockFlights,
  totalCount: mockFlights.length,
  searchId: 'search_123456'
}; 