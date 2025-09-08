import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { theme } from './styles/theme';
import { NotificationProvider } from './components/NotificationSystem';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ResultsPage from './pages/ResultsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import NotificationPreferencesPage from './pages/NotificationPreferencesPage';
import TestComponents from './components/TestComponents';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationProvider>
        <Router>
          <Box 
            sx={{ 
              minHeight: '100vh',
              height: '100vh',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'background.default',
              overflow: 'hidden'
            }}
          >
            <Header />
            <Box 
              component="main" 
              sx={{ 
                flex: 1,
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/results" element={<ResultsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/notifications" element={<NotificationPreferencesPage />} />
                <Route path="/test" element={<TestComponents />} />
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/admin/settings" element={<AdminSettingsPage />} />
                <Route path="/admin/users" element={<AdminPage />} />
                <Route path="/admin/flights" element={<AdminPage />} />
                <Route path="/admin/notifications" element={<AdminPage />} />
              </Routes>
            </Box>
          </Box>
        </Router>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App; 