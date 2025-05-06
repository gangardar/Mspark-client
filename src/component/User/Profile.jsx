import { useContext, useState, useCallback, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  TextField,
  Button,
  Divider,
  Chip,
  IconButton,
  Paper,
  Tabs,
  Tab,
  Grid,
  InputAdornment,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera as PhotoCameraIcon,
  LocationOn as LocationIcon,
  AccountBalanceWallet as WalletIcon,
  Verified as VerifiedIcon,
  Payment as PaymentIcon,
} from "@mui/icons-material";
import PropTypes from "prop-types";
import AddWalletForm from "../Wallet/AddWalletForm";
import AddressForm from "./AddressForm";
import { EmptyState } from "../common/EmptyState";
import useUpdateProfile from "../../react-query/services/hooks/users/useUpdateProfile";
import SnackbarContext from "../../context/SnackbarContext";
import useUpdateAddress from "../../react-query/services/hooks/users/useUpdateAddress";

const Profile = ({ user, refetch }) => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const [isEditing, setIsEditing] = useState(false);
  const { mutateAsync: updateProfile } = useUpdateProfile();
  const {mutateAsync: updateAddress} = useUpdateAddress()
  const { showSnackbar } = useContext(SnackbarContext);
  const [activeTab, setActiveTab] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  // Memoize the initial user data to prevent unnecessary recalculations
  const initialUserData = useMemo(
    () => ({
      ...user,
      address: { ...user.address },
      wallet: { ...user.wallet },
    }),
    [user]
  );

  const [editedUser, setEditedUser] = useState(initialUserData);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  useEffect(() => {
    return () => {
      // Clean up any blob URLs when component unmounts
      if (editedUser.profile?.startsWith('blob:')) {
        URL.revokeObjectURL(editedUser.profile);
      }
    };
  }, [editedUser.profile]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      if (activeTab === 0) {
        // Profile update logic
        const formData = new FormData();
        formData.append('fullName', editedUser.fullName);
        
        if (editedUser.profileFile) {
          formData.append('profile', editedUser.profileFile);
        } else if (editedUser.profile?.startsWith('blob:')) {
          const response = await fetch(editedUser.profile);
          const blob = await response.blob();
          formData.append('profile', blob, 'profile.jpg');
        }
        
        const response = await updateProfile({
          id: user?._id,
          data: formData
        });
        
        showSnackbar(response?.message, 'success');
      } 
      else if (activeTab === 1 && editedUser.address) {
        // Address update logic
        const addressData = {
          country: editedUser.address.country,
          state: editedUser.address.state,
          city: editedUser.address.city,
          street: editedUser.address.street,
          houseNo: editedUser.address.houseNo,
          postalcode: editedUser.address.postalcode
        };

        const response = await updateAddress({
          id: editedUser.address._id, // or user.address._id
          data: addressData
        });

        showSnackbar(response?.message || 'Address updated successfully', 'success');
      }

      await refetch(); // Refresh data after successful update
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving:", error);
      showSnackbar(
        error?.response?.data?.message || "Something went wrong!", 
        'error'
      );
    } finally {
      setIsSaving(false);
    }
  }, [
    activeTab, 
    editedUser, 
    updateProfile, 
    updateAddress, 
    user?._id, 
    showSnackbar, 
    refetch
  ]);

  const handleCancel = useCallback(() => {
    setEditedUser(initialUserData);
    setIsEditing(false);
  }, [initialUserData]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleAddressChange = useCallback((e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  }, []);

  // const handleWalletChange = useCallback((e) => {
  //   const { name, value } = e.target;
  //   setEditedUser(prev => ({
  //     ...prev,
  //     wallet: {
  //       ...prev.wallet,
  //       [name]: value,
  //     },
  //   }));
  // }, []);

  const handleTabChange = useCallback((event, newValue) => {
    setActiveTab(newValue);
  }, []);

  const handlePhotoChange = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    // Create a preview URL for immediate display
    const previewUrl = URL.createObjectURL(file);
    setEditedUser(prev => ({
      ...prev,
      profile: previewUrl,
      profileFile: file  // Store the actual file for upload
    }));
  }, []);

  const renderBasicInfoTab = () => (
    <Box>
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        Personal Information
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Full Name"
            name="fullName"
            value={editedUser.fullName || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            disabled={!isEditing}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EditIcon color={isEditing ? "primary" : "disabled"} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Username"
            name="username"
            value={editedUser.username || ""}
            fullWidth
            margin="normal"
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Email"
            name="email"
            value={editedUser.email || ""}
            fullWidth
            margin="normal"
            disabled
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <VerifiedIcon
                    color={user.emailVerified ? "success" : "action"}
                  />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      <Typography variant="subtitle1" fontWeight="bold" mt={3} gutterBottom>
        Identification
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {editedUser.idProof?.map((proof, index) => (
          <Chip
            key={index}
            label={proof}
            variant="outlined"
            color={isEditing ? "primary" : "default"}
            onDelete={
              isEditing
                ? () => {
                    setEditedUser((prev) => ({
                      ...prev,
                      idProof: prev.idProof.filter((_, i) => i !== index),
                    }));
                  }
                : null
            }
          />
        ))}
        {isEditing && (
          <Tooltip title="Add ID Proof">
            <IconButton size="small">
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );

  const renderAddressTab = () => {
    if (!user?.address) {
      return <AddressForm refetch={refetch} />;
    }

    return (
      <Box>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Address Information
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Country"
              name="country"
              value={editedUser.address?.country || ""}
              onChange={handleAddressChange}
              fullWidth
              margin="normal"
              disabled={!isEditing}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="State/Region"
              name="state"
              value={editedUser.address?.state || ""}
              onChange={handleAddressChange}
              fullWidth
              margin="normal"
              disabled={!isEditing}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="City"
              name="city"
              value={editedUser.address?.city || ""}
              onChange={handleAddressChange}
              fullWidth
              margin="normal"
              disabled={!isEditing}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Street"
              name="street"
              value={editedUser.address?.street || ""}
              onChange={handleAddressChange}
              fullWidth
              margin="normal"
              disabled={!isEditing}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="House Number"
              name="houseNo"
              value={editedUser.address?.houseNo || ""}
              onChange={handleAddressChange}
              fullWidth
              margin="normal"
              disabled={!isEditing}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Postal Code"
              name="postalcode"
              value={editedUser.address?.postalcode || ""}
              onChange={handleAddressChange}
              fullWidth
              margin="normal"
              disabled={!isEditing}
            />
          </Grid>
        </Grid>
      </Box>
    );
  };

  const renderWalletTab = () => {
    if (!user?.address) {
      return (
        <EmptyState
          title="First fill up address"
          description="Before you enter wallet, you need to provide address"
        />
      );
    }

    if (!user?.wallet) {
      return <AddWalletForm refetch={refetch} />;
    }

    return (
      <Box>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Wallet Information
        </Typography>
        <Typography variant="caption" color="orange">
          Wallet information cannot be changed.
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Currency"
              name="currencyTitle"
              value={editedUser.wallet?.currencyTitle || ""}
              fullWidth
              margin="normal"
              disabled
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Status"
              name="status"
              value={editedUser.wallet?.status || ""}
              fullWidth
              margin="normal"
              disabled
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Platform"
              name="platformTitle"
              value={editedUser.wallet?.platformTitle || ""}
              fullWidth
              margin="normal"
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Wallet Address"
              name="cryptoAddress"
              value={editedUser.wallet?.cryptoAddress || ""}
              fullWidth
              margin="normal"
              disabled
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PaymentIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </Box>
    );
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, md: 4 },
        maxWidth: 800,
        mx: "auto",
        borderRadius: 3,
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
        }}
      >
        {/* Left Side - Profile Picture */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minWidth: { xs: "100%", md: 200 },
          }}
        >
          <Box sx={{ position: "relative" }}>
            <Avatar
              src={
                editedUser.profile?.startsWith("blob:")
                  ? editedUser.profile
                  : editedUser.profile?.startsWith("http")
                  ? editedUser.profile
                  : `${BASE_URL}/${editedUser.profile}`
              }
              sx={{
                width: 150,
                height: 150,
                mb: 2,
                border: "3px solid",
                borderColor: "primary.main",
              }}
            />
            {isEditing && (
              <IconButton
                component="label"
                sx={{
                  position: "absolute",
                  bottom: 10,
                  right: 10,
                  bgcolor: "background.paper",
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                <PhotoCameraIcon />
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
              </IconButton>
            )}
          </Box>

          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              {editedUser.fullName}
            </Typography>
            <Chip
              label={editedUser.role === "merchant" ? "Merchant" : "Bidder"}
              color={editedUser.role === "merchant" ? "primary" : "secondary"}
              size="small"
              sx={{ mt: 1 }}
            />
          </Box>

          {!isEditing ? (
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={handleEdit}
              size="large"
              fullWidth
            >
              Edit Profile
            </Button>
          ) : (
            <Box sx={{ display: "flex", gap: 1, width: "100%" }}>
              <Button
                variant="contained"
                startIcon={
                  isSaving ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <SaveIcon />
                  )
                }
                onClick={handleSave}
                disabled={isSaving}
                fullWidth
              >
                Save
              </Button>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={handleCancel}
                fullWidth
              >
                Cancel
              </Button>
            </Box>
          )}
        </Box>

        {/* Right Side - Content */}
        <Box sx={{ flex: 1 }}>
          <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
            <Tab
              label="Basic Info"
              icon={<EditIcon fontSize="small" />}
              iconPosition="start"
            />
            <Tab
              label="Address"
              icon={<LocationIcon fontSize="small" />}
              iconPosition="start"
            />
            <Tab
              label="Wallet"
              icon={<WalletIcon fontSize="small" />}
              iconPosition="start"
            />
          </Tabs>

          <Divider sx={{ mb: 3 }} />

          {activeTab === 0 && renderBasicInfoTab()}
          {activeTab === 1 && renderAddressTab()}
          {activeTab === 2 && renderWalletTab()}
        </Box>
      </Box>
    </Paper>
  );
};

Profile.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    fullName: PropTypes.string,
    username: PropTypes.string,
    role: PropTypes.oneOf(["merchant", "bidder"]),
    profile: PropTypes.string,
    email: PropTypes.string,
    emailVerified: PropTypes.bool,
    idProof: PropTypes.arrayOf(PropTypes.string),
    isDeleted: PropTypes.bool,
    address: PropTypes.shape({
      _id: PropTypes.string,
      country: PropTypes.string,
      state: PropTypes.string,
      city: PropTypes.string,
      street: PropTypes.string,
      houseNo: PropTypes.string,
      postalcode: PropTypes.string,
      user: PropTypes.string,
      __v: PropTypes.number,
    }),
    wallet: PropTypes.shape({
      _id: PropTypes.string,
      user: PropTypes.string,
      status: PropTypes.string,
      coinGateCurrencyId: PropTypes.number,
      coinGatePlatformId: PropTypes.number,
      platformTitle: PropTypes.string,
      currencyTitle: PropTypes.string,
      currencySymbol: PropTypes.string,
      cryptoAddress: PropTypes.string,
      coinGateId: PropTypes.number,
      coinGatePayoutId: PropTypes.number,
      isDeleted: PropTypes.bool,
      createdAt: PropTypes.string,
      updatedAt: PropTypes.string,
      __v: PropTypes.number,
    }),
  }).isRequired,
  refetch: PropTypes.func.isRequired,
};

export default Profile;
