import {
    Box,
    Typography,
    Paper,
    Chip,
    Button,
    Avatar,
    Grid,
    Divider,
    Stack,
    Tooltip,
    Card,
    CardContent,
    CardHeader,
    LinearProgress
  } from '@mui/material';
  import {
    Paid as PaidIcon,
    PendingActions as PendingActionsIcon,
    ShoppingBag as ShoppingBagIcon,
    Person as PersonIcon,
    Diamond as DiamondIcon,
    Event as EventIcon,
    MonetizationOn as MonetizationOnIcon,
    CalendarToday as CalendarTodayIcon,
    AttachMoney as AttachMoneyIcon,
    CheckCircle as CheckCircleIcon,
    Schedule as ScheduleIcon,
    AccountCircle as AccountCircleIcon,
  } from '@mui/icons-material';
  import usePendingPayment from '../../react-query/services/hooks/payment/usePendingPayment';
  import { LoadingSpinner } from '../common/LoadingSpinner';
  import { ErrorMessage } from '../common/ErrorMessage';
  import { useContext, useEffect, useState } from 'react';
  import useCreateSendPayment from '../../react-query/services/hooks/payment/useCreateSendPayment';
  import SnackbarContext from '../../context/SnackbarContext';
  import { styled } from '@mui/material/styles';
  
  const StatusBadge = styled(Chip)(({ theme }) => ({
    fontWeight: 600,
    fontSize: '0.75rem',
    padding: theme.spacing(0.5),
    borderRadius: '4px',
  }));
  
  const StatCard = ({ icon, label, value, color }) => (
    <Paper sx={{ 
      p: 2, 
      borderRadius: 2,
      backgroundColor: color ? `${color}.light` : 'background.paper',
      borderLeft: color ? `4px solid` : 'none',
      borderColor: color ? `${color}.main` : 'transparent'
    }}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box sx={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: color ? `${color}.light` : 'action.selected',
          color: color ? `${color}.dark` : 'text.secondary'
        }}>
          {icon}
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">{label}</Typography>
          <Typography variant="h6" fontWeight={600}>{value}</Typography>
        </Box>
      </Stack>
    </Paper>
  );
  
  const PendingPaymentsView = () => {
    const [data, setData] = useState();
    const { mutateAsync: createPayment, isPending } = useCreateSendPayment();
    const { data: fetchPayment, isLoading, isError, error } = usePendingPayment();
    const { showSnackbar } = useContext(SnackbarContext);
  
    useEffect(() => {
      setData(fetchPayment?.data);
    }, [data, fetchPayment]);
  
    const handleSendPayment = async (e, item) => {
      if (data) {
        try {
          await createPayment({ auctionId: item?.auction?._id, bidderPaymentId: item.bidderPayment._id });
          showSnackbar("Payment sent successfully!", 'success');
        } catch (err) {
          showSnackbar(err?.response?.data?.message || "Something went wrong while sending payment!", 'error');
        }
      }
    };
  
    if (isLoading) {
      return <LoadingSpinner message="Loading pending payments..." />;
    }
  
    if (isError) {
      return <ErrorMessage message={error?.response?.data?.message || "Failed to load pending payments"} />;
    }
  
    if (!data || data.length === 0) {
      return (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '60vh',
          textAlign: 'center',
          p: 3
        }}>
          <MonetizationOnIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No pending payments
          </Typography>
          <Typography variant="body2" color="text.secondary">
            All payments have been processed. Check back later for new transactions.
          </Typography>
        </Box>
      );
    }
  
    return (
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Pending Payments
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Review and process payments to builders for completed auctions
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard 
                icon={<PendingActionsIcon />} 
                label="Pending Payments" 
                value={data.length} 
                color="warning" 
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard 
                icon={<AttachMoneyIcon />} 
                label="Total Amount" 
                value={`$${data.reduce((sum, item) => sum + (item.auction?.currentPrice || 0), 0).toLocaleString()}`} 
                color="info" 
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard 
                icon={<CalendarTodayIcon />} 
                label="Oldest Payment" 
                value={`${Math.max(...data.map(item => item.daysSinceBidderPaid))} days`} 
                color="error" 
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard 
                icon={<CheckCircleIcon />} 
                label="Ready to Process" 
                value={`${data.length}`} 
                color="success" 
              />
            </Grid>
          </Grid>
        </Box>
  
        <Stack spacing={3}>
          {data.map((item, index) => (
            <Card key={index} elevation={0} sx={{ 
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              overflow: 'hidden'
            }}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <ShoppingBagIcon />
                  </Avatar>
                }
                action={
                  <StatusBadge 
                    label="PENDING PAYMENT" 
                    color="warning" 
                    icon={<ScheduleIcon fontSize="small" />}
                  />
                }
                title={`Auction #${item.auction?._id?.slice(-6) || 'N/A'}`}
                subheader={`Completed on ${new Date(item.auction?.endTime).toLocaleDateString()}`}
                titleTypographyProps={{ variant: 'subtitle1', fontWeight: 600 }}
                subheaderTypographyProps={{ variant: 'caption' }}
                sx={{ pb: 0 }}
              />
              
              <CardContent>
                <Grid container spacing={3}>
                  {/* Gem & Auction Summary */}
                  <Grid item xs={12} md={6}>
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          GEM DETAILS
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <DiamondIcon color="primary" sx={{ mr: 1, fontSize: 20 }} />
                          <Typography variant="body1" fontWeight={500}>
                            {item.gem?.name} ({item.gem?.type})
                          </Typography>
                        </Box>
                        <Grid container spacing={1}>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              Weight
                            </Typography>
                            <Typography variant="body1">
                              {item.gem?.weight} carats
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              Color
                            </Typography>
                            <Typography variant="body1">
                              {item.gem?.color}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              Shape
                            </Typography>
                            <Typography variant="body1">
                              {item.gem?.shape}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              Rarity
                            </Typography>
                            <Typography variant="body1">
                              {item.gem?.rarity}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
  
                      <Divider />
  
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          AUCTION SUMMARY
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              Start Price
                            </Typography>
                            <Typography variant="body1">
                              ${item.auction?.priceStart?.toLocaleString()}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              Final Price
                            </Typography>
                            <Typography variant="body1" fontWeight={600}>
                              ${item.auction?.currentPrice?.toLocaleString()}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              Bids Placed
                            </Typography>
                            <Typography variant="body1">
                              {item.auction?.bids?.length || 0}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              Duration
                            </Typography>
                            <Typography variant="body1">
                              {new Date(item.auction?.startTime).toLocaleDateString()} - {' '}
                              {new Date(item.auction?.endTime).toLocaleDateString()}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    </Stack>
                  </Grid>
  
                  {/* Payment & Bidder Info */}
                  <Grid item xs={12} md={6}>
                    <Stack spacing={3}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          PAYMENT STATUS
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={50} 
                            color="warning"
                            sx={{ height: 6, borderRadius: 3, mb: 1 }}
                          />
                          <Grid container spacing={1}>
                            <Grid item xs={6}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <CheckCircleIcon color="success" sx={{ fontSize: 16, mr: 1 }} />
                                <Typography variant="body2">
                                  Bidder Paid
                                </Typography>
                              </Box>
                              <Typography variant="body2" color="text.secondary" sx={{ ml: 3 }}>
                                ${item.bidderPayment?.amount} on {new Date(item.bidderPayment?.updatedAt).toLocaleDateString()}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <PendingActionsIcon color="warning" sx={{ fontSize: 16, mr: 1 }} />
                                <Typography variant="body2">
                                  Builder Payment
                                </Typography>
                              </Box>
                              <Typography variant="body2" color="text.secondary" sx={{ ml: 3 }}>
                                Pending for {item.daysSinceBidderPaid} days
                              </Typography>
                            </Grid>
                          </Grid>
                        </Box>
                      </Box>
  
                      <Divider />
  
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          WINNING BIDDER
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            src={item.bidder?.profile} 
                            sx={{ width: 48, height: 48, mr: 2 }}
                          >
                            <AccountCircleIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="body1" fontWeight={500}>
                              {item.bidder?.fullName || 'Unknown Bidder'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {item.bidder?.email}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                              <EventIcon fontSize="small" sx={{ mr: 0.5 }} />
                              Member since {new Date(item.bidder?.createdAt).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
  
              <Divider />
  
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'flex-end', 
                p: 2,
                bgcolor: 'background.default'
              }}>
                <Tooltip title="Send payment to the builder">
                  <Button 
                    onClick={(e) => handleSendPayment(e, item)}
                    variant="contained" 
                    color="primary" 
                    startIcon={<PaidIcon />}
                    disabled={isPending}
                    sx={{
                      minWidth: 160,
                      borderRadius: 2,
                      textTransform: 'none',
                      boxShadow: 'none',
                      '&:hover': {
                        boxShadow: 'none'
                      }
                    }}
                  >
                    {isPending ? "Processing..." : "Send Payment"}
                  </Button>
                </Tooltip>
              </Box>
            </Card>
          ))}
        </Stack>
      </Box>
    );
  };
  
  export default PendingPaymentsView;