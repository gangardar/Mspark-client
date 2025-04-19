/* eslint-disable no-unused-vars */
import { Alert, Box, Button, Snackbar, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useQueries } from "@tanstack/react-query";
import PropTypes from "prop-types";

const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    width: 300,
    margin: "auto",
    padding: 3,
    boxShadow: 3,
    borderRadius: 2,
    mt:2
  };

const Register = ({role = "bidder"}) => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const {confirmPassword, ...userData}= data;
      const response = await axios.post(`${API_URL}/api/auth/register`, {...userData,role});
      const token = response.headers["x-auth-token"];
      localStorage.setItem("token", token);
      console.log(response)
      const decoded = jwtDecode(token);
      setAlert({open:true, message : response.data?.message, severity : "success"})
      reset()
    } catch (error) {
      console.error("Registration failed", error);
      setAlert({open:true, message : error.response?.data?.message || "Registration failed. Please try again.", severity: "error"})
    }
  };

  const handleCloseAlert = () => {
    setAlert({...alert, open : false})
  }

  return (
    <>
      <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={formStyle}
    >
      <Typography sx={{color:'black'}} variant="h5" textAlign="center">
        Register
      </Typography>
      <TextField
        label="Full Name"
        variant="outlined"
        {...register("fullName", { required: "Full Name is required" })}
        error={!!errors.fullName}
        helperText={errors.fullName?.message}
      />
      <TextField
        label="Username"
        variant="outlined"
        {...register("username", { required: "Username is required" })}
        error={!!errors.username}
        helperText={errors.username?.message}
      />
      <TextField
        label="Email"
        variant="outlined"
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 
            message: "Invalid email format",
          },
        })}
        error={!!errors.email}
        helperText={errors.email?.message}
      />
      <TextField
        label="Password"
        type="password"
        autoComplete="new-password"
        variant="outlined"
        {...register("password", {
          required: "Password is required",
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters long",
          },
        })}
        error={!!errors.password}
        helperText={errors.password?.message}
      />
      <TextField
        label="Confirm Password"
        type="password"
        autoComplete="new-password"
        variant="outlined"
        {...register("confirmPassword", {
          required: "Confirm Password is required",
          validate: (value) => {
            return value === getValues().password || "Password don't match"
          }
        })}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
      />
      <Button type="submit" variant="contained" color="primary" sx={{ color: "white" }}>
        Register
      </Button>
    </Box>
    <Snackbar
            open={alert.open}
            autoHideDuration={6000}
            onClose={handleCloseAlert}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: "100%" }}>
              {alert.message}
            </Alert>
          </Snackbar>
    </>
  );
};

Register.propTypes = {
  role : PropTypes.string
}

export default Register;
