// Service pour la météo
export const weatherService = {
  // GET /api/weather?city=CityName
  getWeather: async (city: string) => {
    try {
      const response = await api.get(`/weather`, { params: { city } });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des données météo:', error);
      throw error;
    }
  }
};
import axios from 'axios';
import { FlightSearch, FlightSearchResponse, LoginRequest, RegisterRequest, AuthResponse, Flight, User } from '../types';


// Configuration de base d'axios
const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers = config.headers || {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Helpers de mapping backend -> frontend ---
function minutesToDuration(minutes?: number | null): string {
  if (!minutes && minutes !== 0) return '';
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return `${h}h ${m}m`;
}

function placeholderLogo(code?: string | null, airline?: string | null): string {
  const text = (code || airline || 'FL').slice(0, 2).toUpperCase();
  return `https://via.placeholder.com/60x40/0f172a/FFFFFF?text=${encodeURIComponent(text)}`;
}

function mapBackendToFlight(front: any): Flight {
  return {
    id: String(front.provider_flight_id ?? front.id ?? cryptoRandomId()),
    airline: front.airline ?? front.provider_name ?? 'Unknown',
    airlineLogo: placeholderLogo(front.airline_code, front.airline),
    departureAirport: front.departure_airport_code ?? front.departure_airport ?? '',
    arrivalAirport: front.arrival_airport_code ?? front.arrival_airport ?? '',
    departureTime: String(front.departure_time ?? ''),
    arrivalTime: String(front.arrival_time ?? ''),
    duration: minutesToDuration(front.duration_minutes ?? null),
    price: Number(front.price ?? 0),
    currency: String(front.currency ?? 'USD'),
    stops: Number(front.stops ?? 0),
    prediction: {
      trend: 'stable',
      confidence: 70,
      recommendation: 'Prix stable, vous pouvez attendre'
    }
  };
}

function cryptoRandomId(): string {
  // Fallback simple si crypto indisponible
  try {
    const bytes = new Uint8Array(8);
    (window.crypto || (window as any).msCrypto).getRandomValues(bytes);
    return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  } catch {
    return Math.random().toString(36).slice(2);
  }
}

function mapBackendUser(u: any): User {
  return {
    id: String(u.id),
    email: u.email,
    firstName: u.first_name ?? u.firstName ?? '',
    lastName: u.last_name ?? u.lastName ?? '',
  };
}

// Service pour les vols
export const flightService = {
  // GET /api/flights - Recherche de vols
  searchFlights: async (searchParams: FlightSearch): Promise<FlightSearchResponse> => {
    try {
      const response = await api.get('/flights', { params: searchParams });
      const data = response.data as any;
      const flights = (data.flights ?? []).map(mapBackendToFlight);
      return {
        flights,
        totalCount: Number(data.total_count ?? data.totalCount ?? flights.length),
        searchId: String(data.search_id ?? data.searchId ?? ''),
      };
    } catch (error) {
      console.error('Erreur lors de la recherche de vols:', error);
      throw error;
    }
  },

  // GET /api/flights/:id - Détails d'un vol (si disponible côté backend)
  getFlightDetails: async (flightId: string) => {
    try {
      const response = await api.get(`/flights/${flightId}`);
      const d = response.data as any;
      return mapBackendToFlight(d);
    } catch (error) {
      console.error('Erreur lors de la récupération des détails du vol:', error);
      throw error;
    }
  }
};

// Service pour l'authentification
export const authService = {
  // POST /api/auth/login - Connexion utilisateur
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      const tokenRes = await api.post('/auth/login', credentials);
      const tokenData = tokenRes.data as { access_token: string; expires_in: number };
      localStorage.setItem('accessToken', tokenData.access_token);
      const meRes = await api.get('/auth/me');
      const me = mapBackendUser(meRes.data);
      return {
        accessToken: tokenData.access_token,
        user: me,
        expiresIn: Number(tokenData.expires_in ?? 0),
      };
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      try { localStorage.removeItem('accessToken'); } catch {}
      throw error;
    }
  },

  // POST /api/auth/register - Inscription utilisateur
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    try {
      const regRes = await api.post('/auth/register', {
        email: userData.email,
        password: userData.password,
        first_name: userData.firstName,
        last_name: userData.lastName,
      });
      const tokenData = regRes.data as { access_token: string; expires_in: number };
      localStorage.setItem('accessToken', tokenData.access_token);
      const meRes = await api.get('/auth/me');
      const me = mapBackendUser(meRes.data);
      return {
        accessToken: tokenData.access_token,
        user: me,
        expiresIn: Number(tokenData.expires_in ?? 0),
      };
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      try { localStorage.removeItem('accessToken'); } catch {}
      throw error;
    }
  },

  // POST /api/auth/logout - Déconnexion
  logout: async () => {
    try {
      // Pas de route logout côté backend pour l'instant; on nettoie côté client
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  },

  // GET /api/auth/me - Récupérer les informations de l'utilisateur connecté
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return mapBackendUser(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des informations utilisateur:", error);
      throw error;
    }
  }
};

export default api;
