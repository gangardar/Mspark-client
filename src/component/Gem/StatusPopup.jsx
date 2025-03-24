import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import useChangeStatusToVerified from "../../react-query/services/hooks/gems/useChangeStatusToVerified";
import PropTypes from "prop-types";

// Inside the VerifyGem component
const StatusPopup = ({id, showStatusPopup, setShowStatusPopup}) => {
  const { mutateAsync: changeStatusToVerified } = useChangeStatusToVerified();
  console.log(id);

  const handleConfirm = async () => {
    try {
      // Call the mutation to change the status to "Verified"
      await changeStatusToVerified(id.id);

      // Close the popup
      setShowStatusPopup(false);

      console.log("Status changed to Verified successfully!");
    } catch (error) {
      console.error("Error changing status:", error.message);
    }
  };

  const handleCancel = () => {
    // Close the popup without changing the status
    setShowStatusPopup(false);
  };

  return (
    <Dialog open={showStatusPopup} onClose={handleCancel}>
      <DialogTitle>Change Status to Verified</DialogTitle>
      <DialogContent>
        <Typography>
          The gem has been updated successfully. Do you want to change its
          status to &quot;Verified&quot;?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleConfirm} color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Prop validation
StatusPopup.propTypes = {
    id: PropTypes.shape({
      id: PropTypes.string.isRequired, // ID can be a string or number
    }).isRequired,
    showStatusPopup: PropTypes.bool.isRequired, // Must be a boolean
    setShowStatusPopup: PropTypes.func.isRequired, // Must be a function
  };

export default StatusPopup
