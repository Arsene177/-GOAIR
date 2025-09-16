import React from 'react';
import { Container, Paper } from '@mui/material';
import { UserPreferences } from '../components/UserPreferences';

export const SettingsPage: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Paper sx={{ mt: 4, p: 3 }}>
        <UserPreferences />
      </Paper>
    </Container>
  );
};