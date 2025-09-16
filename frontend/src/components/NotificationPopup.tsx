import { Alert, Snackbar } from '@mui/material';
import React from 'react';

interface NotificationPopupProps {
  open: boolean;
  message: string;
  severity?: 'success' | 'info' | 'warning' | 'error';
  autoHideDuration?: number;
  onClose: () => void;
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({
  open,
  message,
  severity = 'info',
  autoHideDuration = 6000,
  onClose
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default NotificationPopup;