import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Divider,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  SystemUpdate as SystemUpdateIcon
} from '@mui/icons-material';
import AdminLayout from '../components/AdminLayout';

const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    emailNotifications: true,
    smsNotifications: false,
    autoBackup: true,
    debugMode: false,
    maxUsers: 1000,
    sessionTimeout: 30,
    currency: 'EUR',
    timezone: 'Europe/Paris'
  });

  const [saved, setSaved] = useState(false);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    // Save settings logic here
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    // Reset to default settings
    setSettings({
      maintenanceMode: false,
      emailNotifications: true,
      smsNotifications: false,
      autoBackup: true,
      debugMode: false,
      maxUsers: 1000,
      sessionTimeout: 30,
      currency: 'EUR',
      timezone: 'Europe/Paris'
    });
  };

  return (
    <AdminLayout>
      <Box sx={{ py: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <SettingsIcon color="primary" />
          System Settings
        </Typography>

        {saved && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Settings saved successfully!
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* General Settings */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                title="General Settings"
                avatar={<SettingsIcon color="primary" />}
              />
              <CardContent>
                <Box sx={{ mb: 3 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.maintenanceMode}
                        onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
                      />
                    }
                    label="Maintenance Mode"
                  />
                  <Typography variant="caption" display="block" color="textSecondary">
                    Enable maintenance mode to restrict access to the system
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.debugMode}
                        onChange={(e) => handleSettingChange('debugMode', e.target.checked)}
                      />
                    }
                    label="Debug Mode"
                  />
                  <Typography variant="caption" display="block" color="textSecondary">
                    Enable debug logging for development purposes
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    label="Maximum Users"
                    type="number"
                    value={settings.maxUsers}
                    onChange={(e) => handleSettingChange('maxUsers', parseInt(e.target.value))}
                    helperText="Maximum number of users allowed in the system"
                  />
                </Box>

                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    label="Session Timeout (minutes)"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                    helperText="User session timeout in minutes"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Notification Settings */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                title="Notification Settings"
                avatar={<NotificationsIcon color="primary" />}
              />
              <CardContent>
                <Box sx={{ mb: 3 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.emailNotifications}
                        onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                      />
                    }
                    label="Email Notifications"
                  />
                  <Typography variant="caption" display="block" color="textSecondary">
                    Send email notifications for system events
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.smsNotifications}
                        onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
                      />
                    }
                    label="SMS Notifications"
                  />
                  <Typography variant="caption" display="block" color="textSecondary">
                    Send SMS notifications for critical alerts
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.autoBackup}
                        onChange={(e) => handleSettingChange('autoBackup', e.target.checked)}
                      />
                    }
                    label="Automatic Backup"
                  />
                  <Typography variant="caption" display="block" color="textSecondary">
                    Automatically backup system data daily
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* System Configuration */}
          <Grid item xs={12}>
            <Card>
              <CardHeader
                title="System Configuration"
                avatar={<SystemUpdateIcon color="primary" />}
              />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Currency</InputLabel>
                      <Select
                        value={settings.currency}
                        label="Currency"
                        onChange={(e) => handleSettingChange('currency', e.target.value)}
                      >
                        <MenuItem value="EUR">EUR (Euro)</MenuItem>
                        <MenuItem value="USD">USD (US Dollar)</MenuItem>
                        <MenuItem value="GBP">GBP (British Pound)</MenuItem>
                        <MenuItem value="XOF">XOF (CFA Franc)</MenuItem>
                        <MenuItem value="JPY">JPY (Japanese Yen)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Timezone</InputLabel>
                      <Select
                        value={settings.timezone}
                        label="Timezone"
                        onChange={(e) => handleSettingChange('timezone', e.target.value)}
                      >
                        <MenuItem value="Europe/Paris">Europe/Paris</MenuItem>
                        <MenuItem value="America/New_York">America/New_York</MenuItem>
                        <MenuItem value="Asia/Tokyo">Asia/Tokyo</MenuItem>
                        <MenuItem value="UTC">UTC</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Security Settings */}
          <Grid item xs={12}>
            <Card>
              <CardHeader
                title="Security Settings"
                avatar={<SecurityIcon color="primary" />}
              />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>Password Policy</Typography>
                    <Box sx={{ mb: 2 }}>
                      <Chip label="Minimum 8 characters" color="primary" sx={{ mr: 1, mb: 1 }} />
                      <Chip label="Uppercase required" color="primary" sx={{ mr: 1, mb: 1 }} />
                      <Chip label="Numbers required" color="primary" sx={{ mr: 1, mb: 1 }} />
                      <Chip label="Special characters" color="primary" sx={{ mr: 1, mb: 1 }} />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>Session Security</Typography>
                    <Box sx={{ mb: 2 }}>
                      <Chip label="HTTPS only" color="success" sx={{ mr: 1, mb: 1 }} />
                      <Chip label="CSRF protection" color="success" sx={{ mr: 1, mb: 1 }} />
                      <Chip label="Rate limiting" color="success" sx={{ mr: 1, mb: 1 }} />
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={handleReset}>
            Reset to Defaults
          </Button>
          <Button variant="contained" onClick={handleSave}>
            Save Settings
          </Button>
        </Box>
      </Box>
    </AdminLayout>
  );
};

export default AdminSettingsPage;
