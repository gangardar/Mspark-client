import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TablePagination,
  Box,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid2,
  CircularProgress,
  Menu,
  IconButton,
} from "@mui/material";
import { useDelivery } from "../../react-query/services/hooks/deliveries/useDelivery";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { MoreVert } from "@mui/icons-material";
import PropTypes from "prop-types";
import { useUpdateDeliveryStatus } from "../../react-query/services/hooks/deliveries/useUpdateDelivery";
import SnackbarContext from "../../context/SnackbarContext";

const DeliveryTable = ({ type, status }) => {
  const { isValid } = useContext(AuthContext);
  const userData = isValid?.token ? jwtDecode(isValid.token) : null;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState(status);
  const [typeFilter, setTypeFilter] = useState(type);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentDelivery, setCurrentDelivery] = useState(null);
  const open = Boolean(anchorEl);
  const { mutateAsync: updateStatus, error: updateError } =
    useUpdateDeliveryStatus();
  const { showSnackbar } = useContext(SnackbarContext);

  useEffect(() => {
    setTypeFilter(type || "");
    setStatusFilter(status || "");
  }, [type, status]);

  const { data, isLoading, isError, error, refetch } = useDelivery({
    page: page + 1, // API uses 1-based index
    limit: rowsPerPage,
    status: statusFilter || undefined,
    type: typeFilter || undefined,
  });

  const handleMenuOpen = (event, delivery) => {
    setAnchorEl(event.currentTarget);
    setCurrentDelivery(delivery);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentDelivery(null);
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!currentDelivery) return;

    try {
      console.log(`Updating delivery ${currentDelivery._id} to ${newStatus}`);
      await updateStatus({ id: currentDelivery._id, status: newStatus });
      refetch(); // Refresh the data after update
    } catch (err) {
      console.error("Failed to update status:", err);
      showSnackbar(err?.response?.data?.message || updateError.message || "Error Updating status.");
    } finally {
      handleMenuClose();
    }
  };

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case "pending":
        return "in_transit";
      case "in_transit":
        return "delivered";
      default:
        return currentStatus;
    }
  };

  const getAvailableActions = (delivery) => {
    if (!userData || !delivery) return [];

    const isAdmin = userData.role === "admin";
    const isFromUser = delivery.from._id === userData._id;
    const isToUser = delivery.to._id === userData._id;
    const nextStatus = getNextStatus(delivery.status);

    // Admin can perform the next status change (but can't skip)
    if (isAdmin) {
      if (delivery.status === "delivered") return [];
      return [
        {
          label: `Mark as ${nextStatus.replace("_", " ")}`,
          status: nextStatus,
          disabled: false,
        },
      ];
    }

    // From user can only move from pending to in_transit
    if (isFromUser && delivery.status === "pending") {
      return [
        {
          label: "Mark as In Transit",
          status: "in_transit",
          disabled: false,
        },
      ];
    }

    // To user can only move from in_transit to delivered
    if (isToUser && delivery.status === "in_transit") {
      return [
        {
          label: "Mark as Delivered",
          status: "delivered",
          disabled: false,
        },
      ];
    }

    return [];
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  const handleTypeFilterChange = (event) => {
    setTypeFilter(event.target.value);
    setPage(0);
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        flexGrow={1}
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <Typography color="error">Error: {error.message}</Typography>
      </Box>
    );
  }

  const deliveries = data?.data || [];
  const total = data?.pagination?.total || 0;

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "in_transit":
        return "info";
      case "delivered":
        return "success";
      default:
        return "default";
    }
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <Box sx={{ p: 2 }}>
        <Grid2 container spacing={2}>
          <Grid2 xs={12} sm={6} md={3} minWidth={"200px"}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={handleStatusFilterChange}
              >
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="in_transit">In Transit</MenuItem>
                <MenuItem value="delivered">Delivered</MenuItem>
              </Select>
            </FormControl>
          </Grid2>
          <Grid2 xs={12} sm={6} md={3} minWidth={"200px"}>
            <FormControl fullWidth size="small">
              <InputLabel>Type</InputLabel>
              <Select
                value={typeFilter}
                label="Type"
                onChange={handleTypeFilterChange}
              >
                <MenuItem value="">All Types</MenuItem>
                <MenuItem value="verification">Verification</MenuItem>
                <MenuItem value="sale">Sale</MenuItem>
                <MenuItem value="return">Return</MenuItem>
              </Select>
            </FormControl>
          </Grid2>
        </Grid2>
      </Box>

      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader aria-label="delivery table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Gems</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deliveries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" color="textSecondary">
                    No deliveries found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              deliveries.map((delivery) => {
                const actions = getAvailableActions(delivery);
                return (
                  <TableRow key={delivery._id} hover>
                    <TableCell>
                      <Typography variant="body2" noWrap>
                        {delivery._id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {delivery.fromType === "Users" ? (
                        <>
                          <Typography variant="body2" fontWeight="bold">
                            {delivery.from.fullName}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            @{delivery.from.username}
                          </Typography>
                        </>
                      ) : (
                        <Typography variant="body2">
                          {delivery.from.name}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {delivery.toType === "Users" ? (
                        <>
                          <Typography variant="body2" fontWeight="bold">
                            {delivery.to.fullName}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            @{delivery.to.username}
                          </Typography>
                        </>
                      ) : (
                        <Typography variant="body2">
                          {delivery.to.name}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={delivery.type}
                        color="primary"
                        size="small"
                        sx={{ textTransform: "capitalize" }}
                      />
                    </TableCell>
                    <TableCell>
                      {delivery.gems.map((gem) => (
                        <Chip
                          key={gem._id}
                          label={gem.name}
                          variant="outlined"
                          size="small"
                          sx={{ mr: 1, mb: 1, textTransform: "capitalize" }}
                        />
                      ))}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={delivery.status.replace("_", " ")}
                        color={getStatusColor(delivery.status)}
                        sx={{ textTransform: "capitalize" }}
                      />
                    </TableCell>
                    <TableCell>
                      {actions.length > 0 && (
                        <>
                          <IconButton
                            aria-label="more"
                            aria-controls="delivery-menu"
                            aria-haspopup="true"
                            onClick={(e) => handleMenuOpen(e, delivery)}
                            size="small"
                          >
                            <MoreVert />
                          </IconButton>
                          <Menu
                            id="delivery-menu"
                            anchorEl={anchorEl}
                            open={open && currentDelivery?._id === delivery._id}
                            onClose={handleMenuClose}
                          >
                            {actions.map((action) => (
                              <MenuItem
                                key={action.status}
                                onClick={() =>
                                  handleStatusUpdate(action.status)
                                }
                                disabled={action.disabled}
                              >
                                {action.label}
                              </MenuItem>
                            ))}
                          </Menu>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={total}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

DeliveryTable.propTypes = {
  status: PropTypes.string,
  type: PropTypes.string,
};

export default DeliveryTable;
