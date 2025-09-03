import React from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { useQuickNotifications } from './NotificationSystem';

const NotificationDemo: React.FC = () => {
  const { showSuccess, showError, showWarning, showInfo } = useQuickNotifications();

  const handleTestSuccess = () => {
    showSuccess('Opération réussie !', 'Votre action a été effectuée avec succès.');
  };

  const handleTestError = () => {
    showError('Erreur détectée', 'Une erreur est survenue lors de l\'opération.');
  };

  const handleTestWarning = () => {
    showWarning('Attention', 'Cette action peut avoir des conséquences importantes.');
  };

  const handleTestInfo = () => {
    showInfo('Information', 'Voici une information importante pour vous.');
  };

  const handleTestMultiple = () => {
    showInfo('Démarrage', 'Début de l\'opération...');
    setTimeout(() => showSuccess('Étape 1', 'Première étape terminée'), 1000);
    setTimeout(() => showWarning('Étape 2', 'Attention à l\'étape suivante'), 2000);
    setTimeout(() => showSuccess('Terminé', 'Toutes les étapes sont terminées !'), 3000);
  };

  return (
    <Paper sx={{ p: 3, m: 2, maxWidth: 600 }}>
      <Typography variant="h6" gutterBottom>
        🧪 Démonstration des Notifications
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Testez les différents types de notifications disponibles dans l'application.
      </Typography>
      
      <Box display="flex" flexWrap="wrap" gap={2}>
        <Button
          variant="contained"
          color="success"
          onClick={handleTestSuccess}
          size="small"
        >
          ✅ Succès
        </Button>
        
        <Button
          variant="contained"
          color="error"
          onClick={handleTestError}
          size="small"
        >
          ❌ Erreur
        </Button>
        
        <Button
          variant="contained"
          color="warning"
          onClick={handleTestWarning}
          size="small"
        >
          ⚠️ Avertissement
        </Button>
        
        <Button
          variant="contained"
          color="info"
          onClick={handleTestInfo}
          size="small"
        >
          ℹ️ Information
        </Button>
        
        <Button
          variant="outlined"
          onClick={handleTestMultiple}
          size="small"
        >
          🔄 Séquentiel
        </Button>
      </Box>
    </Paper>
  );
};

export default NotificationDemo; 