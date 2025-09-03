import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  Snackbar,
  Alert,
  AlertTitle,
  Box,
  IconButton,
  Collapse,
  Paper,
  Typography,
  Button,
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Notifications as NotificationIcon,
} from '@mui/icons-material';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  timestamp: Date;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto-remove after duration
    if (notification.duration !== 0) {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, notification.duration || 5000);
    }
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      removeNotification,
      clearAllNotifications,
    }}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification, clearAllNotifications } = useNotifications();

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <SuccessIcon />;
      case 'error':
        return <ErrorIcon />;
      case 'warning':
        return <WarningIcon />;
      case 'info':
        return <InfoIcon />;
      default:
        return <NotificationIcon />;
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'info';
    }
  };

  if (notifications.length === 0) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 9999,
        maxWidth: 400,
        width: '100%',
      }}
    >
      {notifications.map((notification, index) => (
        <Collapse
          key={notification.id}
          in={true}
          timeout={300}
          sx={{ mb: 1 }}
        >
          <Paper
            elevation={6}
            sx={{
              p: 2,
              borderLeft: 4,
              borderColor: `${getNotificationColor(notification.type)}.main`,
              backgroundColor: 'background.paper',
              borderRadius: 2,
            }}
          >
            <Box display="flex" alignItems="flex-start" gap={1}>
              <Box
                sx={{
                  color: `${getNotificationColor(notification.type)}.main`,
                  mt: 0.5,
                }}
              >
                {getNotificationIcon(notification.type)}
              </Box>
              
              <Box flex={1} minWidth={0}>
                <Typography variant="subtitle2" fontWeight="medium" gutterBottom>
                  {notification.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {notification.message}
                </Typography>
                
                {notification.action && (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={notification.action.onClick}
                    sx={{ mr: 1 }}
                  >
                    {notification.action.label}
                  </Button>
                )}
                
                <Typography variant="caption" color="text.disabled">
                  {notification.timestamp.toLocaleTimeString()}
                </Typography>
              </Box>
              
              <IconButton
                size="small"
                onClick={() => removeNotification(notification.id)}
                sx={{ color: 'text.secondary' }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </Paper>
        </Collapse>
      ))}
      
      {notifications.length > 1 && (
        <Box display="flex" justifyContent="flex-end" mt={1}>
          <Button
            size="small"
            variant="outlined"
            onClick={clearAllNotifications}
            startIcon={<CloseIcon />}
          >
            Effacer tout
          </Button>
        </Box>
      )}
    </Box>
  );
};

// Composant Snackbar pour les notifications simples
export const NotificationSnackbar: React.FC<{
  open: boolean;
  message: string;
  type: NotificationType;
  onClose: () => void;
  duration?: number;
}> = ({ open, message, type, onClose, duration = 5000 }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        onClose={onClose}
        severity={type}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

// Hooks utilitaires pour des notifications rapides
export const useQuickNotifications = () => {
  const { addNotification } = useNotifications();

  const showSuccess = useCallback((title: string, message: string) => {
    addNotification({ type: 'success', title, message });
  }, [addNotification]);

  const showError = useCallback((title: string, message: string) => {
    addNotification({ type: 'error', title, message });
  }, [addNotification]);

  const showWarning = useCallback((title: string, message: string) => {
    addNotification({ type: 'warning', title, message });
  }, [addNotification]);

  const showInfo = useCallback((title: string, message: string) => {
    addNotification({ type: 'info', title, message });
  }, [addNotification]);

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}; 