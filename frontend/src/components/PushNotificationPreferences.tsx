import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
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
  useTheme,
  LinearProgress
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon,
  NotificationsOff as NotificationsOffIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Smartphone as SmartphoneIcon,
  Warning as WarningIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { NotificationPreferences } from '../types';

interface PushNotificationPreferencesProps {
  preferences: NotificationPreferences;
  onSave: (preferences: NotificationPreferences) => void;
  onRequestPermission?: () => Promise<NotificationPermission>;
  onTestNotification?: () => void;
}

const PushNotificationPreferences: React.FC<PushNotificationPreferencesProps> = ({
  preferences,
  onSave,
  onRequestPermission,
  onTestNotification
}) => {
  const theme = useTheme();
  const [localPreferences, setLocalPreferences] = useState<NotificationPreferences>(preferences);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isRequesting, setIsRequesting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testDialogOpen, setTestDialogOpen] = useState(false);

  const notificationTypes = [
    { id: 'price_alerts', label: 'Alertes de prix', description: 'Notifications instantanées quand le prix baisse' },
    { id: 'price_predictions', label: 'Prédictions de prix', description: 'Alertes sur les changements de tendance' },
    { id: 'booking_reminders', label: 'Rappels de réservation', description: 'Rappels avant l\'expiration des prix' },
    { id: 'flight_updates', label: 'Mises à jour de vol', description: 'Changements d\'horaire ou de porte' },
    { id: 'promotions', label: 'Promotions', description: 'Offres spéciales et réductions' }
  ];

  const frequencyOptions = [
    { value: 'immediate', label: 'Immédiat', description: 'Recevez les notifications dès qu\'elles sont disponibles' },
    { value: 'daily', label: 'Quotidien', description: 'Recevez un résumé quotidien à 9h' },
    { value: 'weekly', label: 'Hebdomadaire', description: 'Recevez un résumé hebdomadaire le lundi' }
  ];

  useEffect(() => {
    setLocalPreferences(preferences);
    checkNotificationPermission();
  }, [preferences]);

  const checkNotificationPermission = () => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  };

  const handlePushToggle = (enabled: boolean) => {
    setLocalPreferences(prev => ({
      ...prev,
      push: {
        ...prev.push,
        enabled
      }
    }));
  };

  const handleFrequencyChange = (frequency: 'immediate' | 'daily' | 'weekly') => {
    setLocalPreferences(prev => ({
      ...prev,
      push: {
        ...prev.push,
        frequency
      }
    }));
  };

  const handleTypeToggle = (typeId: string, enabled: boolean) => {
    setLocalPreferences(prev => {
      const newTypes = enabled
        ? [...prev.push.types, typeId]
        : prev.push.types.filter(type => type !== typeId);
      
      return {
        ...prev,
        push: {
          ...prev.push,
          types: newTypes
        }
      };
    });
  };

  const handleRequestPermission = async () => {
    if (!onRequestPermission) return;
    
    setIsRequesting(true);
    try {
      const newPermission = await onRequestPermission();
      setPermission(newPermission);
    } catch (err) {
      setError('Erreur lors de la demande d\'autorisation');
    } finally {
      setIsRequesting(false);
    }
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

  const handleTestNotification = async () => {
    if (onTestNotification) {
      try {
        await onTestNotification();
        setTestDialogOpen(false);
      } catch (err) {
        setError('Erreur lors de l\'envoi de la notification de test');
      }
    }
  };

  const getFrequencyDescription = (frequency: string) => {
    return frequencyOptions.find(opt => opt.value === frequency)?.description || '';
  };

  const getPermissionStatus = () => {
    switch (permission) {
      case 'granted':
        return { color: 'success', icon: <NotificationsActiveIcon />, text: 'Autorisé' };
      case 'denied':
        return { color: 'error', icon: <NotificationsOffIcon />, text: 'Refusé' };
      default:
        return { color: 'warning', icon: <NotificationsIcon />, text: 'Non demandé' };
    }
  };

  const permissionStatus = getPermissionStatus();

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <SmartphoneIcon color="primary" />
          <Typography variant="h6" component="h3">
            Notifications Push
          </Typography>
        </Box>

        {saved && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Préférences de notifications push sauvegardées avec succès !
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Permission Status */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: `1px solid ${theme.palette.divider}` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            {permissionStatus.icon}
            <Typography variant="subtitle1">
              Statut des autorisations
            </Typography>
            <Chip
              label={permissionStatus.text}
              color={permissionStatus.color}
              variant="outlined"
            />
          </Box>
          
          {permission === 'default' && (
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                Les notifications push nécessitent votre autorisation pour fonctionner. 
                Cliquez sur "Demander l'autorisation" pour activer les notifications.
              </Typography>
            </Alert>
          )}
          
          {permission === 'denied' && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="body2">
                Les notifications push ont été refusées. Vous pouvez les réactiver dans les paramètres de votre navigateur.
              </Typography>
            </Alert>
          )}

          {permission !== 'granted' && (
            <Button
              variant="contained"
              startIcon={<NotificationsIcon />}
              onClick={handleRequestPermission}
              disabled={isRequesting}
              sx={{ mb: 2 }}
            >
              {isRequesting ? 'Demande en cours...' : 'Demander l\'autorisation'}
            </Button>
          )}

          {isRequesting && (
            <LinearProgress sx={{ mb: 2 }} />
          )}
        </Box>

        <Grid container spacing={3}>
          {/* Push Activation */}
          <Grid item xs={12}>
            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={localPreferences.push.enabled && permission === 'granted'}
                    onChange={(e) => handlePushToggle(e.target.checked)}
                    color="primary"
                    disabled={permission !== 'granted'}
                  />
                }
                label={
                  <Box>
                    <Typography variant="subtitle1">
                      Activer les notifications push
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Recevez des notifications instantanées sur votre appareil
                    </Typography>
                    {permission !== 'granted' && (
                      <Typography variant="caption" color="error">
                        Autorisation requise pour activer les notifications push
                      </Typography>
                    )}
                  </Box>
                }
              />
            </Box>
          </Grid>

          {localPreferences.push.enabled && permission === 'granted' && (
            <>
              {/* Frequency */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Fréquence des notifications</InputLabel>
                  <Select
                    value={localPreferences.push.frequency}
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
                  {getFrequencyDescription(localPreferences.push.frequency)}
                </Typography>
              </Grid>

              {/* Notification Types */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Types de notifications
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Sélectionnez les types de notifications que vous souhaitez recevoir
                </Typography>
                
                <List sx={{ bgcolor: 'background.paper', borderRadius: 1, border: `1px solid ${theme.palette.divider}` }}>
                  {notificationTypes.map((type) => {
                    const isEnabled = localPreferences.push.types.includes(type.id);
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
              {localPreferences.push.types.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Types sélectionnés :
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {localPreferences.push.types.map((typeId) => {
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
                    startIcon={<NotificationsIcon />}
                    onClick={() => setTestDialogOpen(true)}
                  >
                    Tester la notification
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<CheckCircleIcon />}
                    onClick={handleSave}
                  >
                    Sauvegarder
                  </Button>
                </Box>
              </Grid>
            </>
          )}
        </Grid>

        {/* Test Notification Dialog */}
        <Dialog open={testDialogOpen} onClose={() => setTestDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <NotificationsIcon color="primary" />
              Tester la notification
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Une notification de test sera envoyée pour vérifier que les notifications push fonctionnent correctement.
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                Assurez-vous que votre navigateur autorise les notifications pour ce site.
              </Typography>
            </Alert>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setTestDialogOpen(false)} startIcon={<CancelIcon />}>
              Annuler
            </Button>
            <Button
              onClick={handleTestNotification}
              variant="contained"
              startIcon={<NotificationsIcon />}
            >
              Envoyer le test
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default PushNotificationPreferences;
