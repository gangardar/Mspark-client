import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import AuthContext from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import useGemByMerchantId from "../../react-query/services/hooks/gems/useGemByMerchantId";
import useAddAuction from "../../react-query/services/hooks/auctions/useAddAuction";
import SnackbarContext from "../../context/SnackbarContext";
import { DateTimePicker } from "@mui/x-date-pickers";

const CreateNewAuction = () => {
  const { isValid } = useContext(AuthContext);
  const { showSnackbar } = useContext(SnackbarContext);
  const [merchant, setMerchant] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Fetch merchant's gems
  const {
    data: gems,
    isLoading: gemsLoading,
    error: gemsError,
  } = useGemByMerchantId( merchant?._id,{ enabled: !!merchant?._id });

  const verifiedGem = gems?.data?.filter(gem => gem.status === "Verified")

  // Mutation for adding auction
  const { mutateAsync: addAuction, isLoading : isAdding, isError, isSuccess, data, error } = useAddAuction();

  useEffect(() => {
    if (isValid.status) {
      const userData = jwtDecode(isValid?.token);
      setMerchant(userData);
    }
  }, [isValid]);

  useEffect(()=> {
    
    if(isSuccess)
        showSnackbar(data?.message, "info")
        reset();
  },[isSuccess])

  useEffect(()=> {
    console.log(error)
    if(isError){
        showSnackbar(error?.response?.data?.message, "error")
    }
    
  },[isError])

  const onSubmit = (data) => {
    if (!endDate) {
      showSnackbar("Please select an end date", "error");
      return;
    }

    const formattedDate = endDate.toISOString()
    const payload = {
      priceStart: Number(data.priceStart),
      endTime: formattedDate,
      gemId: data.gemId,
    };

    addAuction({auction: payload});
  };

  if (gemsLoading) return <Typography>Loading gems...</Typography>;
  if (gemsError)
    return <Typography>Error loading gems: {gemsError.message}</Typography>;
  

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create New Auction
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth margin="normal" error={!!errors.gemId}>
            <InputLabel id="gem-select-label">Select Gem</InputLabel>
            <Select
              labelId="gem-select-label"
              label="Select Gem"
              {...register("gemId", { required: "Gem is required" })}
            >
              {verifiedGem?.map((gem) => (
                <MenuItem key={gem._id} value={gem._id}>
                  {gem.name} (Type: {gem.type})
                </MenuItem>
              ))}
            </Select>
            {errors.gemId && (
              <Typography color="error" variant="caption">
                {errors.gemId.message}
              </Typography>
            )}
          </FormControl>

          <TextField
            fullWidth
            margin="normal"
            label="Starting Price"
            type="number"
            {...register("priceStart", {
              required: "Starting price is required",
              min: { value: 0, message: "Price must be positive" },
            })}
            error={!!errors.priceStart}
            helperText={errors.priceStart?.message}
          />

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="Auction End Date & time"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              minDate={new Date()}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  margin="normal"
                  error={!endDate && !!errors.endTime}
                  helperText={!endDate ? "End date&time is required" : ""}
                />
              )}
            />
          </LocalizationProvider>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
            disabled={isAdding}
          >
            {isAdding ? "Creating..." : "Create Auction"}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default CreateNewAuction;
