import { Box, Typography, TextField, Stack, Paper, Button } from "@mui/material";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useUpdateFee } from "../../../react-query/services/hooks/mspark/useUpdateFee";
import PropTypes from "prop-types";
import SnackbarContext from "../../../context/SnackbarContext";

function MsparkSettings({ mspark, refetch }) {
  const { showSnackbar } = useContext(SnackbarContext);
  const { mutate: updateFees, isLoading } = useUpdateFee();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty, errors },
  } = useForm({
    defaultValues: {
      platformFee: "0.05", // Temporary defaults
      verificationFee: "0.02",
    },
  });

  // Reset form with actual values when mspark loads
  useEffect(() => {
    if (mspark) {
      reset({
        platformFee: mspark.platformFee,
        verificationFee: mspark.verificationFee,
      });
    }
  }, [mspark, reset]);

  const onSubmit = (data) => {
    console.log(data);
    updateFees({id : mspark?._id,fees:data}, {
      onSuccess: () => {
        showSnackbar("Fees updated successfully");
        reset(data, { keepValues: true }); // Reset form but keep current values
        refetch()
      },
      onError: (error) => {
        showSnackbar(
          error.response?.data?.message || "Failed to update fees",
          'error'
        );
      },
    });
  };

  const handleCancel = () => {
    reset({
      platformFee: mspark.platformFee,
      verificationFee: mspark.verificationFee,
    });
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Fee Settings
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Platform Fee (%)"
            {...register("platformFee", {
              required: "Platform fee is required",
              min: {
                value: 0,
                message: "Fee cannot be negative"
              },
              max: {
                value: 1,
                message: "Fee cannot exceed 100%"
              },
              valueAsNumber: true,
            })}
            type="number"
            error={!!errors.platformFee}
            helperText={errors.platformFee?.message || "Percentage as decimal (e.g., 0.05 for 5%)"}
            inputProps={{
              step: "0.01",
              min: "0",
              max: "1",
            }}
          />

          <TextField
            fullWidth
            label="Verification Fee (%)"
            {...register("verificationFee", {
              required: "Verification fee is required",
              min: {
                value: 0,
                message: "Fee cannot be negative"
              },
              max: {
                value: 1,
                message: "Fee cannot exceed 100%"
              },
              valueAsNumber: true,
            })}
            type="number"
            error={!!errors.verificationFee}
            helperText={errors.verificationFee?.message || "Percentage as decimal (e.g., 0.02 for 2%)"}
            inputProps={{
              step: "0.01",
              min: "0",
              max: "1",
            }}
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleCancel}
              disabled={!isDirty || isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!isDirty || isLoading}
            >
              {isLoading ? "Updating..." : "Update Fees"}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
}

// ... (keep your existing propTypes)

MsparkSettings.propTypes = {
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
  }).isRequired,
  refetch : PropTypes.func
};

export default MsparkSettings;