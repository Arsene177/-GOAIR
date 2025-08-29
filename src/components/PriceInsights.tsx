import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Grid,
  IconButton,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Info as InfoIcon,
  WbSunny as WeatherIcon,
  Event as SeasonIcon,
  People as DemandIcon,
  Schedule as TimeIcon
} from '@mui/icons-material';

interface PriceInsightsProps {
  departure: string;
  arrival: string;
  departureDate: string;
  onShowOnboarding: () => void;
}

const PriceInsights: React.FC<PriceInsightsProps> = ({ 
  departure, 
  arrival, 
  departureDate, 
  onShowOnboarding 
}) => {
  const theme = useTheme();
  
  // Analyze the search parameters to provide relevant insights
  const getInsights = () => {
    const date = new Date(departureDate);
    const month = date.getMonth();
    const dayOfWeek = date.getDay();
    
    const insights = [];
    
    // Seasonal insights
    if (month >= 5 && month <= 8) {
      insights.push({
        type: 'season',
        title: 'Saison de pointe',
        description: 'Été - prix généralement plus élevés',
        impact: 'high',
        icon: <SeasonIcon />,
        color: 'error'
      });
    } else if (month >= 2 && month <= 4 || month >= 9 && month <= 10) {
      insights.push({
        type: 'season',
        title: 'Saison intermédiaire',
        description: 'Printemps/Automne - bon équilibre prix/disponibilité',
        impact: 'medium',
        icon: <SeasonIcon />,
        color: 'warning'
      });
    } else {
      insights.push({
        type: 'season',
        title: 'Basse saison',
        description: 'Hiver - généralement les meilleurs prix',
        impact: 'low',
        icon: <SeasonIcon />,
        color: 'success'
      });
    }
    
    // Day of week insights
    if (dayOfWeek === 5 || dayOfWeek === 0) {
      insights.push({
        type: 'timing',
        title: 'Weekend',
        description: 'Vendredi/Dimanche - prix plus élevés',
        impact: 'medium',
        icon: <TimeIcon />,
        color: 'warning'
      });
    } else if (dayOfWeek === 2 || dayOfWeek === 3) {
      insights.push({
        type: 'timing',
        title: 'Milieu de semaine',
        description: 'Mardi/Mercredi - souvent moins cher',
        impact: 'low',
        icon: <TimeIcon />,
        color: 'success'
      });
    }
    
    // Route insights (simplified)
    if (departure === 'CDG' || arrival === 'CDG') {
      insights.push({
        type: 'route',
        title: 'Aéroport principal',
        description: 'CDG - plus de concurrence, prix variables',
        impact: 'medium',
        icon: <DemandIcon />,
        color: 'info'
      });
    }
    
    return insights;
  };

  const insights = getInsights();

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  return (
    <Card sx={{ mb: 3, border: `1px solid ${theme.palette.divider}` }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h3" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            💡 Analyse des facteurs de prix
          </Typography>
          <Tooltip title="En savoir plus sur les facteurs de prix">
            <IconButton 
              size="small" 
              onClick={onShowOnboarding}
              sx={{ color: 'primary.main' }}
            >
              <InfoIcon />
            </IconButton>
          </Tooltip>
        </Box>
        
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Voici les facteurs qui influencent les prix pour votre recherche :
        </Typography>
        
        <Grid container spacing={2}>
          {insights.map((insight, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box 
                sx={{ 
                  p: 2, 
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 1,
                  bgcolor: 'background.paper',
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    boxShadow: 1
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Box sx={{ color: insight.color }}>
                    {insight.icon}
                  </Box>
                  <Typography variant="subtitle2" component="h4">
                    {insight.title}
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                  {insight.description}
                </Typography>
                
                <Chip 
                  label={`Impact ${insight.impact}`}
                  color={getImpactColor(insight.impact)}
                  size="small"
                  variant="outlined"
                />
              </Box>
            </Grid>
          ))}
        </Grid>
        
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="caption" color="textSecondary">
            💡 <strong>Conseil :</strong> Cliquez sur l'icône d'information pour découvrir tous les facteurs qui influencent les prix des vols !
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PriceInsights;
