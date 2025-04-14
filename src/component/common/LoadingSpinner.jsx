import { 
  Box,
  CircularProgress,
  Typography
} from '@mui/material';
import PropTypes from 'prop-types';

export const LoadingSpinner = ({message}) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2,
      minHeight: 200
    }}
  >
    <CircularProgress color="primary" />
    <Typography variant="body1" color="text.secondary">
      {message}
    </Typography>
  </Box>
);

LoadingSpinner.propTypes = {
    message : PropTypes.string.isRequired
}