import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Link,
  Paper,
  CircularProgress,
  Grid,
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { authService } from '../services/api';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Effacer les erreurs quand l'utilisateur commence à taper
    if (error) setError(null);
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError('Le prénom est requis');
      return false;
    }
    if (!formData.lastName.trim()) {
      setError('Le nom de famille est requis');
      return false;
    }
    if (!formData.email) {
      setError(ERROR_MESSAGES.REQUIRED_FIELD);
      return false;
    }
    if (!formData.email.includes('@')) {
      setError(ERROR_MESSAGES.INVALID_EMAIL);
      return false;
    }
    if (!formData.password) {
      setError(ERROR_MESSAGES.REQUIRED_FIELD);
      return false;
    }
    if (formData.password.length < 6) {
      setError(ERROR_MESSAGES.PASSWORD_TOO_SHORT);
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError(ERROR_MESSAGES.PASSWORDS_DONT_MATCH);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { confirmPassword, ...registerData } = formData;
      const response = await authService.register(registerData);
      
      // Stocker le token et les informations utilisateur
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setSuccess(SUCCESS_MESSAGES.REGISTER_SUCCESS);
      
      // Rediriger vers la page d'accueil après un court délai
      setTimeout(() => {
        navigate('/');
      }, 1500);
      
    } catch (err: any) {
      console.error('Erreur d\'inscription:', err);
      
      // Gérer les différents types d'erreurs
      if (err.response?.status === 409) {
        setError(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
      } else if (err.response?.status === 400) {
        setError(err.response.data?.message || 'Données invalides');
      } else {
        setError(ERROR_MESSAGES.NETWORK_ERROR);
      }
    } finally {
      setLoading(false);
    }
  };

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
      <Container maxWidth="sm">
        <Paper 
          sx={{ 
            p: { xs: 3, md: 4 }, 
            width: '100%',
            maxWidth: 600,
            mx: 'auto'
          }}
        >
          <Box textAlign="center" mb={4}>
            <Typography variant="h4" component="h1" gutterBottom>
              Inscription
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Créez votre compte Horizon
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Prénom"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  margin="normal"
                  required
                  disabled={loading}
                  autoComplete="given-name"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nom de famille"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  margin="normal"
                  required
                  disabled={loading}
                  autoComplete="family-name"
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              margin="normal"
              required
              disabled={loading}
              autoComplete="email"
            />

            <TextField
              fullWidth
              label="Mot de passe"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              margin="normal"
              required
              disabled={loading}
              autoComplete="new-password"
              helperText="Le mot de passe doit contenir au moins 6 caractères"
            />

            <TextField
              fullWidth
              label="Confirmer le mot de passe"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              margin="normal"
              required
              disabled={loading}
              autoComplete="new-password"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'S\'inscrire'
              )}
            </Button>
          </form>

          <Box textAlign="center" mt={2}>
            <Typography variant="body2" color="text.secondary">
              Déjà un compte ?{' '}
              <Link component={RouterLink} to="/login" color="primary">
                Se connecter
              </Link>
            </Typography>
          </Box>

          <Box textAlign="center" mt={2}>
            <Typography variant="caption" color="text.secondary">
              En vous inscrivant, vous acceptez nos{' '}
              <Link href="#" color="primary">
                conditions d'utilisation
              </Link>{' '}
              et notre{' '}
              <Link href="#" color="primary">
                politique de confidentialité
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegisterPage; 