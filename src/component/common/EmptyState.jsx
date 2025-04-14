import { Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';

export const EmptyState = ({ title, description, icon }) => (
  <Box 
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 300,
      textAlign: 'center',
      p: 3
    }}
  >
    {icon && (
      <Box sx={{ fontSize: 60, mb: 2 }}>
        {icon}
      </Box>
    )}
    <Typography variant="h6" gutterBottom>
      {title}
    </Typography>
    <Typography variant="body1" color="text.secondary">
      {description}
    </Typography>
  </Box>
);

EmptyState.propTypes = {
    title : PropTypes.string,
    description : PropTypes.string,
    icon : PropTypes.any
}