import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Alert,
  Chip,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme
} from '@mui/material';
import {
  Email as EmailIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import { NotificationPreferences } from '../types';

interface EmailNotificationPreferencesProps {
  preferences: NotificationPreferences;
  onSave: (preferences: NotificationPreferences) => void;
  onTestEmail?: (email: string) => void;
}

const EmailNotificationPreferences: React.FC<EmailNotificationPreferencesProps> = ({
  preferences,
  onSave,
  onTestEmail
}) => {
  const theme = useTheme();
  const [localPreferences, setLocalPreferences] = useState<NotificationPreferences>(preferences);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testDialogOpen, setTestDialogOpen] = useState(false);
  const [testEmail, setTestEmail] = useState('');

  const notificationTypes = [
    { id: 'price_alerts', label: 'Alertes de prix', description: 'Notifications quand le prix d\'un vol baisse' },
    { id: 'price_predictions', label: 'Prédictions de prix', description: 'Rapports hebdomadaires sur les tendances de prix' },
    { id: 'booking_reminders', label: 'Rappels de réservation', description: 'Rappels avant l\'expiration des prix' },
    { id: 'flight_updates', label: 'Mises à jour de vol', description: 'Changements d\'horaire ou de porte' },
    { id: 'promotions', label: 'Promotions', description: 'Offres spéciales et réductions' },
    { id: 'newsletter', label: 'Newsletter', description: 'Actualités et conseils de voyage' }
  ];

  const frequencyOptions = [
    { value: 'immediate', label: 'Immédiat', description: 'Recevez les notifications dès qu\'elles sont disponibles' },
    { value: 'daily', label: 'Quotidien', description: 'Recevez un résumé quotidien à 9h' },
    { value: 'weekly', label: 'Hebdomadaire', description: 'Recevez un résumé hebdomadaire le lundi' }
  ];

  useEffect(() => {
    setLocalPreferences(preferences);
  }, [preferences]);

  const handleEmailToggle = (enabled: boolean) => {
    setLocalPreferences(prev => ({
      ...prev,
      email: {
        ...prev.email,
        enabled
      }
    }));
  };

  const handleEmailChange = (email: string) => {
    setLocalPreferences(prev => ({
      ...prev,
      email: {
        ...prev.email,
        address: email
      }
    }));
  };

  const handleFrequencyChange = (frequency: 'immediate' | 'daily' | 'weekly') => {
    setLocalPreferences(prev => ({
      ...prev,
      email: {
        ...prev.email,
        frequency
      }
    }));
  };

  const handleTypeToggle = (typeId: string, enabled: boolean) => {
    setLocalPreferences(prev => {
      const newTypes = enabled
        ? [...prev.email.types, typeId]
        : prev.email.types.filter(type => type !== typeId);
      
      return {
        ...prev,
        email: {
          ...prev.email,
          types: newTypes
        }
      };
    });
  };

  const handleSave = async () => {
    try {
      setError(null);
      await onSave(localPreferences);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError('Erreur lors de la sauvegarde des préférences');
    }
  };

  const handleTestEmail = async () => {
    if (onTestEmail && testEmail) {
      try {
        await onTestEmail(testEmail);
        setTestDialogOpen(false);
        setTestEmail('');
      } catch (err) {
        setError('Erreur lors de l\'envoi de l\'email de test');
      }
    }
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const getFrequencyDescription = (frequency: string) => {
    return frequencyOptions.find(opt => opt.value === frequency)?.description || '';
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <EmailIcon color="primary" />
          <Typography variant="h6" component="h3">
            Préférences Email
          </Typography>
        </Box>

        {saved && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Préférences email sauvegardées avec succès !
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Email Activation */}
          <Grid item xs={12}>
            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={localPreferences.email.enabled}
                    onChange={(e) => handleEmailToggle(e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography variant="subtitle1">
                      Activer les notifications email
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Recevez des notifications par email pour vos alertes de prix et autres informations importantes
                    </Typography>
                  </Box>
                }
              />
            </Box>
          </Grid>

          {localPreferences.email.enabled && (
            <>
              {/* Email Address */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Adresse email"
                  type="email"
                  value={localPreferences.email.address}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  error={localPreferences.email.address && !isValidEmail(localPreferences.email.address)}
                  helperText={
                    localPreferences.email.address && !isValidEmail(localPreferences.email.address)
                      ? 'Veuillez entrer une adresse email valide'
                      : 'Adresse email où vous souhaitez recevoir les notifications'
                  }
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={() => setTestDialogOpen(true)}
                        disabled={!isValidEmail(localPreferences.email.address)}
                        size="small"
                      >
                        <EmailIcon />
                      </IconButton>
                    )
                  }}
                />
              </Grid>

              {/* Frequency */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Fréquence des notifications</InputLabel>
                  <Select
                    value={localPreferences.email.frequency}
                    label="Fréquence des notifications"
                    onChange={(e) => handleFrequencyChange(e.target.value as 'immediate' | 'daily' | 'weekly')}
                  >
                    {frequencyOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        <Box>
                          <Typography variant="body1">{option.label}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            {option.description}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                  {getFrequencyDescription(localPreferences.email.frequency)}
                </Typography>
              </Grid>

              {/* Notification Types */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Types de notifications
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Sélectionnez les types de notifications que vous souhaitez recevoir par email
                </Typography>
                
                <List sx={{ bgcolor: 'background.paper', borderRadius: 1, border: `1px solid ${theme.palette.divider}` }}>
                  {notificationTypes.map((type) => {
                    const isEnabled = localPreferences.email.types.includes(type.id);
                    return (
                      <ListItem key={type.id} divider>
                        <ListItemText
                          primary={type.label}
                          secondary={type.description}
                        />
                        <ListItemSecondaryAction>
                          <Switch
                            checked={isEnabled}
                            onChange={(e) => handleTypeToggle(type.id, e.target.checked)}
                            color="primary"
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    );
                  })}
                </List>
              </Grid>

              {/* Selected Types Summary */}
              {localPreferences.email.types.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Types sélectionnés :
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {localPreferences.email.types.map((typeId) => {
                      const type = notificationTypes.find(t => t.id === typeId);
                      return (
                        <Chip
                          key={typeId}
                          label={type?.label || typeId}
                          color="primary"
                          variant="outlined"
                          size="small"
                          onDelete={() => handleTypeToggle(typeId, false)}
                        />
                      );
                    })}
                  </Box>
                </Grid>
              )}

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    startIcon={<EmailIcon />}
                    onClick={() => setTestDialogOpen(true)}
                    disabled={!isValidEmail(localPreferences.email.address)}
                  >
                    Tester l'email
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<CheckCircleIcon />}
                    onClick={handleSave}
                    disabled={!isValidEmail(localPreferences.email.address)}
                  >
                    Sauvegarder
                  </Button>
                </Box>
              </Grid>
            </>
          )}
        </Grid>

        {/* Test Email Dialog */}
        <Dialog open={testDialogOpen} onClose={() => setTestDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EmailIcon color="primary" />
              Tester l'email
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Un email de test sera envoyé à l'adresse spécifiée pour vérifier que les notifications fonctionnent correctement.
            </Typography>
            <TextField
              fullWidth
              label="Adresse email de test"
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder={localPreferences.email.address}
              helperText="Laissez vide pour utiliser l'adresse principale"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setTestDialogOpen(false)} startIcon={<CancelIcon />}>
              Annuler
            </Button>
            <Button
              onClick={handleTestEmail}
              variant="contained"
              startIcon={<EmailIcon />}
              disabled={testEmail && !isValidEmail(testEmail)}
            >
              Envoyer le test
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default EmailNotificationPreferences;
