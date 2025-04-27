import { Cancel, DeleteForever, MoreVert, Restore } from "@mui/icons-material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Typography,
  Box,
  CircularProgress,
  TextField,
  MenuItem,
  Chip,
  IconButton,
  Menu,
} from "@mui/material";
import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";
import useSoftDelete from "../../react-query/services/hooks/users/useSoftDelete";
import SnackbarContext from "../../context/SnackbarContext";
import useDeleteUser from "../../react-query/services/hooks/users/useDeleteUser";
import useRestoreUser from "../../react-query/services/hooks/users/useRestoreUser";

const UserTableTwo = ({
  users,
  pagination,
  onPageChange,
  onLimitChange,
  role,
  onRoleFilterChange,
  isLoading,
}) => {
  const { page, limit, total } = pagination;
  const [selectedUser, setSelectedUser] = useState(null);
  const [userData, setUserData] = useState(users)
  const [anchorEl, setAnchorEl] = useState(null);
  const {mutateAsync : softDeleteUser} = useSoftDelete()
  const {mutateAsync: completeDeleteUser} = useDeleteUser();
  const {mutateAsync: restoreUser} = useRestoreUser();
  const {showSnackbar} = useContext(SnackbarContext)

  useEffect(() => {
    setUserData(users)
  },[users])

  const handleChangePage = (event, newPage) => {
    onPageChange(newPage + 1); // MUI uses 0-based index, API uses 1-based
  };

  const handleChangeRowsPerPage = (event) => {
    onLimitChange(parseInt(event.target.value, 10));
    onPageChange(1); // Reset to first page when changing page size
  };

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleSoftDeleteUser = async () => {
    if (selectedUser && !selectedUser.isDeleted) {
      try {
        const response = await softDeleteUser(selectedUser._id)
        if(response.data.success){
          showSnackbar("Successfully deleted", "success");
          setUserData(userData.map(user => 
            user._id === response.data.data._id 
              ? { ...user, isDeleted: true } 
              : user
          ));
        }
      } catch (err) {
        showSnackbar(err?.response?.data?.message, "error");
      }
    }
    handleMenuClose();
  };

  const handleDeleteUser = async () => {
    if (selectedUser && !selectedUser.isDeleted) {
      try{
        console.log("delete")
        const response = await completeDeleteUser(selectedUser._id)
        if(response?.data?.success){
          showSnackbar("Completely deleted the user", "success");
          setUserData(userData.filter(user => user._id !== response.data.data._id))
        }
      }catch(err){
        showSnackbar(err?.response?.data?.message, "error");
      }
    }
    handleMenuClose();
  };

  const handleRestoreUser = async () => {
    if (selectedUser && selectedUser.isDeleted) {
      try {
        const response = await restoreUser(selectedUser._id);
        if (response?.data?.success) {
          showSnackbar("User Restored Successfully!", "success");
          // Update the users array
          setUserData(userData.map(user => 
            user._id === response.data.data._id 
              ? { ...user, isDeleted: false } 
              : user
          ));
        }
      } catch (err) {
        showSnackbar(err?.response?.data?.message, "error");
      }
    }
    handleMenuClose();
  };

  const newRole =
    role.charAt(0).toUpperCase() + role.split("").splice(1).join("");
  const isMerchant = role === "merchant";

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6">{newRole}</Typography>
        <TextField
          select
          label="Filter by Role"
          defaultValue={role}
          value={role}
          onChange={(e) => onRoleFilterChange(e.target.value)}
          size="small"
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="all">All Roles</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="merchant">Merchant</MenuItem>
          <MenuItem value="bidder">Bidder</MenuItem>
        </TextField>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>ID Proof</TableCell>
              {isMerchant && <TableCell>Total Earning</TableCell>}
              <TableCell>Address</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : userData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              userData.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.role}
                      color={
                        user.role === "admin"
                          ? "primary"
                          : user.role === "merchant"
                          ? "secondary"
                          : "default"
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.isDeleted ? "Inactive" : "Active"}
                      color={user.isDeleted ? "error" : "success"}
                    />
                  </TableCell>
                  <TableCell>
                    {user.idProof?.length > 0
                      ? user.idProof.join(", ")
                      : "None"}
                  </TableCell>
                  {isMerchant && (
                    <TableCell>{user?.wallet?.totalAmount || "NA"}</TableCell>
                  )}
                  <TableCell>
                    {user.address
                      ? `${user.address.houseNo}, ${user.address.street}, ${user.address.city}`
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      aria-label="more"
                      aria-controls="user-menu"
                      aria-haspopup="true"
                      onClick={(e) => handleMenuOpen(e, user)}
                    >
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={total}
        rowsPerPage={limit}
        page={page - 1} // Convert to 0-based for MUI
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Action Menu */}
      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={handleSoftDeleteUser}
          sx={{ display: !selectedUser?.isDeleted ? "" : "none" }}
          disabled={selectedUser?.isDeleted}
        >
          <Cancel fontSize="small" sx={{ mr: 1 }} color="warning"/>
          <Typography color="warning">Soft Delete</Typography>
        </MenuItem>
        <MenuItem
          onClick={handleRestoreUser}
          sx={{ display: selectedUser?.isDeleted ? "" : "none" }}
        >
          <Restore fontSize="small" color="success" sx={{ mr: 1 }} />
          <Typography color="success">Restore</Typography> 
        </MenuItem>
        <MenuItem
          onClick={handleDeleteUser}
        >
          <DeleteForever fontSize="small" color="error" sx={{ mr: 1 }} />
          <Typography color="red">Delete</Typography> 
        </MenuItem>
      </Menu>

    </Paper>
  );
};

UserTableTwo.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      fullName: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      role: PropTypes.oneOf(["admin", "merchant", "bidder"]).isRequired,
      isDeleted: PropTypes.bool.isRequired,
      idProof: PropTypes.arrayOf(PropTypes.string),
      address: PropTypes.shape({
        houseNo: PropTypes.string,
        street: PropTypes.string,
        city: PropTypes.string,
        state: PropTypes.string,
        country: PropTypes.string,
        postalcode: PropTypes.string,
      }),
    })
  ).isRequired,
  role: PropTypes.string,
  pagination: PropTypes.shape({
    page: PropTypes.number.isRequired,
    limit: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
  }).isRequired,
  onPageChange: PropTypes.func.isRequired,
  onLimitChange: PropTypes.func.isRequired,
  onRoleFilterChange: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default UserTableTwo;
