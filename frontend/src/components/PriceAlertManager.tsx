import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Grid,
  Chip,
  IconButton,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  useTheme
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Notifications as NotificationsIcon,
  TrendingDown as TrendingDownIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationOnIcon
} from '@mui/icons-material';
import { PriceAlert, NotificationPreferences } from '../types';
import { alertService } from '../services/api';

interface PriceAlertManagerProps {
  userId: string;
  onSaveAlert?: (alert: Omit<PriceAlert, 'id' | 'createdAt'>) => void;
  onUpdateAlert?: (alert: PriceAlert) => void;
  onDeleteAlert?: (alertId: string) => void;
}

const PriceAlertManager: React.FC<PriceAlertManagerProps> = ({
  userId,
  onSaveAlert,
  onUpdateAlert,
  onDeleteAlert
}) => {
  const theme = useTheme();
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState<PriceAlert | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    route: '',
    departureDate: '',
    targetPrice: '',
    isActive: true,
    notificationPreferences: {
      email: { enabled: true, frequency: 'immediate' as const, types: ['price_alerts'] },
      push: { enabled: false, frequency: 'immediate' as const, types: ['price_alerts'] },
      sms: { enabled: false, number: '', frequency: 'immediate' as const, types: [] }
    } as NotificationPreferences
  });

  useEffect(() => {
    loadAlerts();
  }, [userId]);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const backendAlerts = await alertService.getAlerts();
      
      // Map backend alerts to frontend format
      const mappedAlerts: PriceAlert[] = backendAlerts.map((alert: any) => ({
        id: String(alert.id),
        userId: String(alert.user_id),
        route: `${alert.departure} → ${alert.arrival}`,
        departureDate: alert.departure_date ? new Date(alert.departure_date).toISOString().split('T')[0] : '',
        targetPrice: alert.max_price || 0,
        currentPrice: 0, // This would come from current flight data
        isActive: alert.active,
        createdAt: alert.created_at,
        triggeredAt: alert.last_notified_at,
          notificationPreferences: {
            email: { enabled: true, address: 'user@example.com', frequency: 'immediate', types: ['price_alerts'] },
          push: { enabled: false, frequency: 'immediate', types: ['price_alerts'] },
            sms: { enabled: false, number: '', frequency: 'immediate', types: [] }
          }
      }));
      
      setAlerts(mappedAlerts);
    } catch (err) {
      console.error('Error loading alerts:', err);
      setError('Erreur lors du chargement des alertes');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (alert?: PriceAlert) => {
    if (alert) {
      setEditingAlert(alert);
      setFormData({
        route: alert.route,
        departureDate: alert.departureDate,
        targetPrice: alert.targetPrice.toString(),
        isActive: alert.isActive,
        notificationPreferences: alert.notificationPreferences
      });
    } else {
      setEditingAlert(null);
      setFormData({
        route: '',
        departureDate: '',
        targetPrice: '',
        isActive: true,
        notificationPreferences: {
          email: { enabled: true, frequency: 'immediate', types: ['price_alerts'] },
          push: { enabled: false, frequency: 'immediate', types: ['price_alerts'] },
          sms: { enabled: false, number: '', frequency: 'immediate', types: [] }
        }
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingAlert(null);
    setError(null);
  };

  const handleSave = async () => {
    try {
      setError(null);
      
      // Parse route to extract departure and arrival airports
      const routeParts = formData.route.split(' → ');
      const departure = routeParts[0]?.trim();
      const arrival = routeParts[1]?.trim();
      
      if (!departure || !arrival) {
        setError('Format de route invalide. Utilisez: Aéroport de départ → Aéroport d\'arrivée');
        return;
      }
      
      const alertData = {
        name: `${departure} → ${arrival}`,
        departure,
        arrival,
        departure_date: formData.departureDate ? new Date(formData.departureDate).toISOString() : null,
        max_price: parseFloat(formData.targetPrice),
        currency: 'USD',
        check_frequency_minutes: 60,
        notify_channel: formData.notificationPreferences.email.enabled ? 'email' : 'push',
        active: formData.isActive
      };

      if (editingAlert) {
        const updatedAlert = await alertService.updateAlert(parseInt(editingAlert.id), alertData);
        setAlerts(prev => prev.map(alert => alert.id === editingAlert.id ? {
          ...alert,
          route: `${updatedAlert.departure} → ${updatedAlert.arrival}`,
          targetPrice: updatedAlert.max_price,
          isActive: updatedAlert.active
        } : alert));
      } else {
        const newAlert = await alertService.createAlert(alertData);
        const mappedAlert: PriceAlert = {
          id: String(newAlert.id),
          userId,
          route: `${newAlert.departure} → ${newAlert.arrival}`,
          departureDate: newAlert.departure_date ? new Date(newAlert.departure_date).toISOString().split('T')[0] : '',
          targetPrice: newAlert.max_price,
          currentPrice: 0,
          isActive: newAlert.active,
          createdAt: newAlert.created_at,
          notificationPreferences: formData.notificationPreferences
        };
        setAlerts(prev => [...prev, mappedAlert]);
      }
      
      handleCloseDialog();
    } catch (err) {
      console.error('Error saving alert:', err);
      setError('Erreur lors de la sauvegarde de l\'alerte');
    }
  };

  const handleDelete = async (alertId: string) => {
    try {
      await alertService.deleteAlert(parseInt(alertId));
      setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    } catch (err) {
      console.error('Error deleting alert:', err);
      setError('Erreur lors de la suppression de l\'alerte');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const getAlertStatus = (alert: PriceAlert) => {
    if (alert.triggeredAt) {
      return { color: 'success', text: 'Déclenchée', icon: <TrendingDownIcon /> };
    } else if (alert.currentPrice <= alert.targetPrice) {
      return { color: 'warning', text: 'Objectif atteint', icon: <TrendingDownIcon /> };
    } else {
      return { color: 'info', text: 'En attente', icon: <ScheduleIcon /> };
    }
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" component="h3" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <NotificationsIcon color="primary" />
            Mes alertes de prix
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Nouvelle alerte
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {alerts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <NotificationsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Aucune alerte de prix
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Créez votre première alerte pour être notifié quand le prix d'un vol baisse
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Créer une alerte
            </Button>
          </Box>
        ) : (
          <List>
            {alerts.map((alert, index) => {
              const status = getAlertStatus(alert);
              return (
                <React.Fragment key={alert.id}>
                  <ListItem sx={{ py: 2 }}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <LocationOnIcon color="primary" />
                          <Typography variant="h6">
                            {alert.route}
                          </Typography>
                          <Chip
                            icon={status.icon}
                            label={status.text}
                            color={status.color}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Départ: {formatDate(alert.departureDate)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Prix cible: {formatPrice(alert.targetPrice)} • Prix actuel: {formatPrice(alert.currentPrice)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Créée le {formatDate(alert.createdAt)}
                            {alert.triggeredAt && ` • Déclenchée le ${formatDate(alert.triggeredAt)}`}
                          </Typography>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          edge="end"
                          onClick={() => handleOpenDialog(alert)}
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          onClick={() => handleDelete(alert.id)}
                          size="small"
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < alerts.length - 1 && <Divider />}
                </React.Fragment>
              );
            })}
          </List>
        )}

        {/* Create/Edit Alert Dialog */}
        <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingAlert ? 'Modifier l\'alerte' : 'Nouvelle alerte de prix'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Route"
                  value={formData.route}
                  onChange={(e) => setFormData(prev => ({ ...prev, route: e.target.value }))}
                  placeholder="ex: CDG → JFK"
                  helperText="Format: Aéroport de départ → Aéroport d'arrivée"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Date de départ"
                  type="date"
                  value={formData.departureDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, departureDate: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Prix cible (€)"
                  type="number"
                  value={formData.targetPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetPrice: e.target.value }))}
                  helperText="Vous serez notifié quand le prix sera inférieur ou égal à ce montant"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Fréquence des notifications email</InputLabel>
                  <Select
                    value={formData.notificationPreferences.email.frequency}
                    label="Fréquence des notifications email"
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      notificationPreferences: {
                        ...prev.notificationPreferences,
                        email: {
                          ...prev.notificationPreferences.email,
                          frequency: e.target.value as 'immediate' | 'daily' | 'weekly'
                        }
                      }
                    }))}
                  >
                    <MenuItem value="immediate">Immédiat</MenuItem>
                    <MenuItem value="daily">Quotidien</MenuItem>
                    <MenuItem value="weekly">Hebdomadaire</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    />
                  }
                  label="Alerte active"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>
              Annuler
            </Button>
            <Button
              onClick={handleSave}
              variant="contained"
              disabled={!formData.route || !formData.departureDate || !formData.targetPrice}
            >
              {editingAlert ? 'Modifier' : 'Créer'}
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default PriceAlertManager;
