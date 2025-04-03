import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Stack,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Close as CloseIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";
import moment from "moment";
import PropTypes from "prop-types";
import useExtendAuction from "../../react-query/services/hooks/auctions/useExtendAuction";
import { useContext, useEffect, useState } from "react";
import SnackbarContext from "../../context/SnackbarContext";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: "500px" },
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
};

const ExtendAuctionModal = ({ open, onClose, auction, refetchAuctions }) => {
  const { showSnackbar } = useContext(SnackbarContext);
  const [endTime, setEndTime] = useState(null);
  const [error, setError] = useState("");
  const { mutateAsync: extendAuction, isLoading } = useExtendAuction();

  // Initialize with current end time when modal opens
  useEffect(() => {
    if (open && auction?.endTime) {
      setEndTime(moment(auction.endTime));
    }
  }, [open, auction]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    try {
      if (!endTime || !auction?._id) return;

      // Validate the new end time is in future
      const now = moment();
      const formattedEndTime = moment(endTime)

      if (formattedEndTime.isSameOrBefore(now)) {
        throw new Error("New end time must be in the future");
      }
      extendAuction({ id: auction._id, endTime: endTime }).then(() => {
        showSnackbar(`Date extended!`, "success");
        refetchAuctions();
      });
    } catch (err) {
      showSnackbar(err.message, "error");
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="extend-auction-modal">
      <Box sx={style}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h6" component="h2">
            <ScheduleIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            Extend Auction
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Typography variant="body1">
              Current end: {moment(auction?.endTime).format("lll")}
            </Typography>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Auction End Date & time"
                value={endTime}
                onChange={(newValue) => setEndTime(newValue)}
                minDate={new Date()}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    margin="normal"
                    error={!endTime}
                    helperText={!endTime ? "End date&time is required" : ""}
                  />
                )}
              />
            </LocalizationProvider>

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 2,
              }}
            >
              <Button onClick={onClose} color="inherit" disabled={isLoading}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading || !endTime}
                startIcon={isLoading ? <CircularProgress size={20} /> : null}
              >
                {isLoading ? "Extending..." : "Extend Auction"}
              </Button>
            </Box>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
};

ExtendAuctionModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  auction: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    endTime: PropTypes.string.isRequired,
  }),
  refetchAuctions: PropTypes.func,
};

export default ExtendAuctionModal;
