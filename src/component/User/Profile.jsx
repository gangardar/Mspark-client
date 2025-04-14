import { useState } from "react";
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
  Grid2,
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

const Profile = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    ...user,
    address: { ...user.address },
    wallet: { ...user.wallet },
  });
  const [activeTab, setActiveTab] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Saved:", editedUser);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedUser({
      ...user,
      address: { ...user.address },
      wallet: { ...user.wallet },
    });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  const handleWalletChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({
      ...prev,
      wallet: {
        ...prev.wallet,
        [name]: value,
      },
    }));
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditedUser((prev) => ({
          ...prev,
          profile: event.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
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
              src={editedUser.profile}
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

          {activeTab === 0 && (
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Personal Information
              </Typography>

              <Grid2 container spacing={2} size={12}>
                <Grid2 item xs={12} md={6}>
                  <TextField
                    label="Full Name"
                    name="fullName"
                    value={editedUser.fullName}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EditIcon
                            color={isEditing ? "primary" : "disabled"}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid2>
                <Grid2 item xs={12} md={6}>
                  <TextField
                    label="Username"
                    name="username"
                    value={editedUser.username}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    disabled={!isEditing}
                  />
                </Grid2>
                <Grid2 item xs={12}>
                  <TextField
                    label="Email"
                    name="email"
                    value={editedUser.email}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    disabled={!isEditing}
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
                </Grid2>
              </Grid2>

              <Typography
                variant="subtitle1"
                fontWeight="bold"
                mt={3}
                gutterBottom
              >
                Identification
              </Typography>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {editedUser.idProof.map((proof, index) => (
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
                              idProof: prev.idProof.filter(
                                (_, i) => i !== index
                              ),
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
          )}

          {activeTab === 1 &&
            (!user?.address ? (
              <AddressForm />
            ) : (
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Address Information
                </Typography>

                <Grid2 container spacing={2}>
                  <Grid2 xs={12} md={6}>
                    <TextField
                      label="Country"
                      name="country"
                      value={editedUser.address.country}
                      onChange={handleAddressChange}
                      fullWidth
                      margin="normal"
                      disabled={!isEditing}
                    />
                  </Grid2>
                  <Grid2 xs={12} md={6}>
                    <TextField
                      label="State/Region"
                      name="state"
                      value={editedUser.address.state}
                      onChange={handleAddressChange}
                      fullWidth
                      margin="normal"
                      disabled={!isEditing}
                    />
                  </Grid2>
                  <Grid2 xs={12} md={6}>
                    <TextField
                      label="City"
                      name="city"
                      value={editedUser.address.city}
                      onChange={handleAddressChange}
                      fullWidth
                      margin="normal"
                      disabled={!isEditing}
                    />
                  </Grid2>
                  <Grid2 xs={12} md={6}>
                    <TextField
                      label="Street"
                      name="street"
                      value={editedUser.address.street}
                      onChange={handleAddressChange}
                      fullWidth
                      margin="normal"
                      disabled={!isEditing}
                    />
                  </Grid2>
                  <Grid2 xs={12} md={6}>
                    <TextField
                      label="House Number"
                      name="houseNo"
                      value={editedUser.address.houseNo}
                      onChange={handleAddressChange}
                      fullWidth
                      margin="normal"
                      disabled={!isEditing}
                    />
                  </Grid2>
                  <Grid2 xs={12} md={6}>
                    <TextField
                      label="Postal Code"
                      name="postalcode"
                      value={editedUser.address.postalcode}
                      onChange={handleAddressChange}
                      fullWidth
                      margin="normal"
                      disabled={!isEditing}
                    />
                  </Grid2>
                </Grid2>
              </Box>
            ))}

          {activeTab === 2 &&
            (!user?.wallet ? (
              <AddWalletForm />
            ) : (
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Wallet Information
                </Typography>
                <Typography variant="caption" color="orange">
                  Wallet information cannot be change.
                </Typography>

                <Grid2 container spacing={2}>
                  <Grid2 item xs={12} md={6}>
                    <TextField
                      label="Currency"
                      name="currencyTitle"
                      value={editedUser.wallet.currencyTitle}
                      onChange={handleWalletChange}
                      fullWidth
                      margin="normal"
                      disabled
                    />
                  </Grid2>
                  <Grid2 item xs={12} md={6}>
                    <TextField
                      label="Status"
                      name="status"
                      value={editedUser.wallet.status}
                      onChange={handleWalletChange}
                      fullWidth
                      margin="normal"
                      disabled
                    />
                  </Grid2>
                  <Grid2 item xs={12} md={6}>
                    <TextField
                      label="Platform"
                      name="platformTitle"
                      value={editedUser.wallet.platformTitle}
                      onChange={handleWalletChange}
                      fullWidth
                      margin="normal"
                      disabled
                    />
                  </Grid2>
                  <Grid2 item xs={12} width={"100%"}>
                    <TextField
                      label="Wallet Address"
                      name="cryptoAddress"
                      value={editedUser.wallet.cryptoAddress}
                      onChange={handleWalletChange}
                      fullWidth
                      margin="normal"
                      disabled
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <PaymentIcon />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Grid2>
                </Grid2>
              </Box>
            ))}
        </Box>
      </Box>
    </Paper>
  );
};

Profile.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    fullName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    role: PropTypes.oneOf(["merchant", "bidder"]).isRequired,
    profile: PropTypes.string,
    email: PropTypes.string.isRequired,
    emailVerified: PropTypes.bool,
    idProof: PropTypes.arrayOf(PropTypes.string).isRequired,
    isDeleted: PropTypes.bool,
    address: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      country: PropTypes.string.isRequired,
      state: PropTypes.string.isRequired,
      city: PropTypes.string.isRequired,
      street: PropTypes.string.isRequired,
      houseNo: PropTypes.string.isRequired,
      postalcode: PropTypes.string.isRequired,
      user: PropTypes.string.isRequired,
      __v: PropTypes.number,
    }).isRequired,
    wallet: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      user: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      coinGateCurrencyId: PropTypes.number.isRequired,
      coinGatePlatformId: PropTypes.number.isRequired,
      platformTitle: PropTypes.string.isRequired,
      currencyTitle: PropTypes.string.isRequired,
      currencySymbol: PropTypes.string.isRequired,
      cryptoAddress: PropTypes.string.isRequired,
      coinGateId: PropTypes.number.isRequired,
      coinGatePayoutId: PropTypes.number.isRequired,
      isDeleted: PropTypes.bool.isRequired,
      createdAt: PropTypes.string.isRequired,
      updatedAt: PropTypes.string.isRequired,
      __v: PropTypes.number,
    }).isRequired,
  }).isRequired,
};

export default Profile;
