import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Grid,
  Avatar,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  Flight,
  AccessTime,
  Euro,
} from '@mui/icons-material';
import { Flight as FlightType } from '../types';

interface FlightCardProps {
  flight: FlightType;
  onBook: (flightId: string) => void;
}

const FlightCard: React.FC<FlightCardProps> = ({ flight, onBook }) => {
  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp color="error" />;
      case 'down':
        return <TrendingDown color="success" />;
      default:
        return <TrendingFlat color="warning" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'error';
      case 'down':
        return 'success';
      default:
        return 'warning';
    }
  };

  const getTrendText = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'Prix en hausse';
      case 'down':
        return 'Prix en baisse';
      default:
        return 'Prix stable';
    }
  };

  return (
    <Card sx={{ mb: 2, position: 'relative', overflow: 'visible' }}>
      {/* Indicateur de prédiction */}
      <Box
        sx={{
          position: 'absolute',
          top: -8,
          right: 16,
          zIndex: 1,
        }}
      >
        <Chip
          icon={getTrendIcon(flight.prediction.trend)}
          label={getTrendText(flight.prediction.trend)}
          color={getTrendColor(flight.prediction.trend)}
          size="small"
          variant="filled"
        />
      </Box>

      <CardContent sx={{ p: 3 }}>
        <Grid container spacing={3} alignItems="center">
          {/* Logo et nom de la compagnie */}
          <Grid item xs={12} md={2}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Avatar
                src={flight.airlineLogo}
                alt={flight.airline}
                sx={{ width: 60, height: 40, mb: 1 }}
              >
                {flight.airline.charAt(0)}
              </Avatar>
              <Typography variant="body2" color="text.secondary" align="center">
                {flight.airline}
              </Typography>
            </Box>
          </Grid>

          {/* Horaires et aéroports */}
          <Grid item xs={12} md={4}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box textAlign="center">
                <Typography variant="h6" fontWeight="bold">
                  {formatTime(flight.departureTime)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {flight.departureAirport}
                </Typography>
              </Box>
              
              <Box display="flex" flexDirection="column" alignItems="center" mx={2}>
                <Flight sx={{ color: 'primary.main', mb: 0.5 }} />
                <Typography variant="caption" color="text.secondary">
                  {flight.duration}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {flight.stops === 0 ? 'Direct' : `${flight.stops} escale${flight.stops > 1 ? 's' : ''}`}
                </Typography>
              </Box>
              
              <Box textAlign="center">
                <Typography variant="h6" fontWeight="bold">
                  {formatTime(flight.arrivalTime)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {flight.arrivalAirport}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Recommandation IA */}
          <Grid item xs={12} md={3}>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Recommandation IA
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {flight.prediction.recommendation}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Confiance: {flight.prediction.confidence}%
              </Typography>
            </Box>
          </Grid>

          {/* Prix et bouton de réservation */}
          <Grid item xs={12} md={3}>
            <Box display="flex" flexDirection="column" alignItems="flex-end">
              <Box display="flex" alignItems="center" mb={1}>
                <Euro sx={{ mr: 0.5, color: 'primary.main' }} />
                <Typography variant="h5" fontWeight="bold" color="primary.main">
                  {flight.price}
                </Typography>
                <Typography variant="body2" color="text.secondary" ml={0.5}>
                  {flight.currency}
                </Typography>
              </Box>
              
              <Button
                variant="contained"
                size="large"
                onClick={() => onBook(flight.id)}
                sx={{ minWidth: 120 }}
              >
                Réserver
              </Button>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default FlightCard; 