import { useState } from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, MenuItem, Box, Typography } from "@mui/material";
import { gems } from "./gemTypes";

const shapeOptions = ["Round", "Oval", "Square", "Pear", "Rough", "Other"];
const rarityOptions = ["Common", "Uncommon", "Rare", "Very Rare"];
const transparencyOptions = ["Opaque", "Translucent", "Transparent"];

const Register = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      status: "Pending",
    },
  });

  const [showAdditional, setShowAdditional] = useState(false);
  const [showDimension, setShowDimension] = useState(false);
  const [dimensionText, setDimensionText] = useState({
    length: "",
    width: "",
    height: "",
  });

  const toggleDimension = () => setShowDimension(!showDimension);

  const onSubmit = (data) => {
    console.log("Submitted Data:", data);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        maxWidth: 500,
        mx: "auto",
        my: 3,
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography
        variant="h5"
        align="center"
        sx={{ fontWeight: "bold", color: "primary.main" }}
      >
        Register Gem
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        <TextField
          label="Name"
          fullWidth
          variant="outlined"
          {...register("name", { required: "Name is required" })}
          error={!!errors.name}
          helperText={errors.name?.message}
          sx={{ flex: "1 1 48%" }}
        />

        <TextField
          label="Type"
          select
          variant="outlined"
          defaultValue="unknown"
          {...register("type", { required: "Type is required" })}
          error={!!errors.type}
          helperText={errors.type?.message}
          sx={{ flex: "1 1 48%" }}
        >
          {gems?.map((gem) => (
            <MenuItem key={gem.name} value={gem.name}>
              {gem.name}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        <TextField
          label="Color"
          variant="outlined"
          {...register("color")}
          sx={{ flex: "1 1 48%" }}
        />
        <TextField
          label="Weight (carats)"
          type="number"
          step="0.01"
          variant="outlined"
          {...register("weight", {
            required: "Weight is required",
            min: { value: 0.1, message: "Weight must be at least 0.1" },
          })}
          slotProps={{
            htmlInput: {
              step: 0.01,
            },
          }}
          error={!!errors.weight}
          helperText={errors.weight?.message}
          sx={{ flex: "1 1 48%" }}
        />
      </Box>

      <Box
        sx={{
          display: `${showAdditional ? "none" : "flex"}`,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Button
          variant="outlined"
          onClick={() => setShowAdditional(!showAdditional)}
          sx={{ flex: "1 1 48%", height: 56 }}
        >
          {showAdditional ? "Hide Additional Fields" : "Add Additional Fields"}
        </Button>
      </Box>

      {showAdditional && (
        <>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <TextField
              select
              label="Shape"
              variant="outlined"
              {...register("shape")}
              sx={{ flex: "1 1 48%" }}
            >
              {shapeOptions.map((shape) => (
                <MenuItem key={shape} value={shape}>
                  {shape}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Rarity"
              variant="outlined"
              {...register("rarity")}
              sx={{ flex: "1 1 48%" }}
            >
              {rarityOptions.map((rarity) => (
                <MenuItem key={rarity} value={rarity}>
                  {rarity}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <TextField
              label="Price ($)"
              type="number"
              variant="outlined"
              {...register("price", {
                min: { value: 0.01, message: "Price must be at least $0.01" },
              })}
              slotProps={{
                htmlInput: {
                  step: 0.01,
                },
              }}
              error={!!errors.price}
              helperText={errors.price?.message}
              sx={{ flex: "1 1 48%" }}
            />
            <TextField
              label="Density"
              type="number"
              step="0.01"
              variant="outlined"
              {...register("density", {
                min: { value: 0.1, message: "Density must be at least 0.1" },
              })}
              slotProps={{
                htmlInput: {
                  step : 0.01
                }
              }}
              error={!!errors.density}
              helperText={errors.density?.message}
              sx={{ flex: "1 1 48%" }}
            />
          </Box>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <TextField
              label="Refractive Index"
              type="number"
              step="0.01"
              variant="outlined"
              {...register("refractiveIndex", {
                min: {
                  value: 0.1,
                  message: "Refractive Index must be at least 0.1",
                },
              })}
              slotProps={{
                htmlInput: {
                  step : 0.01
                }
              }}
              error={!!errors.refractiveIndex}
              helperText={errors.refractiveIndex?.message}
              sx={{ flex: "1 1 48%" }}
            />
            <TextField
              label="Hardness"
              type="number"
              step="0.01"
              variant="outlined"
              {...register("hardness", {
                min: { value: 0.1, message: "Hardness must be at least 0.1" },
              })}
              slotProps={{
                htmlInput: {
                  step : 0.01
                }
              }}
              error={!!errors.hardness}
              helperText={errors.hardness?.message}
              sx={{ flex: "1 1 48%" }}
            />
          </Box>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <TextField
              select
              label="Transparency"
              variant="outlined"
              {...register("transparency")}
              sx={{ flex: "1 1 48%" }}
            >
              {transparencyOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Evident Features"
              variant="outlined"
              {...register("evidentFeatures")}
              sx={{ flex: "1 1 48%" }}
            />
          </Box>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <TextField
              label="Dimension (Length x Width x Height)"
              variant="outlined"
              sx={{ flex: "1 1 48%" }}
              value={`${dimensionText.length} ${dimensionText.width} ${dimensionText.height}`}
              onClick={toggleDimension}
              InputProps={{ readOnly: true }}
            />
          </Box>

          {showDimension && (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <TextField
                label="Length (mm)"
                type="number"
                variant="outlined"
                {...register("dimension.length", {
                  required: "Length is required",
                  min: { value: 0.1, message: "Length must be at least 0.1" },
                })}
                slotProps={{
                  htmlInput: {
                    step : 0.01
                  }
                }}
                onInput={(e) =>
                  setDimensionText({
                    ...dimensionText,
                    length: `${e.target.value} x `,
                  })
                }
                error={!!errors.dimension?.length}
                helperText={errors.dimension?.length?.message}
                sx={{ flex: "1 1 30%" }}
              />
              <TextField
                label="Width (mm)"
                type="number"
                variant="outlined"
                {...register("dimension.width", {
                  required: "Width is required",
                  min: { value: 0.1, message: "Width must be at least 0.1" },
                })}
                slotProps={{
                  htmlInput: {
                    step : 0.01
                  }
                }}
                onInput={(e) =>
                  setDimensionText({
                    ...dimensionText,
                    width: `${e.target.value} x `,
                  })
                }
                error={!!errors.dimension?.width}
                helperText={errors.dimension?.width?.message}
                sx={{ flex: "1 1 30%" }}
              />
              <TextField
                label="Height (mm)"
                type="number"
                variant="outlined"
                {...register("dimension.height", {
                  required: "Height is required",
                  min: { value: 0.1, message: "Height must be at least 0.1" },
                })}
                slotProps={{
                  htmlInput: {
                    step : 0.01
                  }
                }}
                onInput={(e) =>
                  setDimensionText({
                    ...dimensionText,
                    height: e.target.value,
                  })
                }
                error={!!errors.dimension?.height}
                helperText={errors.dimension?.height?.message}
                sx={{ flex: "1 1 30%" }}
              />
            </Box>
          )}
        </>
      )}

      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{ mt: 3, py: 1.5 }}
      >
        Submit
      </Button>
    </Box>
  );
};

export default Register;
