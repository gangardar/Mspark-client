import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Button,
  TextField,
  Chip,
  Autocomplete,
  CircularProgress,
  MenuItem,
  Typography,
  Grid2,
} from "@mui/material";
import useAuth from "../../context/useAuth";
import { useMemo } from "react";
import PropTypes from "prop-types";
import { EmptyState } from "../common/EmptyState";

const DeliveryForm = ({
  onSubmit,
  availableGems = [],
  availableUsers = [],
  loading = false,
}) => {
  const { isValid, userData } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm();

  // Filter gems based on user role
  const filteredGems = useMemo(() => {
    if (!userData?.role) return [];

    switch (userData.role) {
      case "merchant":
        return availableGems?.filter(
          (gem) =>
            gem.merchantId?._id === userData._id &&
            gem.status === "pending" &&
            (!gem.deliveries.length || gem.deliveries[0]?.to === userData._id)
        );
      case "bidder":
        return availableGems?.filter(
          (gem) =>
            ["sold", "rejected"].includes(gem.status) &&
            gem.deliveries[0]?.to === userData._id
        );
      case "admin":
        return availableGems?.filter((gem) => !gem.isDeleted);
      default:
        return [];
    }
  }, [availableGems, userData]);

  if (!isValid?.status) {
    return <Typography>Please log in</Typography>;
  }
  if (!filteredGems.length) {
    return (
      <EmptyState
        title={"No Gem Found!"}
        description={
          "Currently no gem is listed to be shipped! Try again later."
        }
      />
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
      <Grid2 container spacing={3} >
        {/* Gems Selection - Always required */}
        <Grid2 size={12}>
          <Controller
            name="gems"
            control={control}
            rules={{ required: "At least one gem is required" }}
            render={({ field }) => (
              <Autocomplete
                multiple
                options={filteredGems}
                getOptionLabel={(option) => option.name}
                value={field.value || []}
                onChange={(_, data) => field.onChange(data)}
                isOptionEqualToValue={(option, value) =>
                  option._id === value._id
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Gems"
                    error={!!errors.gems}
                    helperText={errors.gems?.message}
                    fullWidth
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option.name}
                      {...getTagProps({ index })}
                      key={option._id}
                    />
                  ))
                }
              />
            )}
          />
        </Grid2>

        {/* Admin-specific fields */}
        {userData?.role === "admin" && (
          <>
            <Grid2 size={{xs : 12, sm : 6}}>
              <Controller
                name="type"
                control={control}
                rules={{ required: "Type is required for admin" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label="Delivery Type"
                    error={!!errors.type}
                    helperText={errors.type?.message}
                  >
                    <MenuItem value="return">Return</MenuItem>
                    <MenuItem value="sale">Sale</MenuItem>
                  </TextField>
                )}
              />
            </Grid2>
            <Grid2 size={{xs: 12, sm : 6}}>
              <Controller
                name="to"
                control={control}
                rules={{ required: "Recipient is required for admin" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label="Recipient User"
                    error={!!errors.to}
                    helperText={errors.to?.message}
                  >
                    {availableUsers?.map((user) => (
                      <MenuItem key={user._id} value={user._id}>
                        {user.fullName} (@{user.username})
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid2>
          </>
        )}

        {/* Tracking Info - Now required for all */}
        <Grid2 size= {{xs: 12, sm : 6}}>
          <Controller
            name="deliveryService"
            control={control}
            rules={{ required: "Delivery service is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Delivery Service"
                placeholder="e.g., FedEx, UPS"
                error={!!errors.deliveryService}
                helperText={errors.deliveryService?.message}
              />
            )}
          />
        </Grid2>
        <Grid2 size={{xs: 12, sm : 6}}>
          <Controller
            name="trackingNumber"
            control={control}
            rules={{ required: "Tracking number is required" }}
            render={({ field }) => (
              <TextField 
                {...field}
                fullWidth 
                label="Tracking Number"
                error={!!errors.trackingNumber}
                helperText={errors.trackingNumber?.message}
              />
            )}
          />
        </Grid2>

        <Grid2 small={{xs: 12}} flexGrow={1}>
          <Controller
            name="trackingUrl"
            control={control}
            rules={{ 
              required: "Tracking URL is required",
              pattern: {
                value: /^(https?:\/\/)?([\da-z\\.-]+)\.([a-z\\.]{2,6})([\\/\w \\.-]*)*\/?$/,
                message: "Please enter a valid URL"
              }
            }}
            render={({ field }) => (
              <TextField 
                {...field}
                fullWidth 
                label="Tracking URL"
                placeholder="https://example.com/tracking"
                error={!!errors.trackingUrl}
                helperText={errors.trackingUrl?.message}
              />
            )}
          />
        </Grid2>

        <Grid2 size={{xs:12}}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ 
              mt: 2, 
              mb: 2,
              py: 1.5,
              fontSize: "1rem"
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Create Delivery"
            )}
          </Button>
        </Grid2>
      </Grid2>
    </Box>
  );
};

DeliveryForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  availableGems: PropTypes.arrayOf(PropTypes.object),
  availableUsers: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool,
};

export default DeliveryForm;