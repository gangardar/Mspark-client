import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#9b111e", // Pigeon Blood Color
    },
    secondary: {
      main: "#f5f5f5", // Light Gray for contrast
    },
    background: {
      default: "#ffffff",
      paper: "#f8f8f8",
    },
    text: {
      primary: "#2c2c2c",
      secondary: "#555555",
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      color: "#9b111e",
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
      color: "#9b111e",
    },
    h5: {
      fontWeight: 700,
      color: "#9b111e",
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          padding: "10px 20px",
          fontSize: "16px",
          fontWeight: "bold",
          textTransform: "none",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          borderRadius: "5px",
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#cccccc", // Default border color (light gray)
            },
            "&:hover fieldset": {
              borderColor: "#9b111e", // Pigeon Blood only on hover
            },
            "&.Mui-focused fieldset": {
              borderColor: "#9b111e", // Pigeon Blood when focused
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          padding: "20px",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#f5f5f5",
          color: "#2c2c2c",
          "@media (max-width:900px)": {
          },
          "@media (max-width:600px)": {
            flexDirection: "column",
            alignItems: "center",
          },
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginLeft: "8rem",
          marginRight: "8rem",
          "@media (max-width:1200px)": {
            marginLeft: "6rem",
            marginRight: "6rem",
          },
          "@media (max-width:900px)": {
            marginLeft: "3rem",
            marginRight: "3rem",
          },
          "@media (max-width:600px)": {
            flexDirection: "column",
            alignItems: "center",
            gap: "5px",
            marginLeft: "1rem",
            marginRight: "1rem",
          },
        },
      },
    },
  },
});

export default theme;
