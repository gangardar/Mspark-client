import {
  AccessTime,
  CalendarToday,
  MonetizationOn,
  Person,
} from "@mui/icons-material";
import {
  Grid2,
  Card,
  CardContent,
  Stack,
  Chip,
  Box,
  Divider,
  CardMedia,
  Typography,
  Button,
  Pagination,
} from "@mui/material";
import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import SnackbarContext from "../../context/SnackbarContext";
import { jwtDecode } from "jwt-decode";
import AuctionSkeleton from "./AuctionSkeleton";
import useAuction from "../../react-query/services/hooks/auctions/useAuction";
const Auctions = () => {
  const backendLink = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { isValid } = useContext(AuthContext);
  const { showSnackbar } = useContext(SnackbarContext);
  const [page, setPage] = useState(1);

  const {
    data: auctions,
    isLoading: loadingAuctions,
    isError: isAuctionError,
    error: auctionError,
  } = useAuction({page});

  const handleBid = (id) => {
    if (!isValid.status) {
      showSnackbar("Please login to place a bid", "error");
      return navigate("/?role=bidder");
    }

    const userData = jwtDecode(isValid.token);
    if (userData.role !== "bidder") {
      showSnackbar("Please login with bidder account", "error");
      return navigate("/?role=bidder");
    }

    navigate(`/auction-detail/${id}`);
  };
  const processedAuctions = useMemo(() => {
    if (!auctions?.data) return [];

    return auctions.data.map((auction) => ({
      ...auction,
      gemId: {
        ...auction.gemId,
        images:
          auction.gemId?.images?.map((img) =>
            img.startsWith("http") ? img : `${backendLink}/${img}`
          ) || [],
      },
    }));
  }, [auctions, backendLink]);
  const handlePagnation = (event, page) => {
        setPage(page)
  }
  useEffect(() => {
    if (isAuctionError) {
      showSnackbar(auctionError.message, "error");
    }
  }, [isAuctionError]);
  if (loadingAuctions) {
    return <AuctionSkeleton />;
  }
  return (
    <>
      <Grid2 container spacing={3} justifyContent={"center"}>
        {processedAuctions?.map((auction) => (
          <Grid2 item xs={12} sm={6} md={4} key={auction._id} my={2}>
            <Card sx={{ display: "flex", flexDirection: "column" }}>
              {/* Auction Image */}
              <CardMedia
                component="img"
                height="200"
                image={auction.gemId.images[0]}
                alt={auction.gemId.name}
                sx={{ objectFit: "cover" }}
              />

              <CardContent sx={{ flexGrow: 1 }}>
                {/* Gem Name and Type */}
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Typography variant="h5" component="div">
                    {auction.gemId.name}
                  </Typography>
                  <Chip
                    label={auction.gemId.type}
                    color="secondary"
                    size="small"
                  />
                </Stack>

                {/* Price Information */}
                <Box mb={2}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <MonetizationOn color="primary" />
                    <Typography variant="body1">
                      Current Price: $
                      {auction.currentPrice || auction.priceStart}
                    </Typography>
                  </Stack>
                  <Typography variant="caption" color="text.secondary">
                    Starting Price: ${auction.priceStart}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Time Information */}
                <Stack spacing={1} mb={2}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CalendarToday fontSize="small" color="action" />
                    <Typography variant="body2">
                      Started:{" "}
                      {new Date(auction.startTime).toLocaleDateString()}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <AccessTime fontSize="small" color="action" />
                    <Typography variant="body2">
                      Ends: {new Date(auction.endTime).toLocaleString()}
                    </Typography>
                  </Stack>
                </Stack>

                {/* Merchant Info */}
                <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                  <Person fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Seller: {auction.merchantId.username}
                  </Typography>
                </Stack>

                {/* Status & Bids */}
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Chip
                    label={auction.status.toUpperCase()}
                    color={auction.status === "active" ? "success" : "error"}
                  />
                  <Typography variant="caption">
                    {auction?.bids?.length} bids
                  </Typography>
                </Stack>
              </CardContent>

              {/* Action Button */}
              <Box sx={{ p: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={auction.status !== "active"}
                  onClick={() => handleBid(auction._id)}
                >
                  {auction.status === "active" ? "Place Bid" : "Auction Ended"}
                </Button>
              </Box>
            </Card>
          </Grid2>
        ))}
      </Grid2>
        <Box component={'div'} sx={{display:"flex", justifyContent:'center', my:3}}>
            <Pagination selected size="large" page={page} onChange={handlePagnation} count={auctions?.meta?.pagination?.totalPages}/>
        </Box>

    </>
  );
};

export default Auctions;
