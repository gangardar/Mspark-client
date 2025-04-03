import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import PropTypes from "prop-types";

const UserTable = ({ data }) => {
  return (
    <TableContainer component={Paper} sx={{ mt: 3, p: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Full Name</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Profile</TableCell>
            <TableCell>ID Proof</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.data?.map((user) => (
            <TableRow key={user._id}>
              <TableCell>{user.fullName}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                {user.profile ? (
                  <img src={user.profile} alt="Profile" width={40} height={40} style={{ borderRadius: "50%" }} />
                ) : (
                  "N/A"
                )}
              </TableCell>
              <TableCell>{user.idProof?.length ? user.idProof.length + " Files" : "None"}</TableCell>
              <TableCell>
                <IconButton color="primary">
                  <Edit />
                </IconButton>
                <IconButton color="error">
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// PropTypes validation
UserTable.propTypes = {
data: PropTypes.shape({
        data: PropTypes.arrayOf(
            PropTypes.shape({
                _id: PropTypes.string.isRequired,
                fullName: PropTypes.string.isRequired,
                username: PropTypes.string.isRequired,
                email: PropTypes.string.isRequired,
                role: PropTypes.oneOf(["admin", "merchant", "bidder"]).isRequired,
                profile: PropTypes.string,
                idProof: PropTypes.arrayOf(PropTypes.string),
              })
        ),
    }),
  
};



export default UserTable;
