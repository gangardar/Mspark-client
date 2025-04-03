import { 
  Grid2, 
  Box, 
  Skeleton, 
  Container, 
  Divider
} from '@mui/material';
import PropTypes from 'prop-types';

const AuctionSkeleton = ({ count = 6 }) => {
  return (
    <Container>
      <Grid2 container spacing={3} justifyContent={'center'}>
        {Array.from({ length: count }).map((_, index) => (
          <Grid2 item xs={12} sm={6} md={4} key={index}>
            <Box sx={{ height: '100%' }}>
              {/* Image Skeleton */}
              <Skeleton 
                variant="rectangular" 
                width="100%" 
                height={200} 
                sx={{ mb: 2 }} 
              />
              
              {/* Content Skeleton */}
              <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Skeleton variant="text" width="60%" height={32} />
                  <Skeleton variant="text" width="20%" height={24} />
                </Box>
                
                <Skeleton variant="text" width="80%" height={24} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="40%" height={20} sx={{ mb: 2 }} />
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ mb: 2 }}>
                  <Skeleton variant="text" width="70%" height={20} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="70%" height={20} />
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Skeleton variant="circular" width={20} height={20} sx={{ mr: 1 }} />
                  <Skeleton variant="text" width="50%" height={20} />
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Skeleton variant="rounded" width={80} height={24} />
                  <Skeleton variant="text" width={40} height={20} />
                </Box>
              </Box>
              
              {/* Button Skeleton */}
              <Box sx={{ p: 2 }}>
                <Skeleton variant="rounded" width="100%" height={40} />
              </Box>
            </Box>
          </Grid2>
        ))}
      </Grid2>
    </Container>
  );
};

AuctionSkeleton.propTypes = {
    count: PropTypes.number
  };
    

export default AuctionSkeleton;