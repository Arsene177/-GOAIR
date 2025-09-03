# Contrat d'API - Horizon Airlines

## 📋 Vue d'ensemble

Ce document définit le contrat d'API entre le Front-End et le Back-End de l'application Horizon. Ce contrat permet aux deux équipes de travailler en parallèle de manière découplée.

## 🔗 Base URL

```
http://localhost:8000/api
```

## 🔐 Authentification

Toutes les requêtes authentifiées doivent inclure le header :
```
Authorization: Bearer <access_token>
```

## 📡 Endpoints

### 1. Recherche de Vols

#### `GET /api/flights`

Recherche des vols selon les critères fournis.

**Paramètres de requête :**
```typescript
{
  departure: string;        // Code aéroport de départ (ex: "CDG")
  arrival: string;          // Code aéroport d'arrivée (ex: "JFK")
  departureDate: string;    // Date de départ (YYYY-MM-DD)
  returnDate?: string;      // Date de retour (optionnel, YYYY-MM-DD)
  passengers: number;       // Nombre de passagers (1-9)
  cabinClass: string;       // Classe de cabine
}
```

**Types de classe de cabine :**
- `"economy"` - Économique
- `"premium"` - Premium Économique
- `"business"` - Affaires
- `"first"` - Première Classe

**Réponse :**
```typescript
{
  flights: Flight[];
  totalCount: number;
  searchId: string;
}
```

**Structure Flight :**
```typescript
{
  id: string;
  airline: string;
  airlineLogo: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;    // ISO 8601
  arrivalTime: string;      // ISO 8601
  duration: string;         // Format: "8h 15m"
  price: number;
  currency: string;
  stops: number;
  prediction: {
    trend: "up" | "down" | "stable";
    confidence: number;     // 0-100
    recommendation: string;
  };
}
```

**Exemple de requête :**
```bash
GET /api/flights?departure=CDG&arrival=JFK&departureDate=2024-01-15&passengers=2&cabinClass=economy
```

**Exemple de réponse :**
```json
{
  "flights": [
    {
      "id": "flight_123",
      "airline": "Air France",
      "airlineLogo": "https://example.com/af-logo.png",
      "departureAirport": "CDG",
      "arrivalAirport": "JFK",
      "departureTime": "2024-01-15T10:30:00Z",
      "arrivalTime": "2024-01-15T13:45:00Z",
      "duration": "8h 15m",
      "price": 450,
      "currency": "EUR",
      "stops": 0,
      "prediction": {
        "trend": "down",
        "confidence": 85,
        "recommendation": "Prix en baisse, réservez maintenant !"
      }
    }
  ],
  "totalCount": 1,
  "searchId": "search_abc123"
}
```

### 2. Détails d'un Vol

#### `GET /api/flights/{id}`

Récupère les détails complets d'un vol spécifique.

**Paramètres :**
- `id` (path) - ID du vol

**Réponse :**
```typescript
{
  flight: Flight;
  additionalInfo?: {
    baggageAllowance: string;
    mealService: boolean;
    wifi: boolean;
    entertainment: string[];
  };
}
```

### 3. Authentification

#### `POST /api/auth/login`

Connexion utilisateur.

**Corps de la requête :**
```typescript
{
  email: string;
  password: string;
}
```

**Réponse :**
```typescript
{
  accessToken: string;
  user: User;
  expiresIn: number;  // Durée en secondes
}
```

**Structure User :**
```typescript
{
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}
```

#### `POST /api/auth/register`

Inscription d'un nouvel utilisateur.

**Corps de la requête :**
```typescript
{
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
```

**Réponse :**
```typescript
{
  accessToken: string;
  user: User;
  expiresIn: number;
}
```

#### `POST /api/auth/logout`

Déconnexion utilisateur.

**Headers requis :**
```
Authorization: Bearer <access_token>
```

**Réponse :**
```typescript
{
  message: string;
}
```

#### `GET /api/auth/me`

Récupère les informations de l'utilisateur connecté.

**Headers requis :**
```
Authorization: Bearer <access_token>
```

**Réponse :**
```typescript
{
  user: User;
}
```

## 🚨 Codes d'Erreur

### Codes HTTP Standards
- `200` - Succès
- `201` - Créé (inscription)
- `400` - Requête invalide
- `401` - Non authentifié
- `403` - Non autorisé
- `404` - Ressource non trouvée
- `409` - Conflit (email déjà utilisé)
- `500` - Erreur serveur

### Format des Erreurs
```typescript
{
  error: string;
  message: string;
  details?: any;
}
```

**Exemples d'erreurs :**
```json
{
  "error": "VALIDATION_ERROR",
  "message": "Les données fournies sont invalides",
  "details": {
    "email": "Format d'email invalide"
  }
}
```

```json
{
  "error": "AUTHENTICATION_FAILED",
  "message": "Email ou mot de passe incorrect"
}
```

## 📊 Données Simulées

En mode développement, le Front-End utilise des données simulées définies dans :
- `src/mocks/flights.ts` - Données de vols
- `src/mocks/auth.ts` - Données d'authentification

Ces données respectent exactement la structure définie dans ce contrat.

## 🔄 Pagination

Pour les endpoints retournant des listes, la pagination peut être implémentée avec :

**Paramètres :**
- `page` (number) - Numéro de page (défaut: 1)
- `limit` (number) - Nombre d'éléments par page (défaut: 20)

**Réponse avec pagination :**
```typescript
{
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

## 📝 Notes d'Implémentation

1. **Validation** : Tous les paramètres d'entrée doivent être validés côté serveur
2. **Sécurité** : Implémenter la validation JWT pour l'authentification
3. **Performance** : Utiliser la mise en cache pour les recherches fréquentes
4. **Logs** : Logger toutes les requêtes pour le debugging
5. **Rate Limiting** : Implémenter une limitation de débit pour éviter l'abus

## 🧪 Tests

Le Front-End inclut des tests pour valider le contrat d'API. Les tests vérifient :
- La structure des réponses
- Les codes d'erreur
- La validation des paramètres
- L'authentification

## 📞 Support

Pour toute question concernant ce contrat d'API, contactez l'équipe Front-End. 