import axios from 'axios';
import { FlightSearch, FlightSearchResponse, LoginRequest, RegisterRequest, AuthResponse } from '../types';
import { mockFlightSearchResponse } from '../mocks/flights';
import { mockLoginResponse, mockRegisterResponse } from '../mocks/auth';

// Configuration de base d'axios
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

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
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Service pour les vols
export const flightService = {
  // GET /api/flights - Recherche de vols
  searchFlights: async (searchParams: FlightSearch): Promise<FlightSearchResponse> => {
    try {
      // En mode développement, utiliser les données simulées
      if (import.meta.env.DEV) {
        // Simuler un délai réseau
        await new Promise(resolve => setTimeout(resolve, 1000));
        return mockFlightSearchResponse;
      }
      
      const response = await api.get('/flights', { params: searchParams });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la recherche de vols:', error);
      throw error;
    }
  },

  // GET /api/flights/:id - Détails d'un vol
  getFlightDetails: async (flightId: string) => {
    try {
      const response = await api.get(`/flights/${flightId}`);
      return response.data;
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
      // En mode développement, utiliser les données simulées
      if (import.meta.env.DEV) {
        await new Promise(resolve => setTimeout(resolve, 800));
        return mockLoginResponse.data;
      }
      
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    }
  },

  // POST /api/auth/register - Inscription utilisateur
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    try {
      // En mode développement, utiliser les données simulées
      if (import.meta.env.DEV) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return mockRegisterResponse.data;
      }
      
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      throw error;
    }
  },

  // POST /api/auth/logout - Déconnexion
  logout: async () => {
    try {
      if (!import.meta.env.DEV) {
        await api.post('/auth/logout');
      }
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
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des informations utilisateur:', error);
      throw error;
    }
  }
};

export default api; 