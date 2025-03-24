import { useEffect, useState } from "react";
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
} from "@mui/material";
import { gems } from "./gemTypes";
import { AddPhotoAlternate, Cancel, Close } from "@mui/icons-material";
import useGemById from "../../react-query/services/hooks/gems/useGemById";
import useVerifyGem from "../../react-query/services/hooks/gems/useVerifyGem";
import useDeleteGemImage from "../../react-query/services/hooks/gems/useDeleteGemImage";
import StatusPopup from "./StatusPopup";

const shapeOptions = ["Round", "Oval", "Square", "Pear", "Rough", "Other"];
const rarityOptions = ["Common", "Uncommon", "Rare", "Very Rare"];
const transparencyOptions = ["Opaque", "Translucent", "Transparent"];

const VerifyGem = (id) => {
  const { data: Data, isLoading, isError } = useGemById(id.id);
  const { mutateAsync: deleteImg } = useDeleteGemImage();
  const [showStatusPopup, setShowStatusPopup] = useState(false);
  const gemData = Data?.data;
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors, isDirty, isValid },
  } = useForm({
    defaultValues: gemData,
  });
  const [images, setImages] = useState([]);

  // Set form values when gemData is fetched
  useEffect(() => {
    if (gemData) {
      setValue("name", gemData.name);
      setValue("type", gemData.type);
      setValue("color", gemData.color);
      setValue("weight", gemData.weight);
      setValue("shape", gemData.shape);
      setValue("rarity", gemData.rarity);
      setValue("price", gemData.price);
      setValue("density", gemData.density);
      setValue("refractiveIndex", gemData.refractiveIndex);
      setValue("hardness", gemData.hardness);
      setValue("transparency", gemData.transparency);
      setValue("evidentFeatures", gemData.evidentFeatures);
      setValue("dimension.length", gemData.dimension?.length);
      setValue("dimension.width", gemData.dimension?.width);
      setValue("dimension.height", gemData.dimension?.height);
      setImages(
        gemData?.images.map((image) => ({
          url: `http://localhost:3000/${image}`, // Assuming image is a URL
          isNew: false, // Flag to indicate this is an existing image
        }))
      );
    }
  }, [gemData, setValue]);

  const [showAdditional, setShowAdditional] = useState(false);
  const [showDimension, setShowDimension] = useState(false);
  const [dimensionText, setDimensionText] = useState({
    length: "",
    width: "",
    height: "",
  });
  const [showFullImage, setShowFullImage] = useState({ show: false, url: "" });
  const { mutateAsync } = useVerifyGem();

  const toggleDimension = () => setShowDimension(!showDimension);

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files).map((file) => ({
        url: URL.createObjectURL(file), // Convert file to URL for preview
        file, // Store the File object for submission
        isNew: true, // Flag to indicate this is a new image
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

  const handleRemoveImage = async (index) => {
    const imageToRemove = images[index];
    // If the image is not new, ask for confirmation before deletion
    if (!imageToRemove.isNew) {
      const isConfirmed = window.confirm(
        "Are you sure you want to delete this image?"
      );

      if (!isConfirmed) {
        return; // Exit if the user cancels the deletion
      }

      try {
        // Call the API to delete the image from the server
        await deleteImg({ gemId: id.id, url: imageToRemove.url });

        // Remove the image from the local state
        const updatedImages = images.filter((_, i) => i !== index);
        setImages(updatedImages);

        // Update the form value for images
        const updatedFiles = updatedImages.map((item) => item.file);
        setValue("images", updatedFiles);

        console.log("Image deleted successfully");
      } catch (error) {
        console.error("Error deleting image:", error.message);
      }
    } else {
      // If the image is new, simply remove it from the local state
      const updatedImages = images.filter((_, i) => i !== index);
      setImages(updatedImages);

      // Update the form value for images
      const updatedFiles = updatedImages.map((item) => item.file);
      setValue("images", updatedFiles);
    }
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      // Append all fields to FormData
      Object.keys(data).forEach((key) => {
        if (key === "_id" || key === "createdAt" || key === "updatedAt") {
          return; // Skip this iteration
        }

        if (key === "dimension") {
          // Handle nested dimension object
          if (data.dimension.length)
            formData.append("dimension.length", data.dimension.length);
          if (data.dimension.width)
            formData.append("dimension.width", data.dimension.width);
          if (data.dimension.height)
            formData.append("dimension.height", data.dimension.height);
        } else if (key === "images") {
          // Handle images (append each file)
          if (data.images) {
            // Convert data.images to an array if it's an object
            const imagesArray = Array.isArray(data.images)
              ? data.images // If it's already an array, use it as is
              : Object.values(data.images); // If it's an object, convert it to an array
            if (imagesArray.length > 0) {
              console.log(imagesArray);
              imagesArray.forEach((fileObj) => {
                console.log(fileObj);
                formData.append("images", fileObj);
              });
            }
          }
        } else {
          if (data[key]) formData.append(key, data[key]);
        }
      });
      const result = await mutateAsync({ id, formData });

      setShowStatusPopup(true);
      console.log("Gem verifying successfully:", result);
    } catch (error) {
      console.error("Error verifying gem:", error.message);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching gem data.</div>;

  return (
    <>
      <Container sx={{ mt: 3 }}>
        <Dialog
          open={showFullImage.show} // Control dialog visibility
          onClose={handleImageClose} // Handle dialog close
          maxWidth="md" // Set maximum width for the dialog
          fullWidth // Make the dialog responsive
        >
          {/* Dialog Title with Close Button */}
          <DialogTitle>
            Full Image
            <IconButton
              aria-label="close"
              onClick={handleImageClose}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <Close />
            </IconButton>
          </DialogTitle>

          {/* Dialog Content with Image */}
          <DialogContent>
            <img
              src={showFullImage?.url} // Image URL
              alt="Full Size"
              style={{
                width: "100%", // Make image responsive
                height: "auto", // Maintain aspect ratio
                objectFit: "fill", // Ensure the image fits within the container
              }}
            />
          </DialogContent>
        </Dialog>
        <Typography
          variant="h5"
          align="left"
          sx={{ fontWeight: "bold", color: "primary.main" }}
        >
          Verify Gem {gemData.name}
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
            }}
            size={4}
          >
            <Box
              component="div"
              sx={{
                borderRadius: 5,
                width: "70%",
                height: "15rem",
                bgcolor: "yellow",
                my: 3,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                cursor: "pointer",
              }}
            >
              {/* Hidden file input */}
              <input
                type="file"
                id="file-upload"
                style={{ display: "none" }}
                accept="image/*"
                multiple
                onInput={handleFileChange}
                {...register("images")}
              />
              {/* Icon and label */}
              <label htmlFor="file-upload">
                <IconButton component="span">
                  <AddPhotoAlternate sx={{ fontSize: 100, color: "gray" }} />
                </IconButton>
              </label>
              <Typography variant="body1" color="textSecondary">
                Add Photos
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "left",
                gap: 1,
                my: 2,
              }}
            >
              {images.map((image, index) => (
                <Box
                  key={index}
                  sx={{
                    position: "relative",
                    width: "50px",
                    height: "50px",
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
                      borderRadius: "4px",
                    }}
                  />
                  {/* Red cross button */}
                  <IconButton
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      padding: 0,
                      color: "red",
                      backgroundColor: "white",
                      borderRadius: "50%",
                      width: "16px",
                      height: "16px",
                      "&:hover": {
                        backgroundColor: "white",
                      },
                    }}
                    onClick={() => handleRemoveImage(index)} // Remove image on click
                  >
                    <Cancel sx={{ fontSize: "14px" }} />
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

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={!isDirty || !isValid}
                sx={{ mt: 3, py: 1.5 }}
              >
                Submit
              </Button>
            </Box>
          </Grid2>
          <Grid2></Grid2>
        </Grid2>
      </Container>
      <StatusPopup
        id={id}
        showStatusPopup={showStatusPopup}
        setShowStatusPopup={setShowStatusPopup}
      />
    </>
  );
};

export default VerifyGem;
