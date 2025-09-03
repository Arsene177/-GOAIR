# 🚀 Guide de Démarrage Rapide - Horizon

## Installation et Lancement

### 1. Prérequis
- Node.js 18+ installé
- npm ou yarn

### 2. Installation des Dépendances
```bash
cd horizon
npm install
```

### 3. Configuration de l'Environnement
```bash
# Copier le fichier d'exemple
cp env.example .env.local

# Éditer le fichier si nécessaire
# .env.local
```

### 4. Démarrage de l'Application
```bash
npm run dev
```

L'application sera accessible à l'adresse : `http://localhost:5173`

## 🎯 Fonctionnalités Disponibles

### ✅ Recherche de Vols
- Formulaire de recherche complet
- Sélection d'aéroports populaires
- Choix des dates (aller simple/retour)
- Nombre de passagers et classe de cabine
- Affichage des résultats avec prédictions IA

### ✅ Authentification
- Page de connexion
- Page d'inscription
- Gestion des tokens JWT
- Navigation conditionnelle

### ✅ Interface Utilisateur
- Design moderne avec thème sombre
- Interface responsive (mobile/tablet/desktop)
- Animations et transitions fluides
- Messages d'erreur et de succès

## 🧪 Test des Fonctionnalités

### Recherche de Vols
1. Accédez à la page d'accueil
2. Remplissez le formulaire de recherche :
   - Départ : CDG (Paris)
   - Arrivée : JFK (New York)
   - Date : Demain
   - Passagers : 2
   - Classe : Économique
3. Cliquez sur "Rechercher des vols"
4. Consultez les résultats avec les prédictions IA

### Authentification
1. Cliquez sur "S'inscrire" dans le header
2. Remplissez le formulaire d'inscription
3. Vous serez automatiquement connecté
4. Testez la déconnexion via le menu utilisateur

## 📱 Responsive Design

L'application s'adapte automatiquement à tous les écrans :
- **Mobile** (< 600px) : Interface optimisée pour les petits écrans
- **Tablet** (600px - 960px) : Layout adapté pour les tablettes
- **Desktop** (> 960px) : Interface complète avec toutes les fonctionnalités

## 🔧 Développement

### Structure des Fichiers
```
src/
├── components/     # Composants réutilisables
├── pages/         # Pages principales
├── services/      # Services API
├── types/         # Types TypeScript
├── mocks/         # Données simulées
├── styles/        # Thèmes et styles
└── constants/     # Constantes de l'app
```

### Ajout de Nouveaux Composants
1. Créez le fichier dans `src/components/`
2. Exportez le composant par défaut
3. Importez-le dans la page appropriée

### Modification du Thème
Éditez `src/styles/theme.ts` pour modifier :
- Couleurs de la palette
- Typographie
- Composants Material-UI

## 🐛 Débogage

### Console du Navigateur
- Ouvrez les outils de développement (F12)
- Consultez la console pour les erreurs
- Vérifiez les requêtes réseau

### Mode Développement
- Les données simulées sont utilisées automatiquement
- Les délais réseau sont simulés pour un test réaliste
- Les erreurs sont affichées dans l'interface

## 📊 Données Simulées

En mode développement, l'application utilise des données simulées :
- **Vols** : 4 exemples de vols CDG → JFK
- **Authentification** : Utilisateur de test
- **Prédictions IA** : Tendances de prix simulées

## 🔄 Intégration Back-End

Pour intégrer le Back-End réel :
1. Modifiez `VITE_API_BASE_URL` dans `.env.local`
2. Désactivez `VITE_USE_MOCK_DATA`
3. Assurez-vous que le Back-End respecte le contrat d'API

## 📚 Documentation

- `README.md` - Documentation complète du projet
- `API_CONTRACT.md` - Contrat d'API pour l'équipe Back-End
- `GETTING_STARTED.md` - Ce guide de démarrage

## 🆘 Support

En cas de problème :
1. Vérifiez que Node.js 18+ est installé
2. Supprimez `node_modules` et `package-lock.json`
3. Relancez `npm install`
4. Consultez la console du navigateur pour les erreurs

## 🎉 Félicitations !

Vous avez maintenant une application Horizon entièrement fonctionnelle avec :
- Interface utilisateur moderne et responsive
- Système d'authentification complet
- Recherche de vols avec prédictions IA
- Architecture prête pour l'intégration Back-End 