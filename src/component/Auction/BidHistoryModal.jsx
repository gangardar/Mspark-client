import {
  Modal,
  Paper,
  Box,
  Typography,
  IconButton,
  Chip,
  Stack,
  Divider
} from '@mui/material';
import {
  Close as CloseIcon,
  EmojiEvents as TrophyIcon,
  AttachMoney as MoneyIcon,
  Schedule as TimeIcon
} from '@mui/icons-material';
import PropTypes from 'prop-types';
import moment from 'moment';
import BidHistory from './BidHistory';

const BidHistoryModal = ({
  open,
  onClose,
  bids,
  currentPrice,
  auctionEndTime,
  startingPrice
}) => {
  const hasBids = bids?.length > 0;
  const winningBid = hasBids ? bids.reduce((prev, current) =>
    (prev.bidAmount > current.bidAmount) ? prev : current
  ) : null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="bid-history-modal"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper sx={{
        width: { xs: '90%', sm: '60%', md: '500px' },
        maxHeight: '80vh',
        overflow: 'auto',
        position: 'relative',
        p: 3
      }}>
        {/* Modal Header */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3
        }}>
          <Typography variant="h5" component="h2">
            Bid History
          </Typography>
          <IconButton onClick={onClose} sx={{ color: 'text.secondary' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Auction Summary */}
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <Chip
            icon={<MoneyIcon fontSize="small" />}
            label={`Current: $${currentPrice?.toLocaleString() || startingPrice?.toLocaleString()}`}
            color="primary"
            variant="outlined"
            size="small"
          />
          <Chip
            icon={<TimeIcon fontSize="small" />}
            label={`Ends: ${moment(auctionEndTime).fromNow()}`}
            variant="outlined"
            size="small"
          />
          {winningBid && (
            <Chip
              icon={<TrophyIcon fontSize="small" />}
              label={`Winning: $${winningBid?.bidAmount?.toLocaleString()}`}
              color="success"
              variant="outlined"
              size="small"
            />
          )}
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {/* Your existing BidHistory component */}
        <BidHistory bids={bids} />
      </Paper>
    </Modal>
  );
};

BidHistoryModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  bids: PropTypes.array,
  currentPrice: PropTypes.number,
  startingPrice: PropTypes.number,
  auctionEndTime: PropTypes.string
};

export default BidHistoryModal;