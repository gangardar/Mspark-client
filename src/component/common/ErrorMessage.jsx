import { 
  Box,
  Alert,
  Typography
} from '@mui/material';
import PropTypes from 'prop-types';

export const ErrorMessage = ({ message }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2,
      minHeight: 200,
      p: 2
    }}
  >
    <Alert severity="error" sx={{ width: '100%', maxWidth: 400 }}>
      <Typography variant="body1" component="div">
        {message || 'Failed to load data'}
      </Typography>
    </Alert>
  </Box>
);

ErrorMessage.propTypes = {
  message : PropTypes.string.isRequired
}