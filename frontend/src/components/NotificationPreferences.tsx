import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Switch, FormControlLabel, Box } from '@mui/material';
import { getNotificationPermissionStatus, requestNotificationPermission, subscribeToNotifications, unsubscribeFromNotifications } from '../services/notification-service';

const NotificationPreferences: React.FC = () => {
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'default' | 'unsupported'>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    checkNotificationStatus();
  }, []);

  const checkNotificationStatus = async () => {
    const status = await getNotificationPermissionStatus();
    setPermissionStatus(status);
  };

  const handleToggleNotifications = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    
    try {
      if (checked) {
        const permission = await requestNotificationPermission();
        if (permission === 'granted') {
          await subscribeToNotifications();
          setIsSubscribed(true);
        }
      } else {
        await unsubscribeFromNotifications();
        setIsSubscribed(false);
      }
    } catch (error) {
      console.error('Error managing notifications:', error);
      // Revert toggle if failed
      setIsSubscribed(!checked);
    }
  };

  if (permissionStatus === 'unsupported') {
    return (
      <Card>
        <CardContent>
          <Typography color="error">
            Push notifications are not supported in your browser.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Notification Settings
        </Typography>
        <Box mt={2}>
          <FormControlLabel
            control={
              <Switch
                checked={isSubscribed}
                onChange={handleToggleNotifications}
                disabled={permissionStatus === 'denied'}
              />
            }
            label="Enable Push Notifications"
          />
          {permissionStatus === 'denied' && (
            <Typography color="error" variant="body2" mt={1}>
              Notifications are blocked. Please update your browser settings to enable notifications.
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default NotificationPreferences;