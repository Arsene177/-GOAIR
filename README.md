# Horizon - Agrégateur de Vols Intelligent

## 🚀 Phase 0 - Front-End Uniquement

Horizon est un agrégateur de vols intelligent qui non seulement compare les prix, mais fournit également des prédictions et des analyses pour aider les utilisateurs à acheter leurs billets au meilleur moment.

## 🎨 Identité Visuelle

### Palette de Couleurs
- **Fond principal :** `#0f1419` (noir profond)
- **Fond secondaire :** `#1a1f2e` (gris très sombre)
- **Accent principal :** `#00d4aa` (vert émeraude vif)
- **Accent secondaire :** `#ff6b6b` (corail)
- **Texte principal :** `#ffffff` (blanc)
- **Texte secondaire :** `#a0a0a0` (gris clair)

### Typographie
- **Police principale :** Inter (moderne, lisible)
- **Titres :** 600-700 weight
- **Corps de texte :** 400 weight

## 🛠️ Stack Technologique

- **Framework :** React 18 avec TypeScript
- **Build Tool :** Vite
- **UI Library :** Material-UI (MUI)
- **Routing :** React Router DOM
- **HTTP Client :** Axios
- **State Management :** React Hooks (useState, useEffect)

## 📁 Structure du Projet

```
src/
├── components/          # Composants réutilisables
│   ├── Header.tsx      # Navigation principale
│   ├── FlightSearchForm.tsx  # Formulaire de recherche
│   └── FlightCard.tsx  # Carte d'affichage d'un vol
├── pages/              # Pages principales
│   ├── HomePage.tsx    # Page d'accueil
│   ├── ResultsPage.tsx # Page de résultats
│   ├── LoginPage.tsx   # Page de connexion
│   └── RegisterPage.tsx # Page d'inscription
├── services/           # Services API
│   └── api.ts         # Configuration axios et services
├── types/              # Définitions TypeScript
│   └── index.ts       # Interfaces et types
├── mocks/              # Données simulées
│   ├── flights.ts     # Données de vols
│   └── auth.ts        # Données d'authentification
├── styles/             # Styles et thèmes
│   └── theme.ts       # Thème Material-UI
├── constants/          # Constantes de l'application
│   └── index.ts       # Messages, aéroports, etc.
├── hooks/              # Hooks personnalisés (à venir)
├── utils/              # Fonctions utilitaires (à venir)
└── App.tsx            # Composant principal
```

## 🔌 Contrat d'API

### Endpoints Définis

#### Recherche de Vols
```
GET /api/flights
```

**Paramètres :**
- `departure` (string) - Code aéroport de départ
- `arrival` (string) - Code aéroport d'arrivée
- `departureDate` (string) - Date de départ (YYYY-MM-DD)
- `returnDate` (string, optionnel) - Date de retour
- `passengers` (number) - Nombre de passagers
- `cabinClass` (string) - Classe de cabine

**Réponse :**
```json
{
  "flights": [
    {
      "id": "string",
      "airline": "string",
      "airlineLogo": "string",
      "departureAirport": "string",
      "arrivalAirport": "string",
      "departureTime": "string",
      "arrivalTime": "string",
      "duration": "string",
      "price": number,
      "currency": "string",
      "stops": number,
      "prediction": {
        "trend": "up" | "down" | "stable",
        "confidence": number,
        "recommendation": "string"
      }
    }
  ],
  "totalCount": number,
  "searchId": "string"
}
```

#### Authentification
```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
GET /api/auth/me
```

**Réponse de connexion/inscription :**
```json
{
  "accessToken": "string",
  "user": {
    "id": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string"
  },
  "expiresIn": number
}
```

## 🚀 Installation et Démarrage

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Installation
```bash
# Cloner le projet
git clone <repository-url>
cd horizon

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

### Scripts Disponibles
- `npm run dev` - Démarre le serveur de développement
- `npm run build` - Construit l'application pour la production
- `npm run preview` - Prévisualise la build de production
- `npm run lint` - Lance le linter ESLint

## 🎯 Fonctionnalités Implémentées

### ✅ Phase 0 - Front-End Complet
- [x] Interface utilisateur moderne et responsive
- [x] Formulaire de recherche de vols complet
- [x] Affichage des résultats avec prédictions IA
- [x] Système d'authentification (connexion/inscription)
- [x] Navigation entre les pages
- [x] Thème sombre avec palette de couleurs Horizon
- [x] Données simulées pour le développement
- [x] Contrat d'API défini pour le découplage Back-End

### 🔄 Fonctionnalités à Venir (Phases Suivantes)
- [ ] Intégration avec le Back-End réel
- [ ] Système de réservation
- [ ] Historique des recherches
- [ ] Notifications de prix
- [ ] Filtres avancés
- [ ] Mode sombre/clair
- [ ] Tests unitaires et d'intégration

## 🎨 Composants Principaux

### FlightSearchForm
Formulaire de recherche avec :
- Sélection d'aéroports (départ/arrivée)
- Dates de voyage (aller simple/retour)
- Nombre de passagers
- Classe de cabine
- Bouton d'échange d'aéroports

### FlightCard
Carte d'affichage d'un vol avec :
- Logo et nom de la compagnie
- Horaires de départ/arrivée
- Durée et nombre d'escales
- Prix et devise
- Indicateur de prédiction IA
- Recommandation d'achat

### Header
Navigation principale avec :
- Logo Horizon
- Menu de navigation
- État de connexion
- Menu utilisateur (si connecté)

## 🔧 Configuration

### Variables d'Environnement
Créez un fichier `.env.local` :
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

### Mode Développement
En mode développement, l'application utilise des données simulées (mocks) pour permettre le développement Front-End sans dépendre du Back-End.

## 📱 Responsive Design

L'application est entièrement responsive et s'adapte aux écrans :
- Mobile (< 600px)
- Tablet (600px - 960px)
- Desktop (> 960px)

## 🎯 Objectifs de la Phase 0

1. **Découplage des équipes** : Le Front-End peut fonctionner indépendamment du Back-End
2. **Contrat d'API clair** : Définition précise des endpoints et structures de données
3. **Interface utilisateur complète** : Toutes les pages principales sont implémentées
4. **Expérience utilisateur optimale** : Design moderne et intuitif
5. **Préparation pour l'intégration** : Structure prête pour l'ajout du Back-End

## 🤝 Contribution

Ce projet est en Phase 0 (Front-End uniquement). Les contributions Back-End seront intégrées dans les phases suivantes.

## 📄 Licence

Ce projet est développé pour Horizon Airlines.
