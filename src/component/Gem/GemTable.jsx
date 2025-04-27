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
  Modal,
  Box,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { MoreVert, AssignmentInd, Verified } from "@mui/icons-material";
import PropTypes from "prop-types";
import { useContext, useState } from "react";
import AuthContext from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import useGemAssignToMe from "../../react-query/services/hooks/gems/useGemAssignToMe";
import { useNavigate } from "react-router-dom";
import GemDetailedView from "./GemDetailedView";
import SnackbarContext from "../../context/SnackbarContext";

const GemTable = ({ data, refetch }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGem, setSelectedGem] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const { showSnackbar } = useContext(SnackbarContext);
  const { isValid } = useContext(AuthContext);
  const user = jwtDecode(isValid.token);
  const { mutateAsync: assignToMe, isLoading } = useGemAssignToMe();
  const navigate = useNavigate();

  const handleAssign = async () => {
    try {
      await assignToMe(selectedGem);
      showSnackbar("Gem assigned successfully!");
      refetch()
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || "Failed to assign gem",
        "error"
      );
      console.log(error)
    } finally {
      handleMenuClose();
    }
  };

  const handleVerify = () => {
    navigate(`/admin/gems/verify/${selectedGem._id}`);
    refetch()
    handleMenuClose();
  };

  const handleShowCertificate = (gem) => {
    setSelectedGem(gem);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedGem(null);
  };

  const handleMenuOpen = (event, gem) => {
    setAnchorEl(event.currentTarget);
    setSelectedGem(gem);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedGem(null);
  };

  const renderDeliveryStatus = (gem) => {
    if (!gem?.deliveries?.length) {
      if (user.role === "merchant") {
        return (
          <Button
            variant="outlined"
            size="small"
            color="primary"
            onClick={() =>
              navigate(`/dashboard/${user.username}/deliveries/create`)
            }
            sx={{
              py: 0.5,
              px: 1.5,
              fontSize: "0.75rem",
              textTransform: "none",
            }}
          >
            Deliver to Mspark
          </Button>
        );
      }
      return "Not delivered yet";
    }
    const lastDelivery = gem.deliveries[gem.deliveries.length - 1];
    return `${lastDelivery.status} ${lastDelivery.type} delivery`;
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
              <TableCell>Delivery Status</TableCell>
              {user.role === "admin" && <TableCell>Assigned To</TableCell>}
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
                <TableCell>{renderDeliveryStatus(gem)}</TableCell>
                {user.role === "admin" && (
                  <TableCell>
                    {gem?.verifierId?.fullName || "Unassigned"}
                  </TableCell>
                )}
                <TableCell>
                  {gem?.status !== "pending" ? (
                    <Button
                      variant="text"
                      color="primary"
                      onClick={() => handleShowCertificate(gem)}
                    >
                      Certificate
                    </Button>
                  ) : (
                    "Yet To Verify"
                  )}
                </TableCell>
                <TableCell>
                  <IconButton
                    aria-label="actions"
                    onClick={(e) => handleMenuOpen(e, gem)}
                  >
                    <MoreVert />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {(() => {
          // Extract delivery verification logic once
          const hasValidDelivery =
            selectedGem?.deliveries?.length > 0 &&
            selectedGem.deliveries[selectedGem.deliveries.length - 1].type ===
              "verification" &&
            selectedGem.deliveries[selectedGem.deliveries.length - 1].status ===
              "delivered";

          const deliveryTooltip = hasValidDelivery
            ? ""
            : "Gem must be delivered for verification first";

          return (
            <>
              {user.role === "admin" && !selectedGem?.verifierId && (
                <Tooltip title={deliveryTooltip}>
                  <span>
                    <MenuItem
                      onClick={handleAssign}
                      disabled={isLoading || !hasValidDelivery}
                    >
                      <AssignmentInd fontSize="small" sx={{ mr: 1 }} />
                      {isLoading ? "Assigning..." : "Assign to me"}
                    </MenuItem>
                  </span>
                </Tooltip>
              )}

              {user.role === "admin" &&
                selectedGem?.verifierId &&
                selectedGem?.status === "pending" && (
                  <Tooltip title={deliveryTooltip}>
                    <span>
                      <MenuItem
                        onClick={handleVerify}
                        disabled={!hasValidDelivery}
                      >
                        <Verified fontSize="small" sx={{ mr: 1 }} />
                        Verify
                      </MenuItem>
                    </span>
                  </Tooltip>
                )}
              <Tooltip title={selectedGem?.status === "pending" ? "Certificate available only after verification." : ''}>
                <span>
                  <MenuItem disabled={selectedGem?.status === "pending"} onClick={() => handleShowCertificate(selectedGem)}>
                    View Certificate
                  </MenuItem>
                </span>
              </Tooltip>
              
            </>
          );
        })()}
      </Menu>

      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="certificate-modal"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            maxWidth: "800px",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          {selectedGem && <GemDetailedView gem={selectedGem} />}
          <Button onClick={handleCloseModal} sx={{ mt: 2 }} variant="contained">
            Close
          </Button>
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
        status: PropTypes.string.isRequired,
        merchantId: PropTypes.shape({
          fullName: PropTypes.string,
        }),
        deliveries: PropTypes.array,
        verifierId: PropTypes.shape({
          fullName: PropTypes.string,
        }),
      })
    ),
  }),
  refetch : PropTypes.func.isRequired
};

export default GemTable;
