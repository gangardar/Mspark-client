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
  Chip
} from '@mui/material';
import PropTypes from 'prop-types';

const UserTableTwo = ({ users, pagination, onPageChange, onLimitChange,role, onRoleFilterChange, isLoading }) => {
  const { page, limit, total } = pagination;

  const handleChangePage = (event, newPage) => {
    onPageChange(newPage + 1); // MUI uses 0-based index, API uses 1-based
  };

  const handleChangeRowsPerPage = (event) => {
    onLimitChange(parseInt(event.target.value, 10));
    onPageChange(1); // Reset to first page when changing page size
  };
  const newRole = role.charAt(0).toUpperCase() + role.split('').splice(1).join('');
  const isMerchant = role === "merchant";

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
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
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip 
                      label={user.role} 
                      color={
                        user.role === 'admin' ? 'primary' : 
                        user.role === 'merchant' ? 'secondary' : 'default'
                      } 
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={user.isDeleted ? 'Inactive' : 'Active'} 
                      color={user.isDeleted ? 'error' : 'success'} 
                    />
                  </TableCell>
                  <TableCell>
                    {user.idProof?.length > 0 ? user.idProof.join(', ') : 'None'}
                  </TableCell>
                  {isMerchant && <TableCell>
                    {user?.wallet?.totalAmount || "NA"}
                  </TableCell>}
                  <TableCell>
                    {user.address ? 
                      `${user.address.houseNo}, ${user.address.street}, ${user.address.city}` : 
                      'N/A'}
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
      role: PropTypes.oneOf(['admin', 'merchant', 'bidder']).isRequired,
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