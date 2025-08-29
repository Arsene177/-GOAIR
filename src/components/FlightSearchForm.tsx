import React, { useState } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  Autocomplete,
} from '@mui/material';
import { Search, SwapHoriz } from '@mui/icons-material';
import { FlightSearch } from '../types';
import { CABIN_CLASSES, MAX_PASSENGERS } from '../constants';
import { searchAirports, getAirportByCode, getPopularAirports, Airport } from '../constants/airports';

interface FlightSearchFormProps {
  onSearch: (searchData: FlightSearch) => void;
  loading?: boolean;
}

const FlightSearchForm: React.FC<FlightSearchFormProps> = ({ onSearch, loading = false }) => {
  const [searchData, setSearchData] = useState<FlightSearch>({
    departure: '',
    arrival: '',
    departureDate: '',
    returnDate: '',
    passengers: 1,
    cabinClass: 'economy',
  });

  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [departureOptions, setDepartureOptions] = useState<Airport[]>([]);
  const [arrivalOptions, setArrivalOptions] = useState<Airport[]>([]);
  const [departureInput, setDepartureInput] = useState('');
  const [arrivalInput, setArrivalInput] = useState('');

  const handleInputChange = (field: keyof FlightSearch, value: string | number) => {
    setSearchData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSwapAirports = () => {
    setSearchData(prev => ({
      ...prev,
      departure: prev.arrival,
      arrival: prev.departure
    }));
    setDepartureInput(arrivalInput);
    setArrivalInput(departureInput);
  };

  const handleDepartureInputChange = (input: string) => {
    setDepartureInput(input);
    if (input.length >= 2) {
      const options = searchAirports(input);
      setDepartureOptions(options);
    } else {
      setDepartureOptions(getPopularAirports());
    }
  };

  const handleArrivalInputChange = (input: string) => {
    setArrivalInput(input);
    if (input.length >= 2) {
      const options = searchAirports(input);
      setArrivalOptions(options);
    } else {
      setArrivalOptions(getPopularAirports());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchData.departure && searchData.arrival && searchData.departureDate) {
      onSearch(searchData);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  // Initialiser les options avec les aéroports populaires
  React.useEffect(() => {
    setDepartureOptions(getPopularAirports());
    setArrivalOptions(getPopularAirports());
  }, []);

  return (
    <Card sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 3 }}>
          Trouvez votre vol idéal
        </Typography>
        
        {/* Price Factors Info */}
        <Box 
          sx={{ 
            mb: 3, 
            p: 2, 
            bgcolor: 'info.50', 
            borderRadius: 2, 
            border: '1px solid',
            borderColor: 'info.200'
          }}
        >
          <Typography variant="body2" color="info.700" align="center">
            💡 <strong>Conseil :</strong> Les prix des vols varient selon la saison, la météo, la demande et d'autres facteurs. 
            Cliquez sur l'icône d'aide pour comprendre comment optimiser vos réservations !
          </Typography>
        </Box>
        
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
          Comparez les prix et obtenez des prédictions intelligentes pour réserver au meilleur moment
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Aéroports */}
            <Grid item xs={12} md={5}>
              <Autocomplete
                options={departureOptions}
                getOptionLabel={(option) => `${option.city} (${option.code}) - ${option.country}`}
                value={getAirportByCode(searchData.departure) || null}
                inputValue={departureInput}
                onInputChange={(_, newInputValue) => handleDepartureInputChange(newInputValue)}
                onChange={(_, newValue) => {
                  handleInputChange('departure', newValue?.code || '');
                  setDepartureInput(newValue ? `${newValue.city} (${newValue.code})` : '');
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Aéroport de départ"
                    placeholder="Ex: Douala, Paris, New York..."
                    required
                    fullWidth
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        {option.city} ({option.code})
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {option.name} - {option.country}
                      </Typography>
                    </Box>
                  </Box>
                )}
                noOptionsText="Aucun aéroport trouvé"
                loading={false}
              />
            </Grid>

            <Grid item xs={12} md={2} display="flex" alignItems="center" justifyContent="center">
              <Button
                variant="outlined"
                onClick={handleSwapAirports}
                sx={{ minWidth: 'auto', p: 1 }}
              >
                <SwapHoriz />
              </Button>
            </Grid>

            <Grid item xs={12} md={5}>
              <Autocomplete
                options={arrivalOptions}
                getOptionLabel={(option) => `${option.city} (${option.code}) - ${option.country}`}
                value={getAirportByCode(searchData.arrival) || null}
                inputValue={arrivalInput}
                onInputChange={(_, newInputValue) => handleArrivalInputChange(newInputValue)}
                onChange={(_, newValue) => {
                  handleInputChange('arrival', newValue?.code || '');
                  setArrivalInput(newValue ? `${newValue.city} (${newValue.code})` : '');
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Aéroport d'arrivée"
                    placeholder="Ex: Douala, Paris, New York..."
                    required
                    fullWidth
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        {option.city} ({option.code})
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {option.name} - {option.country}
                      </Typography>
                    </Box>
                  </Box>
                )}
                noOptionsText="Aucun aéroport trouvé"
                loading={false}
              />
            </Grid>

            {/* Dates */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Date de départ"
                type="date"
                value={searchData.departureDate}
                onChange={(e) => handleInputChange('departureDate', e.target.value)}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: today }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Date de retour"
                type="date"
                value={searchData.returnDate}
                onChange={(e) => handleInputChange('returnDate', e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                inputProps={{ 
                  min: searchData.departureDate || tomorrow,
                  disabled: !isRoundTrip 
                }}
                disabled={!isRoundTrip}
              />
            </Grid>

            {/* Passagers et Classe */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Passagers</InputLabel>
                <Select
                  value={searchData.passengers}
                  label="Passagers"
                  onChange={(e) => handleInputChange('passengers', Number(e.target.value))}
                >
                  {Array.from({ length: MAX_PASSENGERS }, (_, i) => i + 1).map(num => (
                    <MenuItem key={num} value={num}>
                      {num} {num === 1 ? 'passager' : 'passagers'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Classe de cabine</InputLabel>
                <Select
                  value={searchData.cabinClass}
                  label="Classe de cabine"
                  onChange={(e) => handleInputChange('cabinClass', e.target.value)}
                >
                  {CABIN_CLASSES.map(cabin => (
                    <MenuItem key={cabin.value} value={cabin.value}>
                      {cabin.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Type de voyage */}
            <Grid item xs={12}>
              <Box display="flex" gap={1} justifyContent="center">
                <Chip
                  label="Aller simple"
                  variant={!isRoundTrip ? "filled" : "outlined"}
                  color={!isRoundTrip ? "primary" : "default"}
                  onClick={() => {
                    setIsRoundTrip(false);
                    handleInputChange('returnDate', '');
                  }}
                  sx={{ cursor: 'pointer' }}
                />
                <Chip
                  label="Aller-retour"
                  variant={isRoundTrip ? "filled" : "outlined"}
                  color={isRoundTrip ? "primary" : "default"}
                  onClick={() => setIsRoundTrip(true)}
                  sx={{ cursor: 'pointer' }}
                />
              </Box>
            </Grid>

            {/* Bouton de recherche */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading || !searchData.departure || !searchData.arrival || !searchData.departureDate}
                startIcon={<Search />}
                sx={{ py: 1.5, fontSize: '1.1rem' }}
              >
                {loading ? 'Recherche en cours...' : 'Rechercher des vols'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default FlightSearchForm; 