import { Box, Grid2, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { EmptyState } from "../common/EmptyState";

const AddressCard = ({mspark}) => {
  const [isEditing, setIsEditting] = useState(false);
  const [address, setAddress] = useState();

  useEffect(() => {
    setAddress(mspark.address);
  }, [mspark]);

  const handleAddressChange = (event) => {
    console.log(event.target.value)
  }

  if(!address){
    return <EmptyState title={"Mspark address not found!"} description={"Try refreshing.."}/>
  }
  console.log(address)
  return (
    <>
      <Box>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Address Information
        </Typography>

        <Grid2 container spacing={2}>
          <Grid2 xs={12} md={6}>
            <TextField
              label="Country"
              name="country"
              value={address.country}
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
              value={address.state}
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
              value={address.city}
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
              value={address.street}
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
              value={address.houseNo}
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
              value={address.postalcode}
              onChange={handleAddressChange}
              fullWidth
              margin="normal"
              disabled={!isEditing}
            />
          </Grid2>
        </Grid2>
      </Box>
    </>
  );
};

export default AddressCard;
