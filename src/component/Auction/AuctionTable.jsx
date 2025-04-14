import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Chip,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import {
  MoreVert,
  Search,
  Cancel,
  CheckCircle,
  AccessTime,
} from "@mui/icons-material";
import { useContext, useEffect, useMemo, useState } from "react";
import AuthContext from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import readableDateDifference from "../../react-query/services/utilities/readableDateDifference";
import BidHistoryModal from "./BidHistoryModal";
import useCancelAuction from "../../react-query/services/hooks/auctions/useCancelAuction";
import SnackbarContext from "../../context/SnackbarContext";
import useActivateAuction from "../../react-query/services/hooks/auctions/useActivateAuction";
import ExtendAuctionModal from "./ExtendAuctionModal";
import useAuctionByUser from "../../react-query/services/hooks/auctions/useAuctionByUser";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { ErrorMessage } from "../common/ErrorMessage";
import PropTypes from "prop-types";

const statusColors = {
  active: "success",
  cancelled: "error",
  completed: "info",
  pending: "warning",
};

const AuctionTable = ({auctionStatus}) => {
  const backendLink = import.meta.env.VITE_API_URL;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(auctionStatus || "all");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [showBidModal, setShowBidModal] = useState(false);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [userData, setUserData] = useState();
  const { isValid } = useContext(AuthContext);
  const { showSnackbar } = useContext(SnackbarContext);
  const { mutateAsync: cancelAuction } = useCancelAuction();
  const { mutateAsync: activateAuction } = useActivateAuction();

  useEffect(() => {
    if (!isValid) return;
    if (!isValid?.status) return;
    const data = jwtDecode(isValid.token);
    setUserData(data);
  }, [isValid]);

  useEffect(() => {
    setStatusFilter(auctionStatus || "all");
    setPage(0); // Reset to first page when status filter changes
  }, [auctionStatus]);

  // Fetch auctions with pagination and filters
  const {
    data: auctions,
    isLoading,
    isError,
    refetch,
  } = useAuctionByUser(
    { 
      userData, 
      page: page + 1, 
      limit: rowsPerPage,
      search: searchTerm,
      status: statusFilter === "all" ? undefined : statusFilter
    },
    { 
      enabled: !!userData?.status,
      keepPreviousData: true 
    }
  );

  const processedAuctions = useMemo(() => {
    if (!auctions?.data) return [];

    return auctions.data.map((auction) => {
      const endingIn = readableDateDifference({
        start: auction.createdAt,
        end: auction.endTime,
      });

      return {
        ...auction,
        endingIn: endingIn,
        gemId: {
          ...auction.gemId,
          images:
            auction.gemId?.images?.map((img) =>
              img.startsWith("http") ? img : `${backendLink}/${img}`
            ) || [],
        },
      };
    });
  }, [auctions, backendLink]);

  const handleMenuOpen = (event, auction) => {
    setAnchorEl(event.currentTarget);
    setSelectedAuction(auction);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAuction(null);
    setShowBidModal(false);
    setShowExtendModal(false);
  };

  const handleCancelAuction = async () => {
    if (selectedAuction) {
      cancelAuction(selectedAuction._id)
        .then(() => {
          refetch();
          showSnackbar("Auction cancelled successfully", "success");
        })
        .catch((err) => {
          showSnackbar(err?.response?.data?.message || "Failed to cancel auction", "error");
        });
    }
    handleMenuClose();
  };

  const handleActivateAuction = async () => {
    if (selectedAuction && selectedAuction.status !== "active") {
      activateAuction(selectedAuction._id)
        .then(() => {
          refetch();
          showSnackbar("Auction activated successfully", "success");
        })
        .catch((err) => {
          showSnackbar(err?.response?.data?.message || "Failed to activate auction", "error");
        });
    }
    handleMenuClose();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  const handleViewBids = () => {
    if (selectedAuction) setShowBidModal(true);
  };

  const handleExtendAuction = () => {
    if (selectedAuction) setShowExtendModal(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircle fontSize="small" />;
      case "cancelled":
        return <Cancel fontSize="small" />;
      case "completed":
        return <CheckCircle fontSize="small" />;
      default:
        return <AccessTime fontSize="small" />;
    }
  };

  if (isLoading) return <LoadingSpinner message="Loading auctions..." />;
  if (isError) return <ErrorMessage message="Failed to load auctions" />;

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h6">Auction Management</Typography>

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              label="Status"
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>

          <TextField
            size="small"
            placeholder="Search auctions..."
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>

      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader aria-label="auction table">
          <TableHead>
            <TableRow>
              <TableCell>Gem</TableCell>
              <TableCell>Merchant</TableCell>
              <TableCell>Start Price</TableCell>
              <TableCell>Current Price</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>End Time</TableCell>
              <TableCell>Ending In</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Bids</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {processedAuctions?.length > 0 ? (
              processedAuctions.map((auction) => (
                <TableRow key={auction._id} hover>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {auction.gemId?.images?.[0] && (
                        <img
                          src={auction.gemId.images[0]}
                          alt={auction.gemId.name}
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 4,
                            marginRight: 8,
                          }}
                        />
                      )}
                      <Typography>{auction.gemId?.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{auction.merchantId?.username}</TableCell>
                  <TableCell>${auction.priceStart.toFixed(2)}</TableCell>
                  <TableCell>
                    ${auction.currentPrice?.toFixed(2) || "0.00"}
                  </TableCell>
                  <TableCell>
                    {new Date(auction.startTime).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {new Date(auction.endTime).toLocaleString()}
                  </TableCell>
                  <TableCell>{auction.endingIn}</TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(auction.status)}
                      label={auction.status}
                      color={statusColors[auction.status] || "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{auction.bids?.length || 0}</TableCell>
                  <TableCell>
                    <IconButton
                      aria-label="more"
                      aria-controls="auction-menu"
                      aria-haspopup="true"
                      onClick={(e) => handleMenuOpen(e, auction)}
                    >
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  <Typography variant="body1" color="textSecondary">
                    No auctions found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {auctions?.pagination?.total > 0 && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={auctions?.pagination?.total || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}

      <Menu
        id="auction-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {userData?.role === "merchant" && (
          <MenuItem
            onClick={handleCancelAuction}
            disabled={selectedAuction?.status !== "active"}
          >
            <Cancel fontSize="small" sx={{ mr: 1 }} />
            Cancel Auction
          </MenuItem>
        )}
        <MenuItem
          onClick={handleActivateAuction}
          disabled={selectedAuction?.status !== "cancelled"}
        >
          <CheckCircle fontSize="small" color="success" sx={{ mr: 1 }} />
          Activate Auction
        </MenuItem>
        {userData?.role === "merchant" && (
          <MenuItem
            onClick={handleExtendAuction}
            disabled={selectedAuction?.status !== "active"}
          >
            Extend Auction
          </MenuItem>
        )}
        <MenuItem onClick={handleMenuClose}>View Details</MenuItem>
        <MenuItem onClick={handleViewBids}>View Bids</MenuItem>
      </Menu>

      <BidHistoryModal
        open={showBidModal}
        onClose={handleMenuClose}
        bids={selectedAuction?.bids}
        currentPrice={selectedAuction?.currentPrice}
        startingPrice={selectedAuction?.priceStart}
        auctionEndTime={selectedAuction?.endTime}
      />
      <ExtendAuctionModal
        open={showExtendModal}
        onClose={handleMenuClose}
        auction={selectedAuction}
        refetchAuctions={refetch}
      />
    </Paper>
  );
};

AuctionTable.propTypes = {
  auctionStatus : PropTypes.string
}

export default AuctionTable;