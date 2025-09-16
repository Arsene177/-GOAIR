import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, FormControl, InputLabel, Select, MenuItem, Alert } from '@mui/material';
import { PreferencesService } from '../services/preferences';
import type { UserPreference } from '../types/preferences';

const currencies = ['USD', 'EUR', 'XAF', 'GBP'];
const timezones = ['UTC', 'Africa/Douala', 'Europe/London', 'America/New_York'];

export const UserPreferences: React.FC = () => {
  const [preferences, setPreferences] = useState<UserPreference | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const data = await PreferencesService.getUserPreferences();
      setPreferences(data);
      setError(null);
    } catch (err) {
      setError('Failed to load preferences');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!preferences) return;

    try {
      const updated = await PreferencesService.updatePreferences({
        timezone: preferences.timezone,
        currency: preferences.currency,
        default_home_airport: preferences.default_home_airport,
        preferred_notification_time_start: preferences.preferred_notification_time_start,
        preferred_notification_time_end: preferences.preferred_notification_time_end,
      });
      setPreferences(updated);
      setSuccess('Preferences updated successfully');
      setError(null);
    } catch (err) {
      setError('Failed to update preferences');
      setSuccess(null);
      console.error(err);
    }
  };

  if (loading) return <Box>Loading preferences...</Box>;

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <h2>User Preferences</h2>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Currency</InputLabel>
        <Select
          value={preferences?.currency || 'USD'}
          label="Currency"
          onChange={(e) => setPreferences(prev => prev ? {...prev, currency: e.target.value} : null)}
        >
          {currencies.map(curr => (
            <MenuItem key={curr} value={curr}>{curr}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Timezone</InputLabel>
        <Select
          value={preferences?.timezone || 'UTC'}
          label="Timezone"
          onChange={(e) => setPreferences(prev => prev ? {...prev, timezone: e.target.value} : null)}
        >
          {timezones.map(tz => (
            <MenuItem key={tz} value={tz}>{tz}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        fullWidth
        sx={{ mb: 2 }}
        label="Default Home Airport"
        placeholder="e.g., DLA"
        value={preferences?.default_home_airport || ''}
        onChange={(e) => setPreferences(prev => prev ? {...prev, default_home_airport: e.target.value} : null)}
      />

      <TextField
        fullWidth
        sx={{ mb: 2 }}
        label="Preferred Notification Time Start"
        type="time"
        value={preferences?.preferred_notification_time_start || ''}
        onChange={(e) => setPreferences(prev => prev ? {...prev, preferred_notification_time_start: e.target.value} : null)}
        InputLabelProps={{ shrink: true }}
      />

      <TextField
        fullWidth
        sx={{ mb: 2 }}
        label="Preferred Notification Time End"
        type="time"
        value={preferences?.preferred_notification_time_end || ''}
        onChange={(e) => setPreferences(prev => prev ? {...prev, preferred_notification_time_end: e.target.value} : null)}
        InputLabelProps={{ shrink: true }}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
      >
        Save Preferences
      </Button>
    </Box>
  );
};