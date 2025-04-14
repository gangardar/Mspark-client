import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Button,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Paid as PaidIcon,
  Pending as PendingIcon,
  HourglassEmpty as ProcessingIcon,
  Error as ErrorIcon,
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
} from "@mui/icons-material";
import PropTypes from "prop-types";
import { useState } from "react";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { ErrorMessage } from "../common/ErrorMessage";
import { EmptyState } from "../common/EmptyState";

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
    refunded: { color: "secondary", icon: <ReceiptIcon />, label: "Refunded" },
    partially_refunded: {
      color: "secondary",
      icon: <ReceiptIcon />,
      label: "Partially Refunded",
    },
  };

  const { color, icon, label } = statusMap[status] || {
    color: "default",
    icon: null,
    label: status,
  };

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

export const AllPaymentComponent = ({
  paymentsData,
  isLoading,
  isError,
  isFetched,
  error,
  onPageChange,
  onStatusFilterChange,
}) => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const baseUrl = import.meta.env.VITE_API_URL;

  const handleStatusChange = (event) => {
    const newStatus = event.target.value;
    setStatusFilter(newStatus);
    setPage(0); // Reset to first page when filter changes
    onStatusFilterChange(newStatus);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    onPageChange(newPage + 1); // API pages usually start at 1
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0); // Reset to first page when rows per page changes
    onPageChange(1, newRowsPerPage);
  };

  if (isLoading) return <LoadingSpinner message="Loading payments..." />;
  if (isError)
    return (
      <ErrorMessage message={error?.message || "Failed to load payments"} />
    );
  if (isFetched && !paymentsData?.data?.length)
    return (
      <>
        <EmptyState title={"No Payment Found"} />;
      </>
    );

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5" component="h2">
          Payment History
        </Typography>
        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={handleStatusChange}
            label="Status"
            disabled={isError} // Disable filter when there's an error
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="processing">Processing</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="failed">Failed</MenuItem>
            <MenuItem value="refunded">Refunded</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Table (shown only when there's no error and data exists) */}
      {!isError && paymentsData?.data?.length > 0 && (
        <Paper elevation={2}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "action.hover" }}>
                  <TableCell>Item</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Transaction</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paymentsData.data.map((payment) => (
                  <TableRow key={payment._id}>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          src={
                            baseUrl + "/" + payment.auction?.gemId?.images?.[0]
                          }
                          variant="rounded"
                          sx={{ width: 40, height: 40, mr: 2 }}
                        >
                          {payment.auction?.gemId?.name?.charAt(0) || "G"}
                        </Avatar>
                        <Box>
                          <Typography>
                            {payment.auction?.gemId?.name || "Unknown Item"}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Auction #{payment.auction?._id?.slice(-6)}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography>
                        {payment.amount} {payment.price_currency}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {payment.metadata?.receive_amount}{" "}
                        {payment.receive_currency}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <PaymentStatusChip status={payment.paymentStatus} />
                    </TableCell>
                    <TableCell>
                      {new Date(payment.transactionDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        #{payment.coinGateId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        href={payment.coinGatePaymentLink}
                        target="_blank"
                        startIcon={<PaymentIcon />}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={paymentsData.meta?.pagination?.total || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}
    </Box>
  );
};

AllPaymentComponent.propTypes = {
  paymentsData: PropTypes.shape({
    success: PropTypes.bool.isRequired,
    message: PropTypes.string,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        amount: PropTypes.string.isRequired,
        price_currency: PropTypes.string.isRequired,
        receive_currency: PropTypes.string.isRequired,
        description: PropTypes.string,
        paymentType: PropTypes.string,
        paymentStatus: PropTypes.string.isRequired,
        bidder: PropTypes.string.isRequired,
        auction: PropTypes.shape({
          _id: PropTypes.string.isRequired,
          status: PropTypes.string,
          currentPrice: PropTypes.number,
          gemId: PropTypes.shape({
            _id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            type: PropTypes.string,
            images: PropTypes.arrayOf(PropTypes.string),
          }),
        }),
        coinGateId: PropTypes.number.isRequired,
        coinGatePaymentLink: PropTypes.string.isRequired,
        metadata: PropTypes.shape({
          coinGateToken: PropTypes.string,
          originalOrderId: PropTypes.string,
          isRefundable: PropTypes.bool,
          originalResponse: PropTypes.object,
          previousAttempts: PropTypes.arrayOf(PropTypes.object),
          fees: PropTypes.arrayOf(PropTypes.object),
          paid_at: PropTypes.string,
          pay_amount: PropTypes.string,
          pay_currency: PropTypes.string,
          receive_amount: PropTypes.string,
        }),
        transactionDate: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
        updatedAt: PropTypes.string.isRequired,
        __v: PropTypes.number,
      })
    ).isRequired,
    meta: PropTypes.shape({
      pagination: PropTypes.shape({
        total: PropTypes.number.isRequired,
        totalPages: PropTypes.number.isRequired,
        currentPage: PropTypes.number.isRequired,
        limit: PropTypes.number.isRequired,
        hasNextPage: PropTypes.bool.isRequired,
        hasPrevPage: PropTypes.bool.isRequired,
      }).isRequired,
      filters: PropTypes.shape({
        status: PropTypes.string,
      }),
    }).isRequired,
  }),
  isLoading: PropTypes.bool.isRequired,
  isError: PropTypes.bool.isRequired,
  isFetched: PropTypes.bool.isRequired,
  error: PropTypes.shape({
    message: PropTypes.string,
    response: PropTypes.shape({
      data: PropTypes.shape({
        message: PropTypes.string,
      }),
    }),
  }),
  onPageChange: PropTypes.func.isRequired,
  onStatusFilterChange: PropTypes.func.isRequired,
};
