import { useNavigate } from 'react-router-dom';
import { 
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Grid,
  useTheme
} from '@mui/material';
import { Lock as LockIcon } from '@mui/icons-material';

const Unauthorized = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  const handleGoHome = () => {
    navigate('/'); // Navigate to home page
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <LockIcon 
                sx={{ 
                  fontSize: 150, 
                  color: theme.palette.error.main,
                  mb: 2 
                }} 
              />
              <Typography 
                variant="h3" 
                component="h1" 
                gutterBottom
                sx={{ fontWeight: 'bold' }}
              >
                Access Denied
              </Typography>
              <Typography variant="h6" gutterBottom>
                You don&apos;t have permission to access this page.
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Please contact your administrator if you believe this is an error.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  variant="contained" 
                  onClick={handleGoBack}
                  sx={{ textTransform: 'none' }}
                >
                  Go Back
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={handleGoHome}
                  sx={{ textTransform: 'none' }}
                >
                  Go to Home
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/images/unauthorized.svg" // Replace with your image path
                alt="Unauthorized access"
                sx={{ 
                  width: '100%', 
                  height: 'auto',
                  maxHeight: 300 
                }}
              />
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default Unauthorized;