import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
} from '@mui/material';
import { Flight, Person, Logout, AdminPanelSettings, Notifications } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isAuthenticated = !!localStorage.getItem('accessToken');

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    handleClose();
    navigate('/');
  };

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar>
        <Box
          display="flex"
          alignItems="center"
          sx={{ cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          <Flight sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" component="div" sx={{ fontWeight: 700, color: '#1e293b' }}>
            GOAIR
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Box display="flex" alignItems="center" gap={2}>
          <Button
            onClick={() => navigate('/')}
            sx={{ fontWeight: 500, color: '#1e293b' }}
          >
            Rechercher
          </Button>
          
          <Button
            variant="text"
            onClick={() => navigate('/admin/login')}
            startIcon={<AdminPanelSettings />}
            sx={{ fontWeight: 500, color: '#1e293b' }}
          >
            Admin
          </Button>
          
          {isAuthenticated ? (
            <>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                sx={{ color: '#1e293b' }}
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                  <Person />
                </Avatar>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={() => { handleClose(); navigate('/profile'); }}>
                  Mon Profil
                </MenuItem>
                <MenuItem onClick={() => { handleClose(); navigate('/notifications'); }}>
                  <Notifications sx={{ mr: 1 }} />
                  Notifications
                </MenuItem>
                <MenuItem onClick={() => { handleClose(); navigate('/bookings'); }}>
                  Mes Réservations
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <Logout sx={{ mr: 1 }} />
                  Se déconnecter
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button
                variant="outlined"
                onClick={() => navigate('/login')}
                sx={{ fontWeight: 500, color: '#1e293b', borderColor: '#1e293b' }}
              >
                Se connecter
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate('/register')}
                sx={{ fontWeight: 500 }}
              >
                S'inscrire
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 