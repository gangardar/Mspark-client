import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  MenuItem,
} from "@mui/material";
import { useContext, useState } from "react";
import SnackbarContext from "../../context/SnackbarContext";
import useAddAddress from "../../react-query/services/hooks/users/useAddAddress";
import { countryList } from "../../resources/countryList";
import PropTypes from "prop-types";

const AddressForm = ({refetch}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { showSnackbar } = useContext(SnackbarContext);
  const { mutateAsync: createAddress } = useAddAddress();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({});

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      await createAddress({ address: data })
        .then((res) => {
          showSnackbar(res?.data?.data?.message);
          setSuccess("Address added successfully!");
          reset();
          refetch();
        })
        .catch((err) => {
          showSnackbar(
            err?.response?.data?.message || "Something went wrong!",
            "error"
          );
          setError(err?.response?.data?.message || "Failed to add address");
        });
    } catch (err) {
      setError(err.message || "Failed to add address");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto" }}>
      <Card>
        <CardHeader title="Add New Address" />
        <Divider />
        <CardContent>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                flexWrap: "wrap",
                gap: 3,
                mb: 3,
              }}
            >
              {/* Country */}
              <Box sx={{ flex: 1, minWidth: { md: "45%" } }}>
                <TextField
                  select
                  fullWidth
                  label="Country"
                  {...register("country", {
                    required: "Country is required",
                  })}
                  error={!!errors.country}
                  helperText={errors.country?.message}
                >
                  {countryList.map((country) => (
                    <MenuItem key={country} value={country}>
                      {country}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              {/* State */}
              <Box sx={{ flex: 1, minWidth: { md: "45%" } }}>
                <TextField
                  fullWidth
                  label="State/Province"
                  {...register("state", {
                    required: "State is required",
                    min: {
                      value: 2,
                      message: "Enter a valid State",
                    },
                    max: {
                      value: 100,
                      message: "Too long! Enter a valid State",
                    }
                  })}
                  error={!!errors.state}
                  helperText={errors.state?.message}
                />
              </Box>

              {/* City */}
              <Box sx={{ flex: 1, minWidth: { md: "45%" } }}>
                <TextField
                  fullWidth
                  label="City"
                  {...register("city", {
                    required: "City is required",
                    min : {
                      value : 2,
                      message : "Enter a valid city."
                    },
                    max : {
                      value : 100,
                      message : "Too Long, Enter a valid city."
                    }
                  })}
                  error={!!errors.city}
                  helperText={errors.city?.message}
                />
              </Box>

              {/* Postal Code */}
              <Box sx={{ flex: 1, minWidth: { md: "45%" } }}>
                <TextField
                  fullWidth
                  label="Postal Code"
                  {...register("postalcode", {
                    required: "Postal code is required",
                    minLength : {
                      value : 5,
                      message: "Postal code should be between 5 - 9"
                    },
                    maxLength : {
                      value : 9,
                      message: "Postal code should be between 5 - 9 numbers"
                    }
                  })}
                  error={!!errors.postalcode}
                  helperText={errors.postalcode?.message}
                />
              </Box>

              {/* Street */}
              <Box sx={{ width: "100%" }}>
                <TextField
                  fullWidth
                  label="Street Address"
                  {...register("street", {
                    required: "Street address is required",
                  })}
                  error={!!errors.street}
                  helperText={errors.street?.message}
                />
              </Box>

              {/* House Number */}
              <Box sx={{ flex: 1, minWidth: { md: "45%" } }}>
                <TextField
                  fullWidth
                  label="House/Apartment Number"
                  {...register("houseNo", {
                    required: "House number is required",
                  })}
                  error={!!errors.houseNo}
                  helperText={errors.houseNo?.message}
                />
              </Box>

              {/* Submit Button */}
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  color="primary"
                  variant="contained"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <CircularProgress size={24} sx={{ mr: 1 }} />
                      Adding...
                    </>
                  ) : (
                    "Add Address"
                  )}
                </Button>
              </Box>
            </Box>
          </form>
        </CardContent>
      </Card>

      <Card sx={{ mt: 3 }}>
        <CardHeader title="Address Verification" />
        <Divider />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            Please ensure all address information is correct before submitting.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

AddressForm.propTypes = {
  refetch : PropTypes.func.isRequired
}

export default AddressForm;
