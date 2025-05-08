import { useContext, useEffect, useState } from "react";
import { usePaymentsByUserData } from "../../react-query/services/hooks/payment/usePaymentByBidder";
import AuthContext from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { ErrorMessage } from "../common/ErrorMessage";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Button,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Paid as PaidIcon,
  Pending as PendingIcon,
  HourglassEmpty as ProcessingIcon,
  Error as ErrorIcon,
  Payment as PaymentIcon,
  MoreVert,
  Replay,
} from "@mui/icons-material";
import PropTypes from "prop-types";
import { usePaymentRetry } from "../../react-query/services/hooks/payment/usePaymentRetry";
import SnackbarContext from "../../context/SnackbarContext";

const PaymentStatusChip = ({ status }) => {
  const statusMap = {
    new: { color: "warning", icon: <PendingIcon />, label: "New" },
    pending: { color: "warning", icon: <PendingIcon />, label: "Pending" },
    confirming: {
      color: "info",
      icon: <ProcessingIcon />,
      label: "Processing",
    },
    paid: { color: "success", icon: <PaidIcon />, label: "Paid" },
    invalid: { color: "error", icon: <ErrorIcon />, label: "Invalid" },
    expired: { color: "error", icon: <ErrorIcon />, label: "Expired" },
    canceled: { color: "error", icon: <ErrorIcon />, label: "Canceled" },
  };

  const { color, icon, label } = statusMap[status] || statusMap.pending;

  return (
    <Chip
      icon={icon}
      label={label}
      color={color}
      size="small"
      variant="outlined"
    />
  );
};

PaymentStatusChip.propTypes = {
  status: PropTypes.string,
};

export const PaymentTable = ({ paymentStatus = "paid", bidderId }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [userData, setUserData] = useState(null);
  const { isValid } = useContext(AuthContext);
  const { showSnackbar } = useContext(SnackbarContext);
  const { mutateAsync: retryPayment, isPending : retrying } = usePaymentRetry();

  useEffect(() => {
    if (!isValid?.status || !isValid?.token) return;

    try {
      const decoded = jwtDecode(isValid.token);
      setUserData(decoded);
    } catch (error) {
      console.error("JWT decoding failed:", error);
    }
  }, [isValid]);

  const { data, isLoading, isError, error, isFetching, refetch } =
    usePaymentsByUserData(
      {
        bidderId: bidderId || userData?._id,
        status: paymentStatus,
      },
      { enabled: !!userData?._id || !!bidderId }
    );

  if (!isValid?.status) {
    return <LoadingSpinner message="Authenticating..." />;
  }

  if (isLoading || isFetching || retrying) {
    return <LoadingSpinner message="Loading Payments..." />;
  }

  if (isError) {
    return (
      <ErrorMessage
        message={
          error?.response?.message ||
          error?.message ||
          "Failed to load payments"
        }
      />
    );
  }

  if (!data?.data?.length) {
    return <Typography>No {paymentStatus} payments found</Typography>;
  }

  const handleMenuOpen = (event, payment) => {
    setAnchorEl(event.currentTarget);
    setSelectedPayment(payment);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPayment(null);
  };

  const handlePaymentRetry = async () => {
    if (!selectedPayment) return;
    
    try {
      const res = await retryPayment({ auctionId: selectedPayment.auction._id });
      showSnackbar(res?.message || "Retried successfully");
      if (res?.paymentLink) {
        window.open(res.paymentLink, "_blank").focus();
      }
      refetch();
    } catch (err) {
      console.log(err);
      showSnackbar(
        err?.response?.data?.message || err?.message || "Failed to retry payment",
        "error"
      );
    }
  };

  return (
    <>
      <Box sx={{ p: 3 }}>
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "action.hover" }}>
                <TableCell sx={{ fontWeight: "bold" }}>Item</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Payment Link</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.data.map((payment) => (
                <TableRow key={payment._id}>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        src={payment.auction?.gemId?.images?.[0]}
                        variant="rounded"
                        sx={{ width: 40, height: 40, mr: 2 }}
                      >
                        {payment.auction?.gemId?.name?.charAt(0) || "G"}
                      </Avatar>
                      <Typography>
                        {payment.auction?.gemId?.name || "Unknown Item"}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography>
                      {payment.amount} {payment.price_currency}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Receive: {payment.receive_currency}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <PaymentStatusChip status={payment.paymentStatus} />
                  </TableCell>
                  <TableCell>
                    {new Date(payment.transactionDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      href={payment.coinGatePaymentLink}
                      target="_blank"
                      startIcon={<PaymentIcon />}
                    >
                      Pay Now
                    </Button>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      aria-label="more"
                      aria-controls="auction-menu"
                      aria-haspopup="true"
                      onClick={(e) => handleMenuOpen(e, payment)}
                    >
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {/* Action Menu */}
      <Menu
        id="auction-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {["expired", "invalid", "canceled"].includes(
          selectedPayment?.paymentStatus
        ) && (
          <MenuItem onClick={handlePaymentRetry}>
            <Replay fontSize="small" color="info" sx={{ mr: 1 }} />
            Retry
          </MenuItem>
        )}
        <MenuItem onClick={handleMenuClose}>View Details</MenuItem>
      </Menu>
    </>
  );
};

PaymentTable.propTypes = {
  paymentStatus: PropTypes.string,
  bidderId: PropTypes.string,
};
