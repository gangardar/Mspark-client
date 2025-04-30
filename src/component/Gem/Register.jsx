import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import {
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
  Container,
  Grid2,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  Autocomplete,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { gems } from "./gemTypes";
import { AddPhotoAlternate, Cancel, Close } from "@mui/icons-material";
import useRegisterGem from "../../react-query/services/hooks/gems/useRegisterGem";
import SnackbarContext from "../../context/SnackbarContext";
import { Link } from "react-router-dom";

const shapeOptions = ["Round", "Oval", "Square", "Pear", "Rough", "Other"];
const rarityOptions = ["Common", "Uncommon", "Rare", "Very Rare"];
const transparencyOptions = ["Opaque", "Translucent", "Transparent"];

const Register = () => {
  const {
    handleSubmit,
    register,
    setValue,
    reset,
    formState: { errors },
  } = useForm({});
  const { showSnackbar } = useContext(SnackbarContext);

  const [showAdditional, setShowAdditional] = useState(false);
  const [showDimension, setShowDimension] = useState(false);
  const [dimensionText, setDimensionText] = useState({
    length: "",
    width: "",
    height: "",
  });
  const [images, setImages] = useState([]);
  const [showFullImage, setShowFullImage] = useState({ show: false, url: "" });
  const { mutateAsync } = useRegisterGem();

  const toggleDimension = () => setShowDimension(!showDimension);

  const handleFileChange = (event) => {
    const files = event.target.files;
    console.log(files);
    if (files) {
      const fileArray = Array.from(files).map((file) => ({
        url: URL.createObjectURL(file), // Convert file to URL
        file,
      }));
      setImages((prevImages) => [...prevImages, ...fileArray]);
    }
  };

  const showImage = (index) => {
    const image = images.filter((_, i) => i === index);
    setShowFullImage({
      url: image[0]?.url,
      show: true,
    });
  };

  const handleImageClose = () => {
    setShowFullImage({ url: "", show: false });
  };

  const handleRemoveImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);

    const updatedFiles = updatedImages.map((item) => item.file);
    setValue("images", updatedFiles);
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      // Append non-file fields
      formData.append("name", data.name);
      formData.append("type", data.type);
      formData.append("color", data.color);
      formData.append("weight", data.weight);

      // Append files (convert FileList to array and append each file)
      if (data.images && data.images.length > 0) {
        Array.from(data.images).forEach((file) => {
          formData.append("images", file); // Use "images" as the field name
        });
      }

      // Send the request
      const result = await mutateAsync(formData);
      if (result?.success) {
        showSnackbar(`${data?.name} gem is registerd successfully!`);
        reset();
        setImages([]);
      }
    } catch (error) {
      showSnackbar(
        error?.response?.data?.message || "Error registering gem!",
        "error"
      );
      console.error("Error registering gem:", error.message);
    }
  };

  return (
    <>
      <Container sx={{ mt: 3 }}>
        <Dialog
          open={showFullImage.show}
          onClose={handleImageClose}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              overflow: "hidden",
              maxHeight: "90vh",
            },
          }}
        >
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              pb: 1,
            }}
          >
            <Typography variant="h6">Image Preview</Typography>
            <IconButton onClick={handleImageClose}>
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              p: 0,
            }}
          >
            <img
              src={showFullImage?.url}
              alt="Full Size Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "calc(90vh - 64px)",
                objectFit: "contain",
                display: "block",
              }}
            />
          </DialogContent>
        </Dialog>
        <Typography
          variant="h5"
          align="left"
          sx={{ fontWeight: "bold", color: "primary.main" }}
        >
          Register Gem
        </Typography>
        <Grid2 container sx={{ justifyContent: "center" }}>
          <Grid2
            sx={{
              justifyItems: "center",
              boxShadow: 3,
              borderRadius: 2,
              height: "auto",
              alignSelf: "flex-start",
              my: 3,
              p: 2,
              width: "100%", // Make container full width
              maxWidth: "400px", // But limit maximum width
            }}
            size={4}
          >
            {/* Image Upload Box */}
            <Box
              component="div"
              sx={{
                borderRadius: 2,
                width: "100%",
                height: "200px", // Fixed height
                bgcolor: "grey.100", // Lighter background
                border: "2px dashed",
                borderColor: "grey.400",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: "primary.main",
                  bgcolor: "grey.200",
                },
              }}
            >
              <input
                type="file"
                id="file-upload"
                style={{ display: "none" }}
                accept="image/*"
                multiple
                onChange={handleFileChange}
                onInput={handleFileChange}
                {...register("images", {
                  required: "At least one image is required",
                  validate: {
                    maxFiles: (files) =>
                      files.length <= 5 || "Maximum 5 images allowed",
                    maxSize: (files) =>
                      Array.from(files).every(
                        (file) => file.size <= 5 * 1024 * 1024
                      ) || "Each file should be less than 5MB",
                  },
                })}
              />
              <label htmlFor="file-upload">
                <IconButton component="span">
                  <AddPhotoAlternate sx={{ fontSize: 50, color: "grey.600" }} />
                </IconButton>
              </label>
              <Typography variant="body1" color="text.secondary">
                Click to upload images
              </Typography>
              <Typography variant="caption" color="text.secondary">
                (Max 5 images)
              </Typography>
              <Typography
                display={!errors.images && "none"}
                variant="caption"
                color="error"
              >
                {errors?.images?.message}
              </Typography>
            </Box>

            {/* Thumbnail Preview Grid */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1.5,
                my: 2,
                justifyContent: "center",
              }}
            >
              {images.map((image, index) => (
                <Box
                  key={index}
                  sx={{
                    position: "relative",
                    width: "80px", // Fixed width
                    height: "80px", // Fixed height
                    borderRadius: 1,
                    overflow: "hidden",
                    boxShadow: 1,
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: 3,
                    },
                  }}
                >
                  <img
                    src={image.url}
                    alt={`uploaded-${index}`}
                    onClick={() => showImage(index)}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      cursor: "pointer",
                    }}
                  />
                  {/* Remove Button */}
                  <IconButton
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      padding: 0.5,
                      backgroundColor: "rgba(255,255,255,0.8)",
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.9)",
                      },
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage(index);
                    }}
                  >
                    <Cancel
                      sx={{
                        fontSize: "16px",
                        color: "error.main",
                      }}
                    />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Grid2>
          <Grid2 size={6}>
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

                <Autocomplete
                  freeSolo
                  options={gems?.map((gem) => gem.name) || []}
                  defaultValue="unknown"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Type"
                      variant="outlined"
                      {...register("type", { required: "Type is required" })}
                      error={!!errors.type}
                      helperText={errors.type?.message}
                    />
                  )}
                  sx={{ flex: "1 1 48%" }}
                />
              </Box>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                <TextField
                  label="Color"
                  variant="outlined"
                  {...register("color", { required: "Color is required" })}
                  error={!!errors.color}
                  helperText={errors.color?.message}
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
                  {showAdditional
                    ? "Hide Additional Fields"
                    : "Add Additional Fields"}
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
                        min: {
                          value: 0.01,
                          message: "Price must be at least $0.01",
                        },
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
                        min: {
                          value: 0.1,
                          message: "Density must be at least 0.1",
                        },
                      })}
                      slotProps={{
                        htmlInput: {
                          step: 0.01,
                        },
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
                          step: 0.01,
                        },
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
                        min: {
                          value: 0.1,
                          message: "Hardness must be at least 0.1",
                        },
                      })}
                      slotProps={{
                        htmlInput: {
                          step: 0.01,
                        },
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
                      slotProps={{ readOnly: true }}
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
                          min: {
                            value: 0.1,
                            message: "Length must be at least 0.1",
                          },
                        })}
                        slotProps={{
                          htmlInput: {
                            step: 0.01,
                          },
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
                          min: {
                            value: 0.1,
                            message: "Width must be at least 0.1",
                          },
                        })}
                        slotProps={{
                          htmlInput: {
                            step: 0.01,
                          },
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
                          min: {
                            value: 0.1,
                            message: "Height must be at least 0.1",
                          },
                        })}
                        slotProps={{
                          htmlInput: {
                            step: 0.01,
                          },
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
              <FormControlLabel
                required
                control={<Checkbox name="gem-certification-consent" />}
                label={
                  <span>
                    I confirm my gem matches the entered details as well as image and
                    accept the{" "}
                    <Link href="/privacy-policy" target="_blank">
                      Privacy Policy
                    </Link>{" "}
                    and{" "}
                    <Link href="/gem-listing-terms" target="_blank">
                      Gem Listing Terms
                    </Link>{" "}
                    and{" "}
                    <Link href="/certification-guide" target="_blank">
                      Certification Guide
                    </Link>
                    .
                  </span>
                }
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 3, py: 1.5 }}
              >
                Submit
              </Button>
            </Box>
          </Grid2>
          <Grid2></Grid2>
        </Grid2>
      </Container>
    </>
  );
};

export default Register;
