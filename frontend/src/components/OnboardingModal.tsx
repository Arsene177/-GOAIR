import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  LinearProgress,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Close as CloseIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  WbSunny as WeatherIcon,
  Event as SeasonIcon,
  Flight as FlightIcon,
  People as DemandIcon,
  AttachMoney as PriceIcon,
  OilBarrel as FuelIcon,
  Schedule as TimeIcon,
  LocationOn as RouteIcon,
  Star as PremiumIcon
} from '@mui/icons-material';

interface OnboardingStep {
  title: string;
  description: string;
  factors: PriceFactor[];
  icon: React.ReactNode;
}

interface PriceFactor {
  name: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  trend: 'up' | 'down' | 'variable';
  example: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    title: 'Variations Saisonnières',
    description: 'Les prix des vols changent considérablement tout au long de l\'année selon les saisons de voyage et les vacances.',
    icon: <SeasonIcon color="primary" sx={{ fontSize: 40 }} />,
    factors: [
      {
        name: 'Haute Saison',
        description: 'Mois d\'été, vacances scolaires et grandes fêtes',
        impact: 'high',
        trend: 'up',
        example: 'Les prix peuvent être 2-3x plus élevés en haute saison'
      },
      {
        name: 'Saison Intermédiaire',
        description: 'Mois de printemps et d\'automne avec une demande modérée',
        impact: 'medium',
        trend: 'variable',
        example: 'Bon équilibre entre prix et disponibilité'
      },
      {
        name: 'Basse Saison',
        description: 'Mois d\'hiver (sauf fêtes) et périodes de faible demande',
        impact: 'high',
        trend: 'down',
        example: 'Meilleurs prix, souvent 30-50% moins chers'
      }
    ]
  },
  {
    title: 'Météo et Événements Naturels',
    description: 'Les conditions météorologiques et les événements naturels peuvent considérablement impacter la disponibilité et les prix des vols.',
    icon: <WeatherIcon color="primary" sx={{ fontSize: 40 }} />,
    factors: [
      {
        name: 'Météo Sévère',
        description: 'Tempêtes, ouragans, blizzards affectant les opérations',
        impact: 'high',
        trend: 'up',
        example: 'Les prix augmentent à cause des annulations et rébookings'
      },
      {
        name: 'Modèles Météorologiques Saisonniers',
        description: 'Saisons de mousson, saisons d\'ouragans, conditions hivernales',
        impact: 'medium',
        trend: 'variable',
        example: 'Augmentations de prix prévisibles pendant les périodes affectées'
      },
      {
        name: 'Catastrophes Naturelles',
        description: 'Tremblements de terre, éruptions volcaniques, feux de forêt',
        impact: 'high',
        trend: 'up',
        example: 'Augmentations de prix immédiates et changements d\'itinéraires'
      }
    ]
  },
  {
    title: 'Offre et Demande',
    description: 'Le principe économique de base de l\'offre et de la demande régit la plupart des fluctuations de prix.',
    icon: <DemandIcon color="primary" sx={{ fontSize: 40 }} />,
    factors: [
      {
        name: 'Popularité de la Route',
        description: 'Routes à forte demande vs. destinations moins populaires',
        impact: 'high',
        trend: 'up',
        example: 'Les routes populaires ont souvent des prix plus élevés'
      },
      {
        name: 'Fréquence des Vols',
        description: 'Nombre de vols disponibles sur une route',
        impact: 'medium',
        trend: 'variable',
        example: 'Plus de vols signifie généralement de meilleurs prix'
      },
      {
        name: 'Concurrence',
        description: 'Nombre de compagnies aériennes sur la même route',
        impact: 'high',
        trend: 'down',
        example: 'Plus de concurrence fait généralement baisser les prix'
      }
    ]
  },
  {
    title: 'Coûts Opérationnels',
    description: 'Les dépenses opérationnelles des compagnies aériennes influencent directement les prix des billets.',
    icon: <PriceIcon color="primary" sx={{ fontSize: 40 }} />,
    factors: [
      {
        name: 'Prix du Carburant',
        description: 'Coûts du carburant aviation, qui peuvent varier considérablement',
        impact: 'high',
        trend: 'variable',
        example: 'Suppléments carburant ajoutés pendant les prix élevés du pétrole'
      },
      {
        name: 'Frais d\'Aéroport',
        description: 'Frais d\'atterrissage, charges terminales et taxes',
        impact: 'medium',
        trend: 'up',
        example: 'Les grands aéroports ont souvent des frais plus élevés'
      },
      {
        name: 'Coûts de Main-d\'œuvre',
        description: 'Salaires des pilotes, équipage et personnel au sol',
        impact: 'medium',
        trend: 'up',
        example: 'Coûts répercutés sur les passagers au fil du temps'
      }
    ]
  },
  {
    title: 'Timing et Réservation',
    description: 'Quand vous réservez et quand vous voyagez peut faire une énorme différence de prix.',
    icon: <TimeIcon color="primary" sx={{ fontSize: 40 }} />,
    factors: [
      {
        name: 'Réservation à l\'Avance',
        description: 'Combien de temps à l\'avance vous réservez votre vol',
        impact: 'high',
        trend: 'down',
        example: 'Réserver 2-3 mois à l\'avance fait souvent économiser de l\'argent'
      },
      {
        name: 'Jour de la Semaine',
        description: 'Certains jours sont généralement moins chers pour voler',
        impact: 'medium',
        trend: 'variable',
        example: 'Mardi/Mercredi souvent moins cher que Vendredi/Dimanche'
      },
      {
        name: 'Heure de la Journée',
        description: 'Vols tôt le matin ou tard le soir',
        impact: 'medium',
        trend: 'down',
        example: 'Les vols de nuit coûtent généralement moins cher'
      }
    ]
  },
  {
    title: 'Route et Distance',
    description: 'La route spécifique et la distance peuvent considérablement impacter les prix.',
    icon: <RouteIcon color="primary" sx={{ fontSize: 40 }} />,
    factors: [
      {
        name: 'Direct vs. Avec Escale',
        description: 'Vols directs vs. vols avec escales',
        impact: 'high',
        trend: 'up',
        example: 'Les vols directs coûtent souvent plus cher mais font gagner du temps'
      },
      {
        name: 'Efficacité de la Route',
        description: 'Routes d\'affaires populaires vs. routes de loisir',
        impact: 'medium',
        trend: 'variable',
        example: 'Les routes d\'affaires peuvent avoir des prix plus élevés'
      },
      {
        name: 'Aéroports Alternatifs',
        description: 'Aéroports principaux vs. aéroports régionaux plus petits',
        impact: 'medium',
        trend: 'down',
        example: 'Les aéroports régionaux offrent souvent de meilleurs prix'
      }
    ]
  }
];

interface OnboardingModalProps {
  open: boolean;
  onClose: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ open, onClose }) => {
  const [activeStep, setActiveStep] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUpIcon color="error" />;
      case 'down': return <TrendingDownIcon color="success" />;
      case 'variable': return <TrendingUpIcon color="warning" />;
      default: return null;
    }
  };

  const progress = ((activeStep + 1) / onboardingSteps.length) * 100;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 2,
          minHeight: isMobile ? '100vh' : '80vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: `1px solid ${theme.palette.divider}`,
        pb: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FlightIcon color="primary" />
          <Typography variant="h5" component="h2">
            Comprendre les Prix des Vols
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="large">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 3 }}>
          {/* Progress Bar */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="textSecondary">
                Étape {activeStep + 1} sur {onboardingSteps.length}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {Math.round(progress)}% Terminé
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>

          {/* Current Step Content */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              {onboardingSteps[activeStep].icon}
              <Typography variant="h4" component="h3">
                {onboardingSteps[activeStep].title}
              </Typography>
            </Box>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
              {onboardingSteps[activeStep].description}
            </Typography>

            {/* Factors Grid */}
            <Grid container spacing={2}>
              {onboardingSteps[activeStep].factors.map((factor, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      height: '100%',
                      borderColor: theme.palette.divider,
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        boxShadow: 1
                      }
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="h6" component="h4" gutterBottom>
                          {factor.name}
                        </Typography>
                        {getTrendIcon(factor.trend)}
                      </Box>
                      
                      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                        {factor.description}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Chip 
                          label={`Impact ${factor.impact}`}
                          color={getImpactColor(factor.impact)}
                          size="small"
                        />
                        <Typography variant="caption" color="textSecondary" sx={{ fontStyle: 'italic' }}>
                          {factor.example}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Tips Section */}
          <Card sx={{ bgcolor: 'primary.50', border: 'none' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PremiumIcon color="primary" />
                Conseils Pro
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {activeStep === 0 && "Réservez pendant les saisons intermédiaires pour le meilleur équilibre entre prix et météo."}
                {activeStep === 1 && "Surveillez les prévisions météo et considérez une assurance voyage pour les voyages sensibles à la météo."}
                {activeStep === 2 && "Comparez les prix entre plusieurs compagnies aériennes et considérez des aéroports alternatifs."}
                {activeStep === 3 && "Les suppléments carburant sont souvent inclus dans le tarif de base, alors comparez les coûts totaux."}
                {activeStep === 4 && "Configurez des alertes de prix et soyez flexible avec vos dates de voyage pour de meilleures offres."}
                {activeStep === 5 && "Considérez les aéroports à proximité et soyez ouvert aux vols avec escales pour des économies."}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </DialogContent>

      <DialogActions sx={{ 
        p: 3, 
        borderTop: `1px solid ${theme.palette.divider}`,
        justifyContent: 'space-between'
      }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          sx={{ mr: 1 }}
        >
          Précédent
        </Button>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          {activeStep === onboardingSteps.length - 1 ? (
            <Button onClick={onClose} variant="contained">
              J'ai compris !
            </Button>
          ) : (
            <Button onClick={handleNext} variant="contained">
              Suivant
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default OnboardingModal;
