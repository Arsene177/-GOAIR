import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Alert, Button, Fab, Grid, Fade, Slide, Zoom } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Help as HelpIcon, FlightTakeoff as FlightIcon } from '@mui/icons-material';
import FlightSearchForm from '../components/FlightSearchForm';
import NotificationDemo from '../components/NotificationDemo';
import OnboardingModal from '../components/OnboardingModal';
import WeatherWidget from '../components/WeatherWidget';
import { FlightSearch } from '../types';
import { flightService } from '../services/api';
import { useQuickNotifications } from '../components/NotificationSystem';
import { useOnboarding } from '../hooks/useOnboarding';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showContent, setShowContent] = useState(false);
  const { showSuccess, showError, showInfo } = useQuickNotifications();
  const { showOnboarding, hasSeenOnboarding, handleCloseOnboarding, showOnboardingAgain, debugOnboardingState, resetOnboarding } = useOnboarding();

  useEffect(() => {
    // Trigger animations on mount
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

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
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 25%, #60a5fa 50%, #93c5fd 75%, #dbeafe 100%)',
        position: 'relative'
      }}
    >
      {/* Professional sky gradient overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.3) 0%, transparent 40%),
            radial-gradient(circle at 70% 80%, rgba(255, 255, 255, 0.2) 0%, transparent 50%),
            linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, transparent 30%)
          `,
          animation: 'float 25s ease-in-out infinite'
        }}
      />

      {/* Professional Aircraft */}
      <Box
        sx={{
          position: 'absolute',
          top: '25%',
          left: '-120px',
          zIndex: 2,
          animation: 'flyAcross 18s linear infinite',
          '&::before': {
            content: '"✈️"',
            fontSize: '2.5rem',
            filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3)) drop-shadow(0 0 20px rgba(59, 130, 246, 0.4))',
            display: 'block',
            transform: 'rotate(-12deg)',
            opacity: 0.9
          }
        }}
      />

      {/* Professional Runway */}
      <Box
        sx={{
          position: 'absolute',
          bottom: '8%',
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.6) 15%, rgba(255, 255, 255, 0.8) 20%, rgba(255, 255, 255, 0.8) 80%, rgba(255, 255, 255, 0.6) 85%, transparent 100%)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-12px',
            left: '15%',
            right: '15%',
            height: '2px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 30%, rgba(255, 255, 255, 0.6) 50%, rgba(255, 255, 255, 0.4) 70%, transparent 100%)',
            animation: 'runwayLights 3s ease-in-out infinite alternate'
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '-24px',
            left: '25%',
            right: '25%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 40%, rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0.3) 60%, transparent 100%)',
            animation: 'runwayLights 2.5s ease-in-out infinite alternate 0.5s'
          }
        }}
      />

      {/* Realistic Clouds */}
      <Box
        sx={{
          position: 'absolute',
          top: '15%',
          right: '8%',
          '&::before': {
            content: '"☁️"',
            fontSize: '3.5rem',
            opacity: 0.8,
            filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
            animation: 'cloudFloat 10s ease-in-out infinite'
          }
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '55%',
          left: '3%',
          '&::before': {
            content: '"☁️"',
            fontSize: '2.5rem',
            opacity: 0.7,
            filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
            animation: 'cloudFloat 14s ease-in-out infinite reverse'
          }
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '35%',
          right: '25%',
          '&::before': {
            content: '"☁️"',
            fontSize: '3rem',
            opacity: 0.75,
            filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
            animation: 'cloudFloat 12s ease-in-out infinite'
          }
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '70%',
          right: '15%',
          '&::before': {
            content: '"☁️"',
            fontSize: '2rem',
            opacity: 0.6,
            filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
            animation: 'cloudFloat 16s ease-in-out infinite reverse'
          }
        }}
      />

      {/* Subtle Stars */}
      <Box
        sx={{
          position: 'absolute',
          top: '8%',
          left: '12%',
          '&::before': {
            content: '"⭐"',
            fontSize: '1.2rem',
            opacity: 0.4,
            filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.3))',
            animation: 'twinkle 4s ease-in-out infinite'
          }
        }}
      />
      <Box
        sx={{ 
          position: 'absolute',
          top: '20%',
          right: '18%',
          '&::before': {
            content: '"⭐"',
            fontSize: '1rem',
            opacity: 0.3,
            filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.3))',
            animation: 'twinkle 5s ease-in-out infinite 1.5s'
          }
        }}
      />
      <Box
          sx={{ 
          position: 'absolute',
          top: '12%',
          left: '75%',
          '&::before': {
            content: '"⭐"',
            fontSize: '1.4rem',
            opacity: 0.35,
            filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.3))',
            animation: 'twinkle 3.5s ease-in-out infinite 0.8s'
          }
        }}
      />
      
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: { xs: 2, md: 4 } }}>
        {/* Hero Section - Compact */}
        <Fade in={showContent} timeout={1000}>
          <Box textAlign="center" sx={{ mb: { xs: 3, md: 4 } }}>
            <Slide direction="down" in={showContent} timeout={800}>
              <Box>
          <Typography
                  variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(45deg, #1e40af 30%, #dc2626 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
                    mb: 1,
                    fontSize: { xs: '2rem', md: '2.5rem' },
                    textShadow: '0 0 30px rgba(30, 64, 175, 0.4)',
                    animation: 'glow 2s ease-in-out infinite alternate'
            }}
          >
            GOAIR
          </Typography>
              </Box>
            </Slide>
            
            <Fade in={showContent} timeout={1200}>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#1e293b',
              fontWeight: 500,
              mb: 2,
              fontSize: { xs: '1rem', md: '1.25rem' }
            }}
          >
            L'agrégateur de vols intelligent qui prédit les prix
          </Typography>
            </Fade>
          </Box>
        </Fade>

        {/* Main Search Section - Prominent */}
        <Slide direction="up" in={showContent} timeout={1400}>
          <Box sx={{ mb: { xs: 4, md: 6 } }}>
          {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <FlightSearchForm onSearch={handleSearch} loading={loading} />
        </Box>
        </Slide>

        {/* Quick Access Features */}
        <Fade in={showContent} timeout={1600}>
          <Box sx={{ mb: { xs: 4, md: 6 } }}>
            <Typography 
              variant="h5" 
              component="h2" 
              textAlign="center" 
              gutterBottom
              sx={{ 
                fontSize: { xs: '1.5rem', md: '1.75rem' },
                fontWeight: 600,
                color: '#1e293b',
                mb: 3
              }}
            >
              Fonctionnalités Intelligentes
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Zoom in={showContent} timeout={1800}>
                  <Box 
                    textAlign="center" 
                    sx={{ 
                      p: 3,
                      borderRadius: 3,
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(226, 232, 240, 0.8)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 40px rgba(25, 118, 210, 0.2)',
                        borderColor: 'primary.main',
                        background: 'rgba(255, 255, 255, 1)'
                      }
                    }}
                    onClick={showOnboardingAgain}
                  >
                    <FlightIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h6" gutterBottom color="primary.main" sx={{ fontWeight: 600 }}>
                      Prédiction IA
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      Analysez les tendances de prix avec notre IA
                    </Typography>
                  </Box>
                </Zoom>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Zoom in={showContent} timeout={2000}>
                  <Box 
                    textAlign="center" 
                    sx={{ 
                      p: 3,
                      borderRadius: 3,
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(226, 232, 240, 0.8)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 40px rgba(220, 38, 38, 0.2)',
                        borderColor: 'secondary.main',
                        background: 'rgba(255, 255, 255, 1)'
                      }
                    }}
                    onClick={() => navigate('/notifications')}
                  >
                    <Typography variant="h4" sx={{ mb: 2 }}>🔔</Typography>
                    <Typography variant="h6" gutterBottom color="primary.main" sx={{ fontWeight: 600 }}>
                      Alertes Prix
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      Configurez des alertes pour vos routes préférées
                    </Typography>
                  </Box>
                </Zoom>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Zoom in={showContent} timeout={2200}>
                  <Box 
                    textAlign="center" 
                    sx={{ 
                      p: 3,
                      borderRadius: 3,
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(226, 232, 240, 0.8)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 40px rgba(25, 118, 210, 0.2)',
                        borderColor: 'info.main',
                        background: 'rgba(255, 255, 255, 1)'
                      }
                    }}
                  >
                    <Typography variant="h4" sx={{ mb: 2 }}>📊</Typography>
                    <Typography variant="h6" gutterBottom color="primary.main" sx={{ fontWeight: 600 }}>
                      Analyse Prix
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      Historique et tendances des prix
                    </Typography>
          </Box>
                </Zoom>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Zoom in={showContent} timeout={2400}>
        <Box 
                    textAlign="center" 
          sx={{ 
                      p: 3,
                      borderRadius: 3,
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(226, 232, 240, 0.8)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 40px rgba(46, 125, 50, 0.2)',
                        borderColor: 'success.main',
                        background: 'rgba(255, 255, 255, 1)'
                      }
                    }}
                  >
                    <Typography variant="h4" sx={{ mb: 2 }}>⚡</Typography>
                    <Typography variant="h6" gutterBottom color="primary.main" sx={{ fontWeight: 600 }}>
                      Réservation
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      Réservation rapide et sécurisée
                    </Typography>
                  </Box>
                </Zoom>
              </Grid>
            </Grid>
          </Box>
        </Fade>

        {/* Weather Widget */}
        <Fade in={showContent} timeout={2600}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: { xs: 4, md: 6 } }}>
            <WeatherWidget city="Douala" />
          </Box>
        </Fade>

        {/* Benefits Section - Compact */}
        <Fade in={showContent} timeout={2800}>
          <Box sx={{ mb: { xs: 4, md: 6 } }}>
          <Typography 
              variant="h5" 
            component="h2" 
            textAlign="center" 
            gutterBottom
              sx={{ 
                fontSize: { xs: '1.5rem', md: '1.75rem' },
                fontWeight: 600,
                color: '#1e293b',
                mb: 3
              }}
          >
            Pourquoi choisir GOAIR ?
          </Typography>
          
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box 
                  textAlign="center" 
                  sx={{ 
                    p: 3,
                    borderRadius: 3,
                    background: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid rgba(226, 232, 240, 0.6)',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 1)',
                      borderColor: 'primary.main',
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 25px rgba(25, 118, 210, 0.15)'
                    }
                  }}
                >
                  <FlightIcon sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
                  <Typography variant="subtitle1" gutterBottom color="primary.main" sx={{ fontWeight: 600 }}>
                    IA Prédictive
              </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5, fontSize: '0.875rem' }}>
                    Notre IA analyse les tendances pour vous recommander le meilleur moment pour réserver.
              </Typography>
            </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Box 
                  textAlign="center" 
                  sx={{ 
                    p: 3,
                    borderRadius: 3,
                    background: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid rgba(226, 232, 240, 0.6)',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 1)',
                      borderColor: 'secondary.main',
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 25px rgba(220, 38, 38, 0.15)'
                    }
                  }}
                >
                  <Typography variant="h5" sx={{ mb: 1 }}>💰</Typography>
                  <Typography variant="subtitle1" gutterBottom color="primary.main" sx={{ fontWeight: 600 }}>
                    Économies Garanties
              </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5, fontSize: '0.875rem' }}>
                    Comparez tous les prix et trouvez les meilleures offres en temps réel.
              </Typography>
            </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Box 
                  textAlign="center" 
                  sx={{ 
                    p: 3,
                    borderRadius: 3,
                    background: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid rgba(226, 232, 240, 0.6)',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 1)',
                      borderColor: 'info.main',
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 25px rgba(25, 118, 210, 0.15)'
                    }
                  }}
                >
                  <Typography variant="h5" sx={{ mb: 1 }}>⚡</Typography>
                  <Typography variant="subtitle1" gutterBottom color="primary.main" sx={{ fontWeight: 600 }}>
                    Réservation Rapide
              </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5, fontSize: '0.875rem' }}>
                    Interface intuitive et processus de réservation simplifié.
              </Typography>
            </Box>
              </Grid>
            </Grid>
          </Box>
        </Fade>

        {/* Help Section */}
          {hasSeenOnboarding && (
          <Fade in={showContent} timeout={3000}>
            <Box textAlign="center" sx={{ mb: 4 }}>
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
                  background: 'rgba(0, 212, 170, 0.1)',
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    borderColor: 'primary.dark',
                    backgroundColor: 'rgba(0, 212, 170, 0.2)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 5px 15px rgba(0, 212, 170, 0.3)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Comprendre les facteurs de prix
              </Button>
            </Box>
          </Fade>
          )}
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
          display: { xs: 'none', md: 'flex' },
          background: 'linear-gradient(45deg, #00d4aa 30%, #ff6b6b 90%)',
          '&:hover': {
            transform: 'scale(1.1)',
            boxShadow: '0 8px 25px rgba(0, 212, 170, 0.4)'
          },
          transition: 'all 0.3s ease'
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