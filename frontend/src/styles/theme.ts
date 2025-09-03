import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00d4aa', // Vert émeraude vif
      light: '#33ddbb',
      dark: '#009480',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ff6b6b', // Corail
      light: '#ff8a8a',
      dark: '#e55555',
      contrastText: '#ffffff',
    },
    background: {
      default: '#0f1419', // Noir profond
      paper: '#1a1f2e', // Gris très sombre
    },
    text: {
      primary: '#ffffff', // Blanc
      secondary: '#a0a0a0', // Gris clair
    },
    divider: '#2a2f3e', // Gris moyen pour les bordures
    success: {
      main: '#00d4aa',
      light: '#33ddbb',
      dark: '#009480',
    },
    warning: {
      main: '#ffa726',
      light: '#ffb74d',
      dark: '#f57c00',
    },
    error: {
      main: '#ff6b6b',
      light: '#ff8a8a',
      dark: '#e55555',
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
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          border: '1px solid #2a2f3e',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            '& fieldset': {
              borderColor: '#2a2f3e',
            },
            '&:hover fieldset': {
              borderColor: '#00d4aa',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#00d4aa',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(15, 20, 25, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid #2a2f3e',
        },
      },
    },
  },
}); 