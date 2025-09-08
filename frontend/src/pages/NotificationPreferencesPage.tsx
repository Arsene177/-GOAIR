import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Tabs,
  Tab,
  Alert,
  Button,
  useTheme
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Email as EmailIcon,
  Smartphone as SmartphoneIcon,
  Save as SaveIcon,
  AttachMoney as PriceCheckIcon
} from '@mui/icons-material';
import EmailNotificationPreferences from '../components/EmailNotificationPreferences';
import PushNotificationPreferences from '../components/PushNotificationPreferences';
import PriceAlertManager from '../components/PriceAlertManager';
import { NotificationPreferences } from '../types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`notification-tabpanel-${index}`}
      aria-labelledby={`notification-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const NotificationPreferencesPage: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email: {
      enabled: false,
      address: '',
      frequency: 'immediate',
      types: []
    },
    push: {
      enabled: false,
      frequency: 'immediate',
      types: []
    },
    sms: {
      enabled: false,
      number: '',
      frequency: 'immediate',
      types: []
    }
  });
  const [currentUserId] = useState('user-123'); // Mock user ID
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      setLoading(true);
      // Mock loading - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - replace with actual API response
      const mockPreferences: NotificationPreferences = {
        email: {
          enabled: true,
          address: 'user@example.com',
          frequency: 'daily',
          types: ['price_alerts', 'price_predictions']
        },
        push: {
          enabled: false,
          frequency: 'immediate',
          types: ['price_alerts']
        },
        sms: {
          enabled: false,
          number: '',
          frequency: 'immediate',
          types: []
        }
      };
      
      setPreferences(mockPreferences);
    } catch (err) {
      setError('Erreur lors du chargement des préférences');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePreferences = async (newPreferences: NotificationPreferences) => {
    try {
      setError(null);
      // Mock save - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPreferences(newPreferences);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Erreur lors de la sauvegarde des préférences');
      throw err;
    }
  };

  const handleTestEmail = async (email: string) => {
    try {
      // Mock email test - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Test email sent to:', email);
    } catch (err) {
      throw new Error('Erreur lors de l\'envoi de l\'email de test');
    }
  };

  const handleRequestPermission = async (): Promise<NotificationPermission> => {
    if (!('Notification' in window)) {
      throw new Error('Les notifications ne sont pas supportées par ce navigateur');
    }
    
    const permission = await Notification.requestPermission();
    return permission;
  };

  const handleTestNotification = async () => {
    if (Notification.permission === 'granted') {
      new Notification('Test de notification', {
        body: 'Ceci est une notification de test de GoAir',
        icon: '/vite.svg',
        tag: 'test-notification'
      });
    } else {
      throw new Error('Autorisation de notification requise');
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSaveAll = async () => {
    try {
      setError(null);
      await handleSavePreferences(preferences);
    } catch (err) {
      // Error already handled in handleSavePreferences
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <NotificationsIcon color="primary" />
          Préférences de notifications
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Configurez vos préférences de notification pour recevoir des alertes personnalisées sur les prix des vols et autres informations importantes.
        </Typography>
      </Box>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Toutes les préférences ont été sauvegardées avec succès !
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="notification preferences tabs">
            <Tab
              icon={<EmailIcon />}
              label="Email"
              id="notification-tab-0"
              aria-controls="notification-tabpanel-0"
            />
            <Tab
              icon={<SmartphoneIcon />}
              label="Notifications Push"
              id="notification-tab-1"
              aria-controls="notification-tabpanel-1"
            />
            <Tab
              icon={<PriceCheckIcon />}
              label="Alertes de Prix"
              id="notification-tab-2"
              aria-controls="notification-tabpanel-2"
            />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <EmailNotificationPreferences
            preferences={preferences}
            onSave={handleSavePreferences}
            onTestEmail={handleTestEmail}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <PushNotificationPreferences
            preferences={preferences}
            onSave={handleSavePreferences}
            onRequestPermission={handleRequestPermission}
            onTestNotification={handleTestNotification}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <PriceAlertManager
            userId={currentUserId}
            onSaveAlert={async (alert) => {
              console.log('Saving alert:', alert);
              // Mock save - replace with actual API call
            }}
            onUpdateAlert={async (alert) => {
              console.log('Updating alert:', alert);
              // Mock update - replace with actual API call
            }}
            onDeleteAlert={async (alertId) => {
              console.log('Deleting alert:', alertId);
              // Mock delete - replace with actual API call
            }}
          />
        </TabPanel>
      </Paper>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<SaveIcon />}
          onClick={handleSaveAll}
          disabled={loading}
        >
          Sauvegarder toutes les préférences
        </Button>
      </Box>
    </Container>
  );
};

export default NotificationPreferencesPage;
