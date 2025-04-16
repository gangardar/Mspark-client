/* eslint-disable no-unused-vars */
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import PropTypes from "prop-types";
import React, { useState, createContext, useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";
import SnackbarContext from "./SnackbarContext";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isValid, setIsValid] = useState({ status: false, token: "" }); // Default to false
  const [shouldRedirect, setShouldRedirect] = useState(false); //for rendering
  const {showSnackbar} = useContext(SnackbarContext)

  useEffect(() => {
    const token = localStorage.getItem("token");
    const endpoint = import.meta.env.VITE_API_URL;

    const validateToken = async (retryCount = 0) => {
      const maxRetries = 3;
      const retryDelay = 1000; // 1 second between retries
    
      if (!token) {
        setIsValid({ status: false, token: "" });
        return;
      }
    
      try {
        // Client-side token validation
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 < Date.now()) {
          throw new Error("Token expired");
        }
    
        // Validate token with backend
        const response = await axios.get(`${endpoint}/api/auth/me`, {
          headers: { "x-auth-token": token },
          validateStatus: (status) => status < 500, // Don't throw for 4xx errors
          timeout: 5000 // Set request timeout
        });
    
        // Successful validation
        setIsValid({ status: true, token });
        setShouldRedirect(false); // Don't redirect
        
      } catch (error) {
        console.error("Token validation failed:", error);
        showSnackbar(error.message,"error")
        // Handle network errors with retry
        if (
          !error.response && // No response means network error
          error.code !== 'ECONNABORTED' && // Not a timeout error
          retryCount < maxRetries
        ) {
          console.log(`Retrying... (${retryCount + 1}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          return validateToken(retryCount + 1);
        }
    
        // Handle authentication failures (no retry)
        if (
          error.response?.status === 401 || // Unauthorized
          error.response?.status === 403 || // Forbidden
          error.response?.status === 404 || // Not found
          error.message === "Token expired" // Client-side expiry
        ) {
          setIsValid({ status: false, token: "" });
          localStorage.removeItem("token");
          setShouldRedirect(true); // Trigger redirection
        }
        
        // Handle other errors (server errors, timeouts after retries)
        if (retryCount >= maxRetries) {
          console.error("Max retries reached. Giving up.");
          // Optionally show user message about connection issues
        }
      }
    };

    validateToken();
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token); // Store the token in localStorage
    setIsValid({ status: true, token }); // Update the state
  };

  const logout = () => {
    localStorage.removeItem("token"); // Remove the token from localStorage
    setIsValid({ status: false, token: "" }); // Update the state
  };

  return (
    <AuthContext.Provider value={{ isValid, login, logout }}>
      {shouldRedirect ? <Navigate to="/" /> : children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};


export default AuthContext;