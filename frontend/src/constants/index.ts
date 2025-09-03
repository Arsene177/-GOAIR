// Constantes pour les aéroports populaires
export const POPULAR_AIRPORTS = [
  { code: 'CDG', name: 'Paris Charles de Gaulle', city: 'Paris' },
  { code: 'JFK', name: 'New York JFK', city: 'New York' },
  { code: 'LHR', name: 'London Heathrow', city: 'Londres' },
  { code: 'NRT', name: 'Tokyo Narita', city: 'Tokyo' },
  { code: 'SYD', name: 'Sydney Airport', city: 'Sydney' },
  { code: 'LAX', name: 'Los Angeles International', city: 'Los Angeles' },
  { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt' },
  { code: 'AMS', name: 'Amsterdam Schiphol', city: 'Amsterdam' }
];

// Classes de cabine
export const CABIN_CLASSES = [
  { value: 'economy', label: 'Économique' },
  { value: 'premium', label: 'Premium Économique' },
  { value: 'business', label: 'Affaires' },
  { value: 'first', label: 'Première Classe' }
];

// Nombre de passagers maximum
export const MAX_PASSENGERS = 9;

// Durée de validité du token (24 heures)
export const TOKEN_EXPIRY = 24 * 60 * 60 * 1000;

// Messages d'erreur
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erreur de connexion. Veuillez réessayer.',
  INVALID_CREDENTIALS: 'Email ou mot de passe incorrect.',
  EMAIL_ALREADY_EXISTS: 'Cet email est déjà utilisé.',
  REQUIRED_FIELD: 'Ce champ est requis.',
  INVALID_EMAIL: 'Veuillez entrer un email valide.',
  PASSWORD_TOO_SHORT: 'Le mot de passe doit contenir au moins 6 caractères.',
  PASSWORDS_DONT_MATCH: 'Les mots de passe ne correspondent pas.'
};

// Messages de succès
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Connexion réussie !',
  REGISTER_SUCCESS: 'Inscription réussie !',
  LOGOUT_SUCCESS: 'Déconnexion réussie !',
  BOOKING_SUCCESS: 'Réservation effectuée avec succès !'
}; 