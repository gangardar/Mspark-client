import {
  Alert,
  Box,
  Button,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import PropTypes from "prop-types";
import SnackbarContext from "../context/SnackbarContext";
import { Link } from "react-router-dom";

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 2,
  width: { xs: 250, md: 300 },
  margin: "auto",
  padding: 3,
  boxShadow: 3,
  borderRadius: 2,
  mt: 2,
};

const Login = ({ onSuccess }) => {
  const { showSnackbar } = useContext(SnackbarContext);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginError },
  } = useForm();

  const { login } = useContext(AuthContext);

  const handleLogin = async (data) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, data);
      const token = response.headers["x-auth-token"];
      console.log(response);
      login(token);
      onSuccess();
      showSnackbar("Login Successfully!");
    } catch (error) {
      console.error("Login failed", error);
      setAlert({
        open: true,
        message:
          error.response?.data?.message || "Login failed. Please try again.",
        severity: "error",
      });
    }
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  return (
    <>
      <Box
        sx={formStyle}
        component="form"
        onSubmit={handleLoginSubmit(handleLogin)}
      >
        <Typography variant="h5" textAlign="center" sx={{ color: "black" }}>
          Login
        </Typography>
        <TextField
          label="Email"
          variant="outlined"
          {...registerLogin("email", {
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Invalid email format",
            },
          })}
          error={!!loginError.email}
          helperText={loginError.email?.message}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          {...registerLogin("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters long",
            },
          })}
          error={!!loginError.password}
          helperText={loginError.password?.message}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mb: 2, // Margin bottom before the button
          }}
        >
          <Link
          onClick={() => onSuccess()}
            to="/forgot-password"
            variant="body2"
            sx={{
              textDecoration: "none",
              color: "inherit",
              fontSize: "0.875rem",
              fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            Forgot Password?
          </Link>
        </Box>
        <Button type="submit" variant="contained" color="primary">
          Login
        </Button>
      </Box>
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alert.severity}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </>
  );
};

Login.propTypes = {
  onSuccess: PropTypes.func,
};

export default Login;
