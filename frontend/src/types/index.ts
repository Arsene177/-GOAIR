// Types pour les vols
export interface Flight {
  id: string;
  airline: string;
  airlineLogo: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  currency: string;
  stops: number;
  prediction: {
    trend: 'up' | 'down' | 'stable';
    confidence: number;
    recommendation: string;
  };
}

// Types pour l'authentification
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface AdminUser extends User {
  role: 'admin' | 'super_admin';
  permissions: string[];
  lastLogin: string;
  isActive: boolean;
}

export interface AuthResponse {
  accessToken: string;
  user: User | AdminUser;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Types pour la recherche
export interface FlightSearch {
  departure: string;
  arrival: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  cabinClass: 'economy' | 'premium' | 'business' | 'first';
}

// Types pour les réponses API
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface FlightSearchResponse {
  flights: Flight[];
  totalCount: number;
  searchId: string;
}

// Types pour l'administration
export interface FlightManagement extends Flight {
  status: 'active' | 'inactive' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  capacity: number;
  bookedSeats: number;
}

export interface UserManagement {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin' | 'super_admin';
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  lastLogin: string;
  totalBookings: number;
}

export interface AdminDashboardStats {
  totalUsers: number;
  totalFlights: number;
  activeBookings: number;
  revenue: number;
  currency: string;
  recentBookings: number;
  pendingApprovals: number;
}

export interface AdminNotification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
} 