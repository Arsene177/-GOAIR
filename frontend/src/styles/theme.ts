import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2', // Bleu professionnel
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#dc004e', // Rouge moderne
      light: '#ff5983',
      dark: '#9a0036',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fafc', // Blanc cassé professionnel
      paper: '#ffffff', // Blanc pur
    },
    text: {
      primary: '#1a202c', // Noir doux
      secondary: '#4a5568', // Gris moyen
    },
    divider: '#e2e8f0', // Gris clair pour les bordures
    success: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
    },
    warning: {
      main: '#f57c00',
      light: '#ff9800',
      dark: '#ef6c00',
    },
    error: {
      main: '#d32f2f',
      light: '#f44336',
      dark: '#c62828',
    },
    info: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '12px 24px',
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 212, 170, 0.3)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 212, 170, 0.3)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            '& fieldset': {
              borderColor: '#e2e8f0',
            },
            '&:hover fieldset': {
              borderColor: '#1976d2',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#1976d2',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
  // Add custom animations
  '@keyframes float': {
    '0%, 100%': {
      transform: 'translateY(0px)',
    },
    '50%': {
      transform: 'translateY(-20px)',
    },
  },
  '@keyframes glow': {
    '0%': {
      textShadow: '0 0 20px rgba(30, 64, 175, 0.3)',
    },
    '100%': {
      textShadow: '0 0 30px rgba(30, 64, 175, 0.6), 0 0 40px rgba(220, 38, 38, 0.3)',
    },
  },
}); 