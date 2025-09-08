import React from 'react';
import { Box, Button, Typography, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const TestComponents: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Test Components
      </Typography>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Navigation Tests
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              onClick={() => navigate('/notifications')}
            >
              Go to Notifications Page
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/')}
            >
              Go to Homepage
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/results')}
            >
              Go to Results Page
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Component Tests
          </Typography>
          <Typography variant="body2" color="text.secondary">
            If you can see this page, the routing is working. Try the buttons above to test navigation.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TestComponents;
