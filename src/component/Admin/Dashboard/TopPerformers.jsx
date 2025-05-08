import { Card, CardHeader, List, ListItem, ListItemAvatar, Avatar, ListItemText, Divider } from '@mui/material';
import useAdminUser from '../../../react-query/services/hooks/admin/dashboard/useAdminUser';
import { ErrorMessage } from '../../common/ErrorMessage';
import { useEffect, useState } from 'react';
import { LoadingSpinner } from '../../common/LoadingSpinner';

export default function TopPerformers() {
  const [data, setData] = useState();
  const { data: fetchUser, isLoading, isError, error } = useAdminUser();

  useEffect(() => {
      setData(fetchUser?.data);
    }, [fetchUser]);

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorMessage message={error?.resonse?.data?.message || 'Something Went Wrong!'}/>

  return (
    <Card>
      <CardHeader 
        title="Top Performers" 
        subheader="This Month" 
      />
      <Divider />
      <List>
        <ListItem>
          <ListItemText primary="Top Bidders" secondary="By Total Spend" />
        </ListItem>
        {data?.topBidders.map((bidder, index) => (
          <ListItem key={bidder._id}>
            <ListItemAvatar>
              <Avatar>{index + 1}</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={bidder.username}
              secondary={`$${bidder.totalAmount.toLocaleString()} (${bidder.totalBids} bids)`}
            />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem>
          <ListItemText primary="Top Merchants" secondary="By Sales Volume" />
        </ListItem>
        {data?.topMerchants.map((merchant, index) => (
          <ListItem key={merchant._id}>
            <ListItemAvatar>
              <Avatar>{index + 1}</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={merchant.username}
              secondary={`$${merchant.totalRevenue.toLocaleString()} (${merchant.totalSales} sales)`}
            />
          </ListItem>
        ))}
      </List>
    </Card>
  );
}