import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Modal,
  Box,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import PropTypes from "prop-types";
import { useContext, useState } from "react";
import AuthContext from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import useGemAssignToMe from "../../react-query/services/hooks/gems/useGemAssignToMe";
import { useNavigate } from "react-router-dom";
import GemDetailedView from "./GemDetailedView"; // Import the GemDetailedView component

const GemTable = ({ data }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [selectedGem, setSelectedGem] = useState(null); // State for selected gem
  const { isValid } = useContext(AuthContext);
  const user = jwtDecode(isValid.token);
  const { mutateAsync: assignToMe, isLoading, isError } = useGemAssignToMe();
  const navigate = useNavigate();

  const handleVerify = (gem) => {
    navigate(`/admin/gems/verify/${gem._id}`);
  };

  const handleAssign = async (gem) => {
    try {
      await assignToMe(gem);
      setSnackbarMessage("Gem assigned successfully!");
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage(error.message || "Failed to assign gem");
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Open modal and set selected gem
  const handleShowCertificate = (gem) => {
    setSelectedGem(gem);
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    console.log(isModalOpen)
    setIsModalOpen(false);
    setSelectedGem(null);
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ mt: 3, p: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Color</TableCell>
              <TableCell>Weight (ct)</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Merchant</TableCell>
              {user.role !== "admin" && <TableCell>Delivery Status</TableCell>}
              {user.role === "admin" && <TableCell>Assigned To</TableCell>}
              {user.role === "admin" && <TableCell>Verify</TableCell>}
              <TableCell>Certificate</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.data?.map((gem) => (
              <TableRow key={gem._id}>
                <TableCell>{gem.name}</TableCell>
                <TableCell>{gem.type}</TableCell>
                <TableCell>{gem.color}</TableCell>
                <TableCell>{gem.weight || "-"}</TableCell>
                <TableCell>{gem.status}</TableCell>
                <TableCell>{gem.merchantId?.fullName || "Unknown"}</TableCell>
                {user.role === "admin" && (
                  <TableCell>
                    {gem?.verifierId?.fullName || "Unassigned"}
                  </TableCell>
                )}
                {user.role === "admin" && !gem?.verifierId && (
                  <TableCell>
                    <Button
                      variant="text"
                      color="primary"
                      onClick={() => handleAssign(gem)}
                      disabled={isLoading || gem?.verifierId}
                      startIcon={
                        isLoading ? <CircularProgress size={20} /> : null
                      }
                    >
                      {isLoading ? "Assigning..." : "Assign To me"}
                    </Button>
                  </TableCell>
                )}
                {user.role === "admin" && gem?.verifierId ? (
                  <TableCell>
                    {gem?.status === "Pending" ? (
                      <Button
                        variant="text"
                        color="primary"
                        onClick={() => handleVerify(gem)}
                        disabled={isLoading}
                      >
                        Verify
                      </Button>
                    ) : (
                      "No Action"
                    )}
                  </TableCell>
                ) : (
                  "Not Assigned"
                )}
                <TableCell>
                  <Button
                    variant="text"
                    color="primary"
                    onClick={() => handleShowCertificate(gem)} // Open modal for this gem
                    disabled={isLoading}
                  >
                    Certificate
                  </Button>
                </TableCell>
                <TableCell>
                  <IconButton color="dark">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Snackbar for success/error messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={isError ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Modal for Certificate */}
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="certificate-modal"
        aria-describedby="certificate-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            maxWidth: "800px",
            maxHeight: "90vh",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            outline: "none",
            overflow: 'auto'
          }}
        >
          {selectedGem && <GemDetailedView gem={selectedGem} />}
          <Box sx={{ textAlign: "right", mt: 2 }}>
            <Button onClick={handleCloseModal} variant="contained">
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

GemTable.propTypes = {
  data: PropTypes.shape({
    data: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        type: PropTypes.string,
        color: PropTypes.string.isRequired,
        weight: PropTypes.number,
        shape: PropTypes.string,
        rarity: PropTypes.string,
        status: PropTypes.string.isRequired,
        price: PropTypes.number,
      })
    ),
  }),
};

export default GemTable;
