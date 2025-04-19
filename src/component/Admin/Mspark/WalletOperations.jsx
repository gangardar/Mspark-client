import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Alert,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useContext, useState, useEffect } from "react";
import SnackbarContext from "../../../context/SnackbarContext";
import useSyncLedger from "../../../react-query/services/hooks/mspark/useSyncLedger";
import useAddWalletOnAccount from "../../../react-query/services/hooks/mspark/useAddWalletOnAccount";
import PropTypes from "prop-types";

function WalletOperations({ mspark }) {
  const { showSnackbar } = useContext(SnackbarContext);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [newWalletAddress, setNewWalletAddress] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const {
    mutateAsync: syncWallet,
    isPending: isSyncing,
    isError: errorSyncing,
    error: syncError
  } = useSyncLedger();

  const {
    mutateAsync: updateWallet,
    isPending: isUpdating,
    isError: errorUpdating,
    error: updateError
  } = useAddWalletOnAccount();

  // Initialize form when account selection changes
  useEffect(() => {
    if (selectedAccount) {
      const account = mspark.accounts.find(acc => acc._id === selectedAccount);
      setNewWalletAddress(account?.walletAddress || "");
    }
  }, [selectedAccount, mspark.accounts]);

  const handleSync = async () => {
    try {
      await syncWallet();
      showSnackbar("Wallet Synced Successfully!", "success");
    } catch (error) {
      showSnackbar(
        error?.response?.data?.message || 
        error?.message || 
        "Failed to sync wallet", 
        "error"
      );
    }
  };

  const handleUpdateWallet = async () => {
    try {
      console.log(selectedAccount)
      await updateWallet({
        id: selectedAccount,
        walletAddress: newWalletAddress
      });
      showSnackbar("Wallet address updated successfully!", "success");
      setIsEditing(false);
    } catch (error) {
      showSnackbar(
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update wallet address",
        "error"
      );
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Wallet Operations
        </Typography>

        {errorSyncing && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {syncError?.response?.data?.message ||
              syncError?.message ||
              "Failed to sync wallets"}
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Sync Wallet Balances
          </Typography>
          <Button
            variant="contained"
            onClick={handleSync}
            disabled={isSyncing}
            startIcon={isSyncing ? <CircularProgress size={20} /> : null}
          >
            Sync Now
          </Button>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Update Wallet Address
          </Typography>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Select Account</InputLabel>
            <Select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              label="Select Account"
              disabled={isEditing && isUpdating}
            >
              {mspark.accounts.map((account) => (
                <MenuItem key={account._id} value={account._id}>
                  {account.title} ({account.symbol}) - {account.balance}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedAccount && (
            <>
              <TextField
                label="New Wallet Address"
                value={newWalletAddress}
                onChange={(e) => setNewWalletAddress(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
                disabled={!isEditing || isUpdating}
              />

              {errorUpdating && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {updateError?.response?.data?.message ||
                    updateError?.message ||
                    "Failed to update wallet address"}
                </Alert>
              )}

              {!isEditing ? (
                <Button 
                  variant="contained" 
                  onClick={() => setIsEditing(true)}
                  disabled={!selectedAccount}
                >
                  Edit Wallet Address
                </Button>
              ) : (
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button 
                    variant="outlined"
                    onClick={() => {
                      setIsEditing(false);
                      // Reset to original value
                      const account = mspark.accounts.find(acc => acc._id === selectedAccount);
                      setNewWalletAddress(account?.walletAddress || "");
                    }}
                    disabled={isUpdating}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="contained" 
                    onClick={handleUpdateWallet}
                    disabled={isUpdating || !newWalletAddress}
                    startIcon={isUpdating ? <CircularProgress size={20} /> : null}
                  >
                    Update Address
                  </Button>
                </Box>
              )}
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

WalletOperations.propTypes = {
  mspark: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['primary', 'secondary']).isRequired,
    platformFee: PropTypes.string.isRequired,
    verificationFee: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
    totalAmount: PropTypes.shape({
      currency: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    }).isRequired,
    address: PropTypes.shape({
      country: PropTypes.string,
      state: PropTypes.string,
      city: PropTypes.string,
      street: PropTypes.string,
      houseNo: PropTypes.string,
      postalcode: PropTypes.string
    }),
    accounts: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        symbol: PropTypes.string.isRequired,
        balance: PropTypes.string.isRequired,
        converted: PropTypes.shape({
          currency: PropTypes.string,
          rate: PropTypes.number,
          value: PropTypes.any,
          error: PropTypes.string
        })
      })
    ).isRequired
  }).isRequired
};

export default WalletOperations;