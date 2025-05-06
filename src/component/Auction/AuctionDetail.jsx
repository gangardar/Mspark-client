import { useState, useEffect, useContext } from "react";
import {
  Container,
  Grid2,
  Card,
  CardMedia,
  Typography,
  Divider,
  Button,
  Box,
  TextField,
  Avatar,
  LinearProgress,
  Tabs,
  Tab,
  Paper,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import {
  AccessTime,
  Favorite,
  Share,
  History,
  Gavel,
  AttachMoney,
  ImportContacts,
} from "@mui/icons-material";
import PropTypes from "prop-types";
import AuctionSkeleton from "./AuctionSkeleton";
import BidHistory from "./BidHistory";
import moment from "moment";
import useBid from "../../react-query/services/hooks/auctions/useBid";
import SnackbarContext from "../../context/SnackbarContext";
import { Link } from "react-router-dom";
import useAuth from "../../context/useAuth";
import { useSocket } from "../../context/SocketContext";
import useAuctionById from "../../react-query/services/hooks/auctions/useAuctionById";

const AuctionDetail = ({ auctionId }) => {
  const {data : auctionData, isLoading: loadingAuction, refetch} = useAuctionById({id: auctionId});
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [openBidDialog, setOpenBidDialog] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [isWatching, setIsWatching] = useState(false);
  const backendLink = import.meta.env.VITE_API_URL;
  const [image, setImage] = useState(null);
  const { userData } = useAuth();
  const { mutateAsync: doBid, error: bidError } = useBid();
  const { showSnackbar } = useContext(SnackbarContext);
  const socket = useSocket();

  useEffect(() => {
    if (!socket || !auction) return;

    // Join auction room
    socket.emit('joinAuction', auctionId);

    // Listen for new bids
    socket.on('newBid', (data) => {
      showSnackbar(`New bid: $${data.bid.bidAmount} by ${data.bid.user.username}`);
      refetch()
      setAuction(prev => ({
        ...prev,
        currentPrice: data.currentPrice,
        highestBidderId: {
          _id: data.bid.user._id,
          username: data.bid.user.username
        },
        bids: [data.bid, ...prev.bids]
      }));
    });

    // Cleanup
    return () => {
      socket.emit('leaveAuction', auctionId);
      socket.off('newBid');
    };
  }, [socket, auctionId, auction]);

  useEffect(() => {
    if(!auctionData) return;
    setLoading(true);
    // Fetch auction data
    const fetchAuction = async () => {
      try {
        const data = auctionData;
        const formattedData = {
          ...data?.data,
          gemId: {
            ...data?.data?.gemId,
            images:
              data?.data?.gemId?.images?.map((img) =>
                img.startsWith("http") ? img : `${backendLink}/${img}`
              ) || [],
          },
        };
        setAuction(formattedData);
        setImage(formattedData?.gemId?.images[0]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching auction:", error);
        setLoading(false);
      }
    };

    fetchAuction();
  }, [auctionId, backendLink, auctionData]);

  useEffect(() => {
    // Countdown timer
    if (auction?.endTime) {
      const timer = setInterval(() => {
        const now = moment();
        const endTime = moment(auction.endTime);
        const duration = moment.duration(endTime.diff(now));

        if (duration.asSeconds() <= 0) {
          clearInterval(timer);
          setTimeLeft("Auction ended");
        } else {
          setTimeLeft(
            `${duration.months()}m ${duration.days()}d ${duration.hours()}h ${duration.minutes()}m ${duration.seconds()}s`
          );
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [auction]);

  const handleBidSubmit = async () => {
    try {
      const updatedBid = await doBid({
        id: auctionId,
        auction: { bidAmount: Number(bidAmount) },
      });
      const updatedBidData = updatedBid?.data;

      // Update auction state while preserving images
      setAuction((prev) => ({
        ...updatedBidData,
        gemId: {
          ...updatedBidData.gemId,
          images: prev?.gemId?.images || [], // Keep existing images
        },
        bids: updatedBidData.bids, // Update bids if needed
      }));

      setOpenBidDialog(false);
      setBidAmount("");
      showSnackbar(updatedBid?.message);
    } catch (error) {
      setOpenBidDialog(false);
      showSnackbar(
        error?.response?.data?.message || "Error Submitting bid.",
        "error"
      );
      console.error("Error placing bid:", error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleWatchToggle = () => {
    setIsWatching(!isWatching);
  };

  if (loading) {
    return <AuctionSkeleton count={1} />;
  }

  if (loadingAuction) {
    return <AuctionSkeleton count={1} />;
  }

  if (!auction) {
    return (
      <Container>
        <Typography variant="h5" align="center" sx={{ mt: 4 }}>
          Auction not found
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid2 container spacing={4} sx={{ display: "flex", flexWrap: "wrap" }}>
        {/* Left Column - Auction Images */}
        <Grid2 xs={12} md={6} sx={{ flexGrow: 1 }}>
          <Card>
            <CardMedia
              component="img"
              height="500"
              image={image}
              alt={auction.gemId.name}
              sx={{ objectFit: "contain" }}
            />
            <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
              {auction.gemId.images.slice(0, 4).map((image, index) => (
                <Box key={index} sx={{ mx: 1, cursor: "pointer" }}>
                  <img
                    onClick={() => setImage(auction?.gemId?.images[index])}
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    style={{ width: 60, height: 60, objectFit: "cover" }}
                  />
                </Box>
              ))}
            </Box>
          </Card>
        </Grid2>

        {/* Right Column - Auction Details */}
        <Grid2 xs={12} md={6} sx={{ flexGrow: 1 }}>
          <Box sx={{ mb: 3, maxWidth: "100%" }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {auction.gemId.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {auction.gemId.type}
            </Typography>
          </Box>

          {/* Auction Status Bar */}
          <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="body2" color="text.secondary">
                Current Bid
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {auction.bids.length} bids
              </Typography>
            </Box>
            <Typography variant="h4" color="primary" sx={{ mb: 2 }}>
              ${auction.currentPrice || auction.priceStart}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={Math.min(
                100,
                ((auction.currentPrice - auction.priceStart) /
                  auction.priceStart) *
                  100
              )}
              sx={{ height: 8, mb: 2 }}
            />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2">
                Starting Price: ${auction.priceStart}
              </Typography>
              <Typography variant="body2">
                Next Bid: $
                {(auction.currentPrice || auction.priceStart) +
                  (auction.bidAmount || 1)}
              </Typography>
            </Box>
          </Paper>

          {/* Time Left */}
          <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <AccessTime color="secondary" sx={{ mr: 1 }} />
              <Typography variant="h6">
                {timeLeft || "Calculating time..."}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Auction ends:{" "}
              {moment(auction.endTime).format("MMMM Do YYYY, h:mm a")}
            </Typography>
          </Paper>

          {/* Bid Actions */}
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            {bidError?.response?.data?.message === "No Address Found" ? (
              <Button
                variant="contained"
                component={Link}
                to={`/dashboard/${userData.username || ''}/profile`}
                color="primary"
                size="large"
                startIcon={<ImportContacts/>}
                fullWidth
              >
                Enter Address
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<AttachMoney />}
                onClick={() => setOpenBidDialog(true)}
                fullWidth
                disabled={auction.status !== "active"}
              >
                Place Bid
              </Button>
            )}

            <IconButton
              color={isWatching ? "error" : "default"}
              onClick={handleWatchToggle}
              aria-label={
                isWatching ? "Remove from watchlist" : "Add to watchlist"
              }
            >
              <Favorite />
            </IconButton>
            <IconButton color="default" aria-label="Share">
              <Share />
            </IconButton>
          </Box>

          {/* Seller Info */}
          <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar sx={{ mr: 2 }}>
                {auction.merchantId.username.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="subtitle1">
                  {auction.merchantId.username}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Seller since{" "}
                  {moment(auction.merchantId.createdAt).format("YYYY")}
                </Typography>
              </Box>
            </Box>
            <Button variant="outlined" fullWidth>
              Contact Seller
            </Button>
          </Paper>
        </Grid2>

        {/* Tabs Section */}
        <Grid2 xs={12} sx={{ flexGrow: 1 }}>
          <Paper elevation={2}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              aria-label="auction tabs"
            >
              <Tab label="Description" icon={<History />} />
              <Tab label="Bid History" icon={<Gavel />} />
              <Tab label="Shipping & Payments" icon={<AttachMoney />} />
            </Tabs>
            <Divider />
            <Box sx={{ p: 3 }}>
              {activeTab === 0 && (
                <Typography variant="body1">
                  {auction.gemId.description || "No description provided."}
                </Typography>
              )}
              {activeTab === 1 && <BidHistory bids={auction.bids} />}
              {activeTab === 2 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Shipping Information
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Item will be shipped within 2 business days after payment is
                    received.
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    Payment Methods
                  </Typography>
                  <Typography variant="body1">
                    We accept PayPal, credit cards, and bank transfers.
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid2>
      </Grid2>

      {/* Bid Dialog */}
      <Dialog open={openBidDialog} onClose={() => setOpenBidDialog(false)}>
        <DialogTitle>Place Your Bid</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Current bid: ${auction.currentPrice || auction.priceStart}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Next minimum bid: $
            {(auction.currentPrice || auction.priceStart) +
              (auction.bidAmount || 1)}
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Your Bid Amount"
            type="number"
            fullWidth
            variant="outlined"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            inputProps={{
              min:
                (auction.currentPrice || auction.priceStart) +
                (auction.bidAmount || 1),
              step: auction.bidAmount || 1,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBidDialog(false)}>Cancel</Button>
          <Button
            onClick={handleBidSubmit}
            variant="contained"
            disabled={
              !bidAmount ||
              parseFloat(bidAmount) <
                (auction.currentPrice || auction.priceStart) +
                  (auction.bidAmount || 1)
            }
          >
            Confirm Bid
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

AuctionDetail.propTypes = {
  auctionId: PropTypes.string.isRequired,
};

export default AuctionDetail;
