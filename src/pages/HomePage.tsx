import React, { useState } from 'react';
import { Container, Box, Typography, Alert, Button, Fab } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Help as HelpIcon } from '@mui/icons-material';
import FlightSearchForm from '../components/FlightSearchForm';
import NotificationDemo from '../components/NotificationDemo';
import OnboardingModal from '../components/OnboardingModal';
import { FlightSearch } from '../types';
import { flightService } from '../services/api';
import { useQuickNotifications } from '../components/NotificationSystem';
import { useOnboarding } from '../hooks/useOnboarding';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showSuccess, showError, showInfo } = useQuickNotifications();
  const { showOnboarding, hasSeenOnboarding, handleCloseOnboarding, showOnboardingAgain, debugOnboardingState, resetOnboarding } = useOnboarding();

  const handleSearch = async (searchData: FlightSearch) => {
    setLoading(true);
    setError(null);
    
    try {
      showInfo('Recherche en cours', 'Nous recherchons les meilleurs vols pour vous...');
      const response = await flightService.searchFlights(searchData);
      
      // Stocker les résultats de recherche dans le localStorage pour la page de résultats
      localStorage.setItem('searchResults', JSON.stringify(response));
      localStorage.setItem('searchParams', JSON.stringify(searchData));
      
      showSuccess('Vols trouvés !', `${response.flights.length} vols disponibles pour votre recherche`);
      // Naviguer vers la page de résultats
      navigate('/results');
    } catch (err) {
      const errorMessage = 'Une erreur est survenue lors de la recherche. Veuillez réessayer.';
      setError(errorMessage);
      showError('Erreur de recherche', errorMessage);
      console.error('Erreur de recherche:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #0f1419 0%, #1a1f2e 100%)'
      }}
    >
      <Container 
        maxWidth="lg" 
        sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          py: { xs: 2, md: 4 }
        }}
      >
        {/* Section Héro */}
        <Box 
          textAlign="center" 
          sx={{ 
            mb: { xs: 4, md: 6 },
            flex: '0 0 auto'
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(45deg, #00d4aa 30%, #ff6b6b 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
              fontSize: { xs: '2.5rem', md: '3.5rem' }
            }}
          >
            Horizon
          </Typography>
          <Typography 
            variant="h5" 
            color="text.secondary" 
            sx={{ 
              mb: 3,
              fontSize: { xs: '1.25rem', md: '1.5rem' }
            }}
          >
            L'agrégateur de vols intelligent qui prédit les prix
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ 
              maxWidth: 600, 
              mx: 'auto',
              fontSize: { xs: '1rem', md: '1.125rem' }
            }}
          >
            Trouvez les meilleurs prix pour vos vols et laissez notre IA vous dire 
            quand réserver pour économiser le plus possible.
          </Typography>
        </Box>

        {/* Formulaire de recherche */}
        <Box sx={{ flex: '1 1 auto', display: 'flex', alignItems: 'center' }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3, position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 1000 }}>
              {error}
            </Alert>
          )}

          <FlightSearchForm onSearch={handleSearch} loading={loading} />
        </Box>

        {/* Démonstration des notifications (en développement) */}
        {process.env.NODE_ENV === 'development' && (
          <Box sx={{ mb: 4 }}>
            <NotificationDemo />
          </Box>
        )}

        {/* Section des avantages */}
        <Box 
          sx={{ 
            mt: { xs: 4, md: 6 },
            flex: '0 0 auto'
          }}
        >
          <Typography 
            variant="h4" 
            component="h2" 
            textAlign="center" 
            gutterBottom
            sx={{ fontSize: { xs: '1.75rem', md: '2.125rem' } }}
          >
            Pourquoi choisir Horizon ?
          </Typography>
          
          <Box
            display="grid"
            gridTemplateColumns={{ xs: '1fr', md: 'repeat(3, 1fr)' }}
            gap={{ xs: 3, md: 4 }}
            sx={{ mt: 4 }}
          >
            <Box textAlign="center">
              <Typography variant="h6" gutterBottom color="primary.main">
                🧠 IA Prédictive
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Notre intelligence artificielle analyse les tendances de prix 
                pour vous recommander le meilleur moment pour réserver.
              </Typography>
            </Box>
            
            <Box textAlign="center">
              <Typography variant="h6" gutterBottom color="primary.main">
                💰 Économies Garanties
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Comparez les prix de toutes les compagnies aériennes 
                et trouvez les meilleures offres en temps réel.
              </Typography>
            </Box>
            
            <Box textAlign="center">
              <Typography variant="h6" gutterBottom color="primary.main">
                ⚡ Réservation Rapide
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Interface intuitive et processus de réservation 
                simplifié pour une expérience utilisateur optimale.
              </Typography>
            </Box>
          </Box>

          {/* Help Button for Returning Users */}
          {hasSeenOnboarding && (
            <Box textAlign="center" sx={{ mt: 4 }}>
              <Button
                variant="outlined"
                startIcon={<HelpIcon />}
                onClick={showOnboardingAgain}
                sx={{ 
                  borderRadius: 2,
                  px: 3,
                  py: 1.5,
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '&:hover': {
                    borderColor: 'primary.dark',
                    backgroundColor: 'primary.50'
                  }
                }}
              >
                Comprendre les facteurs de prix
              </Button>
              
              {/* Debug/Reset Button for Testing */}
              <Button
                variant="text"
                size="small"
                onClick={() => {
                  debugOnboardingState();
                  resetOnboarding();
                }}
                sx={{ 
                  mt: 1,
                  fontSize: '0.75rem',
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main'
                  }
                }}
              >
                🔄 Reset Onboarding (Debug)
              </Button>
            </Box>
          )}
        </Box>
      </Container>

      {/* Floating Help Button */}
      <Fab
        color="primary"
        aria-label="help"
        onClick={showOnboardingAgain}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 1000,
          display: { xs: 'none', md: 'flex' }
        }}
      >
        <HelpIcon />
      </Fab>

      {/* Onboarding Modal */}
      <OnboardingModal
        open={showOnboarding}
        onClose={handleCloseOnboarding}
      />
    </Box>
  );
};

export default HomePage; 