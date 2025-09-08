import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  Button,
  Alert,
  Collapse,
  IconButton,
  Tooltip,
  useTheme,
  Divider
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Psychology as PsychologyIcon,
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { PricePrediction as PricePredictionType, PriceFactor } from '../types';

interface PricePredictionProps {
  route: string;
  departureDate: string;
  currentPrice: number;
  currency: string;
  onGetPrediction?: () => void;
}

const PricePrediction: React.FC<PricePredictionProps> = ({
  route,
  departureDate,
  currentPrice,
  currency,
  onGetPrediction
}) => {
  const theme = useTheme();
  const [prediction, setPrediction] = useState<PricePredictionType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  // Mock prediction data - replace with actual API call
  const generateMockPrediction = (): PricePredictionType => {
    const daysUntilDeparture = Math.ceil((new Date(departureDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    const baseVariation = Math.random() * 0.3 - 0.15; // -15% to +15%
    const timeFactor = Math.max(0, (30 - daysUntilDeparture) / 30) * 0.2; // More variation closer to departure
    
    const predictedPrice = currentPrice * (1 + baseVariation + timeFactor);
    const confidence = Math.max(60, 95 - daysUntilDeparture * 0.5);
    
    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (predictedPrice > currentPrice * 1.05) trend = 'up';
    else if (predictedPrice < currentPrice * 0.95) trend = 'down';

    const factors: PriceFactor[] = [
      {
        name: 'Demande saisonnière',
        impact: daysUntilDeparture < 14 ? 'negative' : 'neutral',
        weight: 0.3,
        description: daysUntilDeparture < 14 ? 'Demande élevée à l\'approche du départ' : 'Demande normale'
      },
      {
        name: 'Concurrence',
        impact: 'positive',
        weight: 0.25,
        description: 'Plusieurs compagnies sur cette route'
      },
      {
        name: 'Météo prévue',
        impact: 'neutral',
        weight: 0.15,
        description: 'Conditions météo normales'
      },
      {
        name: 'Événements locaux',
        impact: 'neutral',
        weight: 0.2,
        description: 'Aucun événement majeur prévu'
      },
      {
        name: 'Historique des prix',
        impact: trend === 'up' ? 'negative' : trend === 'down' ? 'positive' : 'neutral',
        weight: 0.1,
        description: 'Basé sur les tendances passées'
      }
    ];

    let recommendation = '';
    if (trend === 'up' && confidence > 70) {
      recommendation = 'Prix en hausse prévue. Nous recommandons de réserver maintenant.';
    } else if (trend === 'down' && confidence > 70) {
      recommendation = 'Prix en baisse prévue. Vous pouvez attendre quelques jours.';
    } else {
      recommendation = 'Prix stable. Vous pouvez réserver quand vous le souhaitez.';
    }

    return {
      id: `pred-${Date.now()}`,
      route,
      departureDate,
      currentPrice,
      predictedPrice: Math.round(predictedPrice),
      confidence: Math.round(confidence),
      trend,
      factors,
      recommendation,
      lastUpdated: new Date().toISOString()
    };
  };

  const handleGetPrediction = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockPrediction = generateMockPrediction();
      setPrediction(mockPrediction);
      
      if (onGetPrediction) {
        onGetPrediction();
      }
    } catch (err) {
      setError('Erreur lors de la génération de la prédiction. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUpIcon color="error" />;
      case 'down': return <TrendingDownIcon color="success" />;
      default: return <TrendingFlatIcon color="info" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'error';
      case 'down': return 'success';
      default: return 'info';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive': return 'success';
      case 'negative': return 'error';
      default: return 'default';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  const priceDifference = prediction ? prediction.predictedPrice - prediction.currentPrice : 0;
  const priceChangePercent = prediction ? (priceDifference / prediction.currentPrice) * 100 : 0;

  return (
    <Card sx={{ mb: 3, border: `1px solid ${theme.palette.divider}` }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h3" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PsychologyIcon color="primary" />
            Prédiction de prix IA
          </Typography>
          <Tooltip title="Prédiction basée sur l'analyse de données historiques et de facteurs actuels">
            <IconButton size="small">
              <InfoIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {!prediction && !loading && (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
              Obtenez une prédiction intelligente du prix pour votre vol
            </Typography>
            <Button
              variant="contained"
              startIcon={<PsychologyIcon />}
              onClick={handleGetPrediction}
              size="large"
            >
              Analyser les prix
            </Button>
          </Box>
        )}

        {loading && (
          <Box sx={{ py: 3 }}>
            <Typography variant="body1" sx={{ mb: 2, textAlign: 'center' }}>
              Analyse en cours...
            </Typography>
            <LinearProgress />
            <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
              Notre IA analyse les tendances de prix pour votre route
            </Typography>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {prediction && (
          <>
            <Grid container spacing={3} sx={{ mb: 2 }}>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                  <Typography variant="h4" component="div" color="primary">
                    {formatPrice(prediction.currentPrice)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Prix actuel
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                  <Typography 
                    variant="h4" 
                    component="div" 
                    color={getTrendColor(prediction.trend)}
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}
                  >
                    {getTrendIcon(prediction.trend)}
                    {formatPrice(prediction.predictedPrice)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Prix prédit
                  </Typography>
                  <Chip
                    label={`${priceChangePercent > 0 ? '+' : ''}${priceChangePercent.toFixed(1)}%`}
                    color={getTrendColor(prediction.trend)}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                  <Typography variant="h4" component="div" color="primary">
                    {prediction.confidence}%
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Confiance
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={prediction.confidence}
                    sx={{ mt: 1, height: 6, borderRadius: 3 }}
                  />
                </Box>
              </Grid>
            </Grid>

            <Alert severity={prediction.trend === 'up' ? 'warning' : prediction.trend === 'down' ? 'success' : 'info'} sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>Recommandation :</strong> {prediction.recommendation}
              </Typography>
            </Alert>

            <Box sx={{ mb: 2 }}>
              <Button
                variant="outlined"
                startIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                onClick={() => setExpanded(!expanded)}
                size="small"
              >
                {expanded ? 'Masquer les détails' : 'Voir les facteurs d\'analyse'}
              </Button>
            </Box>

            <Collapse in={expanded}>
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AssessmentIcon color="primary" />
                  Facteurs d'analyse
                </Typography>
                
                <Grid container spacing={2}>
                  {prediction.factors.map((factor, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Box
                        sx={{
                          p: 2,
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 1,
                          bgcolor: 'background.paper'
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle2" component="h4">
                            {factor.name}
                          </Typography>
                          <Chip
                            label={factor.impact}
                            color={getImpactColor(factor.impact)}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                        
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                          {factor.description}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="caption" color="textSecondary">
                            Poids:
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={factor.weight * 100}
                            sx={{ flexGrow: 1, height: 4, borderRadius: 2 }}
                          />
                          <Typography variant="caption" color="textSecondary">
                            {(factor.weight * 100).toFixed(0)}%
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Collapse>

            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" color="textSecondary">
                Dernière mise à jour: {new Date(prediction.lastUpdated).toLocaleString('fr-FR')}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={handleGetPrediction}
                disabled={loading}
              >
                Actualiser
              </Button>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PricePrediction;
