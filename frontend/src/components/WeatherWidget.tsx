import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  WbSunny as SunIcon,
  Cloud as CloudIcon,
  Opacity as HumidityIcon,
  Air as WindIcon,
  Refresh as RefreshIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';

// Mock weather data as fallback
const mockWeatherData = {
  coord: { lon: 9.7043, lat: 4.0483 },
  weather: [{ id: 800, main: 'Clear', description: 'ciel dégagé', icon: '01d' }],
  main: { temp: 24, feels_like: 25, humidity: 85, pressure: 1014 },
  wind: { speed: 2, deg: 180 },
  name: 'Douala',
  sys: { country: 'CM' }
};

interface WeatherData {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  name: string;
  sys: {
    country: string;
  };
}

interface WeatherWidgetProps {
  city?: string;
  className?: string;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ city = 'Douala', className }) => {
  const [weather, setWeather] = useState<WeatherData>(mockWeatherData);
  const [loading, setLoading] = useState(false);
  const [useMockData, setUseMockData] = useState(true);

  const fetchWeather = async () => {
    if (!city) return;
    
    setLoading(true);
    
    try {
      // Try to import the weather service dynamically to avoid breaking the page
      const { weatherService } = await import('../services/api');
      const data = await weatherService.getWeather(city);
      setWeather(data);
      setUseMockData(false);
    } catch (err) {
      console.warn('Weather API failed, keeping mock data:', err);
      // Keep existing mock data, don't change anything
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Always start with mock data to prevent page from breaking
    setWeather(mockWeatherData);
    setUseMockData(true);
    
    // Try to fetch real data in background (optional)
    // fetchWeather();
  }, [city]);

  const getWeatherIcon = (iconCode: string) => {
    if (iconCode.includes('01')) return <SunIcon color="warning" />;
    if (iconCode.includes('02') || iconCode.includes('03') || iconCode.includes('04')) return <CloudIcon color="info" />;
    if (iconCode.includes('09') || iconCode.includes('10')) return <HumidityIcon color="primary" />;
    if (iconCode.includes('11')) return <CloudIcon color="error" />;
    if (iconCode.includes('13')) return <CloudIcon color="info" />;
    if (iconCode.includes('50')) return <CloudIcon color="info" />;
    return <SunIcon color="warning" />;
  };

  const getWindDirection = (degrees: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  return (
    <Card className={className} sx={{ minWidth: 280 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <LocationIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" component="h3">
            {weather.name}, {weather.sys.country}
          </Typography>
          <Tooltip title="Actualiser">
            <IconButton onClick={fetchWeather} size="small" sx={{ ml: 'auto' }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {useMockData && (
          <Alert severity="info" sx={{ mb: 2, fontSize: '0.75rem' }}>
            Données de démonstration (API non disponible)
          </Alert>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {getWeatherIcon(weather.weather[0]?.icon || '01d')}
          <Box sx={{ ml: 2 }}>
            <Typography variant="h4" component="div">
              {Math.round(weather.main.temp)}°C
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ressenti {Math.round(weather.main.feels_like)}°C
            </Typography>
          </Box>
        </Box>

        <Typography variant="body1" sx={{ mb: 2, textTransform: 'capitalize' }}>
          {weather.weather[0]?.description}
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Chip
            icon={<HumidityIcon />}
            label={`${weather.main.humidity}%`}
            size="small"
            variant="outlined"
          />
          <Chip
            icon={<WindIcon />}
            label={`${weather.wind.speed} m/s ${getWindDirection(weather.wind.deg)}`}
            size="small"
            variant="outlined"
          />
          <Chip
            label={`${weather.main.pressure} hPa`}
            size="small"
            variant="outlined"
          />
        </Box>

        <Box sx={{ mt: 2, fontSize: '0.75rem', color: 'text.secondary' }}>
          <Typography variant="caption" display="block">
            Coordonnées: {weather.coord.lat.toFixed(2)}°, {weather.coord.lon.toFixed(2)}°
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;
