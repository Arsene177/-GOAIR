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
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { authService } from '../services/api';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants';
import { useQuickNotifications } from '../components/NotificationSystem';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { showSuccess, showError, showInfo } = useQuickNotifications();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Effacer les erreurs quand l'utilisateur commence à taper
    if (error) setError(null);
  };

  const validateForm = () => {
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
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      showInfo('Connexion en cours', 'Vérification de vos identifiants...');
      const response = await authService.login(formData);
      
      // Stocker le token et les informations utilisateur
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setSuccess(SUCCESS_MESSAGES.LOGIN_SUCCESS);
      showSuccess('Connexion réussie !', `Bienvenue ${response.user.name} !`);
      
      // Rediriger vers la page d'accueil après un court délai
      setTimeout(() => {
        navigate('/');
      }, 1500);
      
    } catch (err: any) {
      console.error('Erreur de connexion:', err);
      
      // Gérer les différents types d'erreurs
      let errorMessage = ERROR_MESSAGES.NETWORK_ERROR;
      if (err.response?.status === 401) {
        errorMessage = ERROR_MESSAGES.INVALID_CREDENTIALS;
      } else if (err.response?.status === 400) {
        errorMessage = err.response.data?.message || ERROR_MESSAGES.INVALID_CREDENTIALS;
      }
      
      setError(errorMessage);
      showError('Erreur de connexion', errorMessage);
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
            maxWidth: 500,
            mx: 'auto'
          }}
        >
          <Box textAlign="center" mb={4}>
            <Typography variant="h4" component="h1" gutterBottom>
              Connexion
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Connectez-vous à votre compte Horizon
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
              autoComplete="current-password"
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
                'Se connecter'
              )}
            </Button>
          </form>

          <Box textAlign="center" mt={2}>
            <Typography variant="body2" color="text.secondary">
              Pas encore de compte ?{' '}
              <Link component={RouterLink} to="/register" color="primary">
                S'inscrire
              </Link>
            </Typography>
          </Box>

          <Box textAlign="center" mt={1}>
            <Link component={RouterLink} to="/forgot-password" color="primary" variant="body2">
              Mot de passe oublié ?
            </Link>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage; 