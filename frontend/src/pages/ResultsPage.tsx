import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Chip,
  Paper,
} from '@mui/material';
import { ArrowBack, FilterList } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import FlightCard from '../components/FlightCard';
import PriceInsights from '../components/PriceInsights';
import OnboardingModal from '../components/OnboardingModal';
import WeatherWidget from '../components/WeatherWidget';
import { Flight, FlightSearch } from '../types';

const ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [searchParams, setSearchParams] = useState<FlightSearch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Récupérer les résultats de recherche depuis le localStorage
    const storedResults = localStorage.getItem('searchResults');
    const storedParams = localStorage.getItem('searchParams');

    if (storedResults && storedParams) {
      try {
        const results = JSON.parse(storedResults);
        const params = JSON.parse(storedParams);
        
        setFlights(results.flights || []);
        setSearchParams(params);
      } catch (err) {
        setError('Erreur lors du chargement des résultats');
        console.error('Erreur parsing localStorage:', err);
      }
    } else {
      setError('Aucun résultat de recherche trouvé');
    }
    
    setLoading(false);
  }, []);

  const handleBook = (flightId: string) => {
    // Ici, on pourrait rediriger vers une page de réservation
    // Pour l'instant, on affiche juste une alerte
    alert(`Réservation du vol ${flightId} - Cette fonctionnalité sera implémentée dans la prochaine phase`);
  };

  const formatSearchSummary = () => {
    if (!searchParams) return '';
    
    const departure = searchParams.departure;
    const arrival = searchParams.arrival;
    const date = new Date(searchParams.departureDate).toLocaleDateString('fr-FR');
    const passengers = searchParams.passengers;
    
    return `${departure} → ${arrival} • ${date} • ${passengers} passager${passengers > 1 ? 's' : ''}`;
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          minHeight: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #0f1419 0%, #1a1f2e 100%)'
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box 
        sx={{ 
          minHeight: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f1419 0%, #1a1f2e 100%)',
          py: 2
        }}
      >
        <Container maxWidth="md">
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
          <Button
            variant="contained"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/')}
          >
            Retour à la recherche
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        minHeight: '100%',
        background: 'linear-gradient(135deg, #0f1419 0%, #1a1f2e 100%)'
      }}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
        {/* En-tête avec résumé de recherche */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
            <Box>
              <Typography variant="h5" gutterBottom>
                Résultats de recherche
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {formatSearchSummary()}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {flights.length} vol{flights.length > 1 ? 's' : ''} trouvé{flights.length > 1 ? 's' : ''}
              </Typography>
            </Box>
            
            <Box display="flex" gap={2}>
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => alert('Filtres - Fonctionnalité à venir')}
              >
                Filtres
              </Button>
              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={() => navigate('/')}
              >
                Nouvelle recherche
              </Button>
            </Box>
          </Box>
          
          {/* Weather Widget */}
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <WeatherWidget city="Douala" />
          </Box>
        </Paper>

        {/* Price Insights */}
        {searchParams && (
          <PriceInsights
            departure={searchParams.departure}
            arrival={searchParams.arrival}
            departureDate={searchParams.departureDate}
            onShowOnboarding={() => setShowOnboarding(true)}
          />
        )}

        {/* Liste des vols */}
        {flights.length === 0 ? (
          <Alert severity="info">
            Aucun vol trouvé pour votre recherche. Essayez de modifier vos critères.
          </Alert>
        ) : (
          <Box>
            {flights.map((flight) => (
              <FlightCard
                key={flight.id}
                flight={flight}
                onBook={handleBook}
              />
            ))}
          </Box>
        )}

        {/* Informations sur les prédictions */}
        <Paper sx={{ p: 3, mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            💡 À propos de nos prédictions
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Nos prédictions sont basées sur l'analyse de millions de données de prix historiques 
            et de tendances du marché. Elles vous aident à identifier le meilleur moment pour réserver.
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            <Chip
              icon={<span>📈</span>}
              label="Prix en hausse - Réservez rapidement"
              color="error"
              variant="outlined"
            />
            <Chip
              icon={<span>📉</span>}
              label="Prix en baisse - Vous pouvez attendre"
              color="success"
              variant="outlined"
            />
            <Chip
              icon={<span>➡️</span>}
              label="Prix stable - Pas d'urgence"
              color="warning"
              variant="outlined"
            />
          </Box>
        </Paper>
      </Container>

      {/* Onboarding Modal */}
      <OnboardingModal
        open={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />
    </Box>
  );
};

export default ResultsPage; 