import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  MenuItem,
  TextField,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { axiosInstance } from "../../react-query/services/apiClient";
import SnackbarContext from "../../context/SnackbarContext";
import useCreateWallet from "../../react-query/services/hooks/wallet/useCreateWallet";

const AddWalletForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [currencies, setCurrencies] = useState([]);
  const { showSnackbar } = useContext(SnackbarContext);
  const {
    mutateAsync: createWallet
  } = useCreateWallet();
  const [validationState, setValidationState] = useState({
    loading: false,
    valid: null,
    message: "",
  });
  const [errorFetchingCurrencies, setErrorFetchingCurrencies] = useState({
    isError: false,
    error: null,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      currencyId: "",
      platformId: "",
      cryptoAddress: "",
    },
  });

  // Watch currencyId to filter platforms
  const selectedCurrencyId = watch("currencyId");

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await axiosInstance.get("/coingate/currencies");
        setCurrencies(response?.data?.data);
        setErrorFetchingCurrencies({ isError: false, error: null });
      } catch (err) {
        setErrorFetchingCurrencies({ isError: true, error: err });
      }
    };

    fetchCurrencies();
  }, []);

  const onBlur = async (event) => {
    const address = event.target.value.trim();
    if (!address) {
      setValidationState({ loading: false, valid: null, message: "" });
      return;
    }

    setValidationState({ loading: true, valid: null, message: "" });

    try {
      const response = await axiosInstance.post("/memepool/verify-address", {
        address: address,
      });

      setValidationState({
        loading: false,
        valid: response.data.success,
        message: response.data.message,
      });
    } catch (error) {
      setValidationState({
        loading: false,
        valid: false,
        message: error.response?.data?.message || "Validation failed",
      });
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    console.log(data);

    const selectedCurrency = currencies.find(
      (c) => c.id === Number(data.currencyId)
    );

    const selectedPlatform = selectedCurrency.platforms.find(
      (platform) => platform.id === Number(data.platformId)
    );

    if (!["Bitcoin", "USDT"].includes(selectedCurrency?.title)) {
      setError("Currently only Bitcoin and USDT are supported");
      setIsSubmitting(false);
      return;
    }

    if (!["Bitcoin", "Ploygon"].includes(selectedPlatform?.title)) {
      setError(
        "Currently only Bitcoin and Polygon platform/network are supported"
      );
      setIsSubmitting(false);
      return;
    }

    try {
      await createWallet({ wallet: data })
        .then((res) => {
          showSnackbar(res?.data?.message);
          setSuccess("Wallet added successfully!");
          reset();
        })
        .catch((res) =>
          showSnackbar(res?.data?.message || "Something went wrong!", "error")
        );
    } catch (err) {
      setError(err.message || "Failed to add wallet");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter platforms based on selected currency
  const filteredPlatforms = selectedCurrencyId
    ? currencies.filter((currency) => currency.id === selectedCurrencyId)[0]
        ?.platforms
    : [];

  if (errorFetchingCurrencies.isError) {
    return (
      <Box sx={{ maxWidth: 800, mx: "auto" }}>
        <Alert severity="error">
          Failed to load currencies:{" "}
          {errorFetchingCurrencies.error?.message || "Unknown error"}
        </Alert>
      </Box>
    );
  }

  if (currencies.length === 0 && !errorFetchingCurrencies.isError) {
    return (
      <Box
        sx={{
          maxWidth: 800,
          mx: "auto",
          display: "flex",
          justifyContent: "center",
          pt: 4,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: "800", mx: "auto" }}>
      <Card>
        <CardHeader title="Add New Wallet" />
        <Divider />
        <CardContent sx={{ flexGrow: 1 }}>
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
              {/* Currency Select */}
              <Box sx={{ flex: 1, minWidth: { md: "45%" } }}>
                <TextField
                  fullWidth
                  label="Currency"
                  select
                  {...register("currencyId", {
                    required: "Currency is required",
                  })}
                  error={!!errors.currencyId}
                  helperText={errors.currencyId?.message}
                >
                  {currencies.map((currency) => (
                    <MenuItem
                      key={currency.id}
                      value={currency.id}
                      disabled={
                        currency.disabled || currency?.platforms?.length === 0
                      }
                    >
                      {currency.title} ({currency.symbol})
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              {/* Platform Select */}
              <Box sx={{ flex: 1, minWidth: { md: "45%" } }}>
                <TextField
                  fullWidth
                  label="Platform"
                  select
                  disabled={
                    !selectedCurrencyId || filteredPlatforms?.length === 0
                  }
                  {...register("platformId", {
                    required: "Platform is required",
                  })}
                  error={!!errors.platformId}
                  helperText={errors.platformId?.message}
                >
                  {filteredPlatforms?.length > 0 ? (
                    filteredPlatforms?.map((platform) => (
                      <MenuItem key={platform.id} value={platform.id}>
                        {platform.title}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled value="">
                      {selectedCurrencyId
                        ? "No platforms available"
                        : "Select a currency first"}
                    </MenuItem>
                  )}
                </TextField>
              </Box>

              {/* Wallet Address - Full Width */}
              <Box sx={{ width: "100%" }}>
                <TextField
                  fullWidth
                  label="Wallet Address"
                  {...register("cryptoAddress", {
                    required: "Wallet address is required",
                    validate: () =>
                      validationState.valid !== false ||
                      validationState.message,
                  })}
                  onBlur={onBlur}
                  error={
                    !!errors.cryptoAddress || validationState.valid === false
                  }
                  helperText={
                    validationState.loading
                      ? "Validating address..."
                      : errors.cryptoAddress?.message ||
                        (validationState.valid === false
                          ? validationState.message
                          : "")
                  }
                  InputProps={{
                    endAdornment: validationState.loading && (
                      <CircularProgress size={20} sx={{ bgcolor: "inherit" }} />
                    ),
                  }}
                />
              </Box>

              {/* Submit Button - Full Width */}
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
                    "Add Wallet"
                  )}
                </Button>
              </Box>
            </Box>
          </form>
        </CardContent>
      </Card>

      <Card sx={{ mt: 3 }}>
        <CardHeader title="Wallet Verification" />
        <Divider />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            Please ensure the wallet address is correct before submitting. We
            will verify the wallet ownership before activation.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AddWalletForm;
