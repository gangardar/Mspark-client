import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
  Box, 
  Avatar,
  Tooltip,
  IconButton,
  Skeleton
} from '@mui/material';
import { Visibility, SyncProblem } from '@mui/icons-material';

const AccountsTable = ({ accounts, onView, isLoadingRates }) => {
  // Function to get chip color based on status
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'warning';
      case 'suspended': return 'error';
      default: return 'default';
    }
  };

  // Function to get currency icon
  const getCurrencyIcon = (symbol) => {
    const icons = {
      BTC: '₿',
      USDT: '$',
      ETH: 'Ξ',
      BNB: 'B'
    };
    return icons[symbol] || symbol;
  };

  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Accounts</Typography>
        {isLoadingRates && (
          <Chip 
            label="Loading exchange rates..." 
            color="info"
            size="small"
          />
        )}
      </Box>
      
      <Table sx={{ minWidth: 800 }} aria-label="accounts table">
        <TableHead>
          <TableRow>
            <TableCell>Currency</TableCell>
            <TableCell align="right">Balance</TableCell>
            <TableCell align="right">Exchange Rate (USD)</TableCell>
            <TableCell align="right">USD Value</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Wallet Address</TableCell>
            <TableCell>Created</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {accounts?.map((account) => (
            <TableRow
              key={account._id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              hover
            >
              <TableCell component="th" scope="row">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ 
                    bgcolor: 'primary.main', 
                    width: 32, 
                    height: 32,
                    mr: 2,
                    fontSize: '0.875rem'
                  }}>
                    {getCurrencyIcon(account.symbol)}
                  </Avatar>
                  <Box>
                    <Typography variant="body1">{account.title}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {account.symbol}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              
              <TableCell align="right">
                <Typography variant="body1" fontWeight="medium">
                  {account.balance}
                </Typography>
              </TableCell>
              
              {/* Exchange Rate Column */}
              <TableCell align="right">
                {isLoadingRates ? (
                  <Skeleton variant="text" width={60} />
                ) : account.converted?.rate ? (
                  <Typography variant="body2">
                    1 {account.symbol} = {account.converted.rate.toFixed(6)} USD
                  </Typography>
                ) : (
                  <Tooltip title={account.converted?.error || "Rate not available"}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                      <SyncProblem color="error" fontSize="small" sx={{ mr: 0.5 }} />
                      <Typography variant="body2" color="text.secondary">
                        N/A
                      </Typography>
                    </Box>
                  </Tooltip>
                )}
              </TableCell>
              
              {/* USD Value Column */}
              <TableCell align="right">
                {isLoadingRates ? (
                  <Skeleton variant="text" width={80} />
                ) : account.converted?.value ? (
                  <Typography variant="body1" fontWeight="medium">
                    ${parseFloat(account.converted.value).toFixed(2)}
                  </Typography>
                ) : (
                  <Tooltip title={account.converted?.error || "Conversion failed"}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                      <SyncProblem color="error" fontSize="small" sx={{ mr: 0.5 }} />
                      <Typography variant="body2" color="text.secondary">
                        N/A
                      </Typography>
                    </Box>
                  </Tooltip>
                )}
              </TableCell>
              
              <TableCell>
                <Chip 
                  label={account.status} 
                  color={getStatusColor(account.status)}
                  size="small"
                />
              </TableCell>
              
              <TableCell>
                <Tooltip title={account.walletAddress}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      maxWidth: 120, 
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {account.walletAddress}
                  </Typography>
                </Tooltip>
              </TableCell>
              
              <TableCell>
                {new Date(account.createdAt).toLocaleDateString()}
              </TableCell>
              
              <TableCell align="center">
                <Tooltip title="View Details">
                  <IconButton onClick={() => onView(account)}>
                    <Visibility fontSize="small" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

AccountsTable.propTypes = {
  accounts: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      symbol: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      balance: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      walletAddress: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      updatedAt: PropTypes.string.isRequired,
      converted: PropTypes.shape({
        currency: PropTypes.string,
        rate: PropTypes.number,
        value: PropTypes.any,
        error: PropTypes.string
      })
    })
  ).isRequired,
  onView: PropTypes.func.isRequired,
  isLoadingRates: PropTypes.bool
};

AccountsTable.defaultProps = {
  isLoadingRates: false
};

export default AccountsTable;