import { Box, Grid2, Typography } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const ProfileCard = () => {
  const{logout} = useContext(AuthContext);
  const decodedToken = jwtDecode(localStorage.getItem('token'));
  const handleLogout = () => {
    logout()
  }
  console.log(decodedToken);
  return (
    <Box sx={{ p: 0.5, border: '1px solid rgb(210, 29, 29)', borderRadius: 2, maxWidth: 300, maxHeight: 50 }}>
      <Grid2 container justifyItems='center' alignItems="center" spacing={2}>
        <Grid2 item>
          <Box
            sx={{
              maxWidth : '50px',
              maxHeight : '40px',
              borderRadius: '20%',
              overflow: 'hidden',
            }}
          >
            <img
              src="/src/resources/exampleProfile.jpeg"
              alt="Profile Picture"
              style={{ width: '100%', height: '100%', objectFit: 'fit' }}
            />
          </Box>
        </Grid2>
        <Grid2 item>
          <Typography variant="subtitle1" fontWeight="bold">
            {decodedToken.username}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {decodedToken.role}
          </Typography>
        </Grid2>
        <Grid2 item textAlign={'start'}>
          <Typography
            onClick={handleLogout}
            variant="body2"
            color="error"
            component="span"
            sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
          >
            logout
          </Typography>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default ProfileCard;