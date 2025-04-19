import PropTypes from 'prop-types';
import { 
  Card, 
  CardContent, 
  Typography, 
  Chip, 
  Stack,
  Divider,
  Box,
  Alert
} from '@mui/material';
import { Info as InfoIcon, Paid as PaidIcon } from '@mui/icons-material';

function MsparkInfoCard({ mspark }) {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        {/* Header Section */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" component="div">
            {mspark.name}
          </Typography>
          <Chip 
            label={mspark.type} 
            color={mspark.type === 'primary' ? 'primary' : 'secondary'} 
            size="small"
          />
        </Stack>
        
        <Divider sx={{ my: 2 }} />
        
        {/* Basic Info Section */}
        <Stack spacing={2}>
          <Stack direction="row" spacing={4}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Created Date
              </Typography>
              <Typography variant="body1">
                {new Date(mspark.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Last Updated
              </Typography>
              <Typography variant="body1">
                {new Date(mspark.updatedAt).toLocaleDateString()}
              </Typography>
            </Box>
          </Stack>
          
          {/* Fees Section */}
          <Stack direction="row" spacing={4}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Platform Fee
              </Typography>
              <Typography variant="body1">
                {(parseFloat(mspark.platformFee) * 100).toFixed(2)}%
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Verification Fee
              </Typography>
              <Typography variant="body1">
                {(parseFloat(mspark.verificationFee) * 100).toFixed(2)}%
              </Typography>
            </Box>
          </Stack>
          
          {/* Total Value Section */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Total Assets Value
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              <PaidIcon color="primary" />
              <Typography variant="h6">
                {mspark.totalAmount.value} {mspark.totalAmount.currency}
              </Typography>
              {parseFloat(mspark.totalAmount.value) === 0 && (
                <Chip 
                  label="No conversion data" 
                  color="warning" 
                  size="small" 
                  icon={<InfoIcon />}
                />
              )}
            </Stack>
          </Box>
          
          {/* Address Section */}
          {mspark.address && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Registered Address
              </Typography>
              <Typography variant="body1">
                {[
                  mspark.address.houseNo,
                  mspark.address.street,
                  mspark.address.city,
                  mspark.address.state,
                  mspark.address.country,
                  mspark.address.postalcode
                ].filter(Boolean).join(', ')}
              </Typography>
            </Box>
          )}
          
          {/* Conversion Errors */}
          {mspark.accounts.some(acc => acc.converted.error) && (
            <Alert severity="warning" sx={{ mt: 1 }}>
              Some currency conversions failed to load. Values may be incomplete.
            </Alert>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

// Prop Validation
MsparkInfoCard.propTypes = {
  mspark: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['primary', 'secondary']).isRequired,
    platformFee: PropTypes.string.isRequired,
    verificationFee: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
    totalAmount: PropTypes.shape({
      currency: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    }).isRequired,
    address: PropTypes.shape({
      country: PropTypes.string,
      state: PropTypes.string,
      city: PropTypes.string,
      street: PropTypes.string,
      houseNo: PropTypes.string,
      postalcode: PropTypes.string
    }),
    accounts: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        symbol: PropTypes.string.isRequired,
        balance: PropTypes.string.isRequired,
        converted: PropTypes.shape({
          currency: PropTypes.string,
          rate: PropTypes.number,
          value: PropTypes.any,
          error: PropTypes.string
        })
      })
    ).isRequired
  }).isRequired
};

export default MsparkInfoCard;