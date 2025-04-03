import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Typography,
  Box,
  Avatar,
  Chip,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  Person,
  AttachMoney,
  AccessTime,
  Diamond,
  Image as ImageIcon,
  Info
} from '@mui/icons-material';
import moment from 'moment';
import PropTypes from 'prop-types';

const BidTable = ({ bidHistory }) => {
  // Sort bids by createdAt in descending order (newest first)
  const sortedBids = [...bidHistory.data].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Get the highest bid amount
  const highestBid = Math.max(...bidHistory.data.map(bid => bid.bidAmount));

  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Table sx={{ minWidth: 650 }} aria-label="bid history table">
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
            <TableCell>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Diamond sx={{ mr: 1 }} />
                <Typography variant="subtitle2">Gem Details</Typography>
              </Box>
            </TableCell>
            <TableCell>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Person sx={{ mr: 1 }} />
                <Typography variant="subtitle2">Your Bid</Typography>
              </Box>
            </TableCell>
            <TableCell>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <AttachMoney sx={{ mr: 1 }} />
                <Typography variant="subtitle2">Bid Amount</Typography>
              </Box>
            </TableCell>
            <TableCell>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <AccessTime sx={{ mr: 1 }} />
                <Typography variant="subtitle2">Time</Typography>
              </Box>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2">Status</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2">Auction Status</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedBids.map((bid) => {
            const isWinningBid = bid.bidAmount === bid.auctionId.currentPrice;
            const isHighestBid = bid.bidAmount === highestBid;
            const auctionEnded = new Date(bid.auctionId.endTime) < new Date();
            
            return (
              <TableRow
                key={bid._id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { backgroundColor: "#fafafa" },
                }}
              >
                {/* Gem Details Column */}
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {bid.auctionId.gemId.images?.length > 0 ? (
                      <Avatar 
                        src={bid.auctionId.gemId.images[0]} 
                        sx={{ width: 40, height: 40, mr: 2 }}
                        variant="rounded"
                      >
                        <ImageIcon />
                      </Avatar>
                    ) : (
                      <Avatar sx={{ width: 40, height: 40, mr: 2 }}>
                        <Diamond />
                      </Avatar>
                    )}
                    <Box>
                      <Typography variant="body1" fontWeight={500}>
                        {bid.auctionId.gemId.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Auction ID: {bid.auctionId._id.slice(-6)}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                
                {/* Your Bid Column */}
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                      sx={{ width: 32, height: 32, mr: 2 }}
                    >
                      {bid.user.username.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography variant="body2">{bid.user.username}</Typography>
                  </Box>
                </TableCell>
                
                {/* Bid Amount Column */}
                <TableCell>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    ${bid.bidAmount.toFixed(2)}
                  </Typography>
                  {isHighestBid && (
                    <Typography variant="caption" color="success.main">
                      (Your highest bid)
                    </Typography>
                  )}
                </TableCell>
                
                {/* Time Column */}
                <TableCell>
                  <Typography variant="body2">
                    {moment(bid.createdAt).format("MMM D, YYYY h:mm A")}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ({moment(bid.createdAt).fromNow()})
                  </Typography>
                </TableCell>
                
                {/* Bid Status Column */}
                <TableCell>
                  <Chip
                    label={
                      isWinningBid ? "Winning" : 
                      auctionEnded ? "Completed" : "Outbid"
                    }
                    color={
                      isWinningBid ? "success" : 
                      auctionEnded ? "info" : "default"
                    }
                    size="small"
                  />
                  {!isWinningBid && !auctionEnded && (
                    <Tooltip title={`Current price: $${bid.auctionId.currentPrice.toFixed(2)}`}>
                      <IconButton size="small" sx={{ ml: 1 }}>
                        <Info fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
                
                {/* Auction Status Column */}
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Chip
                      label={auctionEnded ? "Ended" : "Active"}
                      color={auctionEnded ? "default" : "primary"}
                      size="small"
                    />
                    {!auctionEnded && (
                      <Typography variant="caption" sx={{ ml: 1 }}>
                        Ends {moment(bid.auctionId.endTime).fromNow()}
                      </Typography>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};


BidTable.propTypes = {
    bidHistory: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      currentPrice: PropTypes.number.isRequired,
      data: PropTypes.arrayOf(
        PropTypes.shape({
          _id: PropTypes.string.isRequired,
          bidAmount: PropTypes.number.isRequired,
          createdAt: PropTypes.string.isRequired,
          user: PropTypes.shape({
            _id: PropTypes.string.isRequired,
            username: PropTypes.string.isRequired,
            avatar: PropTypes.string,
          }).isRequired,
        })
      ).isRequired,
      gemId: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        images: PropTypes.arrayOf(PropTypes.string),
      }),
      merchantId: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
      }),
      priceStart: PropTypes.number,
      endTime: PropTypes.string,
      status: PropTypes.string,
      isDeleted: PropTypes.bool,
      startTime: PropTypes.string,
      createdAt: PropTypes.string,
      updatedAt: PropTypes.string,
    }),
  };

export default BidTable;