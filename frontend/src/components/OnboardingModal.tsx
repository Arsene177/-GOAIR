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
    title: 'Seasonal Variations',
    description: 'Flight prices change significantly throughout the year based on travel seasons and holidays.',
    icon: <SeasonIcon color="primary" sx={{ fontSize: 40 }} />,
    factors: [
      {
        name: 'Peak Season',
        description: 'Summer months, school holidays, and major holidays',
        impact: 'high',
        trend: 'up',
        example: 'Prices can be 2-3x higher during peak season'
      },
      {
        name: 'Shoulder Season',
        description: 'Spring and fall months with moderate demand',
        impact: 'medium',
        trend: 'variable',
        example: 'Good balance of price and availability'
      },
      {
        name: 'Off-Peak Season',
        description: 'Winter months (except holidays) and low-demand periods',
        impact: 'high',
        trend: 'down',
        example: 'Best prices, often 30-50% lower'
      }
    ]
  },
  {
    title: 'Weather & Natural Events',
    description: 'Weather conditions and natural events can significantly impact flight availability and pricing.',
    icon: <WeatherIcon color="primary" sx={{ fontSize: 40 }} />,
    factors: [
      {
        name: 'Severe Weather',
        description: 'Storms, hurricanes, snowstorms affecting operations',
        impact: 'high',
        trend: 'up',
        example: 'Prices spike due to cancellations and rebookings'
      },
      {
        name: 'Seasonal Weather Patterns',
        description: 'Monsoon seasons, hurricane seasons, winter conditions',
        impact: 'medium',
        trend: 'variable',
        example: 'Predictable price increases during affected periods'
      },
      {
        name: 'Natural Disasters',
        description: 'Earthquakes, volcanic eruptions, wildfires',
        impact: 'high',
        trend: 'up',
        example: 'Immediate price increases and route changes'
      }
    ]
  },
  {
    title: 'Demand & Supply',
    description: 'The basic economic principle of supply and demand drives most price fluctuations.',
    icon: <DemandIcon color="primary" sx={{ fontSize: 40 }} />,
    factors: [
      {
        name: 'Route Popularity',
        description: 'High-demand routes vs. less popular destinations',
        impact: 'high',
        trend: 'up',
        example: 'Popular routes often have higher prices'
      },
      {
        name: 'Flight Frequency',
        description: 'Number of flights available on a route',
        impact: 'medium',
        trend: 'variable',
        example: 'More flights usually mean better prices'
      },
      {
        name: 'Competition',
        description: 'Number of airlines operating on the same route',
        impact: 'high',
        trend: 'down',
        example: 'More competition typically lowers prices'
      }
    ]
  },
  {
    title: 'Operational Costs',
    description: 'Airlines\' operational expenses directly influence ticket pricing.',
    icon: <PriceIcon color="primary" sx={{ fontSize: 40 }} />,
    factors: [
      {
        name: 'Fuel Prices',
        description: 'Jet fuel costs, which can vary significantly',
        impact: 'high',
        trend: 'variable',
        example: 'Fuel surcharges added during high oil prices'
      },
      {
        name: 'Airport Fees',
        description: 'Landing fees, terminal charges, and taxes',
        impact: 'medium',
        trend: 'up',
        example: 'Major airports often have higher fees'
      },
      {
        name: 'Labor Costs',
        description: 'Pilot, crew, and ground staff salaries',
        impact: 'medium',
        trend: 'up',
        example: 'Costs passed on to passengers over time'
      }
    ]
  },
  {
    title: 'Timing & Booking',
    description: 'When you book and when you travel can make a huge difference in price.',
    icon: <TimeIcon color="primary" sx={{ fontSize: 40 }} />,
    factors: [
      {
        name: 'Advance Booking',
        description: 'How far in advance you book your flight',
        impact: 'high',
        trend: 'down',
        example: 'Booking 2-3 months ahead often saves money'
      },
      {
        name: 'Day of Week',
        description: 'Certain days are typically cheaper to fly',
        impact: 'medium',
        trend: 'variable',
        example: 'Tuesday/Wednesday often cheaper than Friday/Sunday'
      },
      {
        name: 'Time of Day',
        description: 'Early morning or late night flights',
        impact: 'medium',
        trend: 'down',
        example: 'Red-eye flights usually cost less'
      }
    ]
  },
  {
    title: 'Route & Distance',
    description: 'The specific route and distance can significantly impact pricing.',
    icon: <RouteIcon color="primary" sx={{ fontSize: 40 }} />,
    factors: [
      {
        name: 'Direct vs. Connecting',
        description: 'Non-stop flights vs. flights with layovers',
        impact: 'high',
        trend: 'up',
        example: 'Direct flights often cost more but save time'
      },
      {
        name: 'Route Efficiency',
        description: 'Popular business routes vs. leisure routes',
        impact: 'medium',
        trend: 'variable',
        example: 'Business routes may have higher prices'
      },
      {
        name: 'Alternative Airports',
        description: 'Main airports vs. smaller regional airports',
        impact: 'medium',
        trend: 'down',
        example: 'Regional airports often offer better prices'
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
            Understanding Flight Prices
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
                Step {activeStep + 1} of {onboardingSteps.length}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {Math.round(progress)}% Complete
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
                          label={`${factor.impact} impact`}
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
                Pro Tips
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {activeStep === 0 && "Book during shoulder seasons for the best balance of price and weather."}
                {activeStep === 1 && "Monitor weather forecasts and consider travel insurance for weather-sensitive trips."}
                {activeStep === 2 && "Compare prices across multiple airlines and consider alternative airports."}
                {activeStep === 3 && "Fuel surcharges are often included in the base fare, so compare total costs."}
                {activeStep === 4 && "Set price alerts and be flexible with your travel dates for better deals."}
                {activeStep === 5 && "Consider nearby airports and be open to connecting flights for savings."}
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
          Back
        </Button>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          {activeStep === onboardingSteps.length - 1 ? (
            <Button onClick={onClose} variant="contained">
              Got it!
            </Button>
          ) : (
            <Button onClick={handleNext} variant="contained">
              Next
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default OnboardingModal;
