import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
  Box
} from '@mui/material';
import PropTypes from 'prop-types';

const EnhancedTableSkeleton = ({ rows = 5, columns = 5 }) => {
  // Vary the skeleton width for more natural look
  const getRandomWidth = () => {
    const min = 60;
    const max = 100;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {Array.from({ length: columns }).map((_, index) => (
              <TableCell key={index}>
                <Skeleton 
                  variant="text" 
                  animation="wave" 
                  width={`${getRandomWidth()}%`}
                  height={30}
                />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <TableCell key={colIndex}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {colIndex === 0 && (
                      <Skeleton 
                        variant="circular" 
                        width={40} 
                        height={40} 
                        sx={{ mr: 2 }} 
                      />
                    )}
                    <Skeleton 
                      variant="text" 
                      animation="wave" 
                      width={`${getRandomWidth()}%`}
                    />
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

EnhancedTableSkeleton.propTypes = {
    rows : PropTypes.number,
    columns : PropTypes.number
}

export default EnhancedTableSkeleton;