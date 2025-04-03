import React from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  Avatar, 
  Typography,
  Divider,
  Box
} from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';
import PropTypes from 'prop-types';
import moment from 'moment';

const BidHistory = ({ bids }) => {
  if (!bids || bids.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          No bids yet
        </Typography>
      </Box>
    );
  }

  return (
    <List>
      {bids.map((bid, index) => (
        <React.Fragment key={bid._id}>
          <ListItem alignItems="flex-start">
            <Avatar sx={{ mr: 2 }}>
              <PersonIcon />
            </Avatar>
            <ListItemText
              primary={`$${bid.bidAmount}`}
              secondary={
                <>
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    {bid.user.username}
                  </Typography>
                  {` — ${moment(bid.createdAt).format('MMMM Do YYYY, h:mm a')}`}
                </>
              }
            />
          </ListItem>
          {index < bids.length - 1 && <Divider variant="inset" component="li" />}
        </React.Fragment>
      ))}
    </List>
  );
};

BidHistory.propTypes = {
  bids: PropTypes.arrayOf(
    PropTypes.shape({
      bidAmount: PropTypes.number.isRequired,
      user: PropTypes.shape({
        username: PropTypes.string.isRequired,
      }).isRequired,
      _id: PropTypes.string.isRequired,
      createdAt : PropTypes.string.isRequired
    })
  ),
};

export default BidHistory;