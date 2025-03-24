/* eslint-disable no-unused-vars */
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import PropTypes from "prop-types";
import React, { useState, createContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isValid, setIsValid] = useState({ status: false, token: "" }); // Default to false

  useEffect(() => {
    const token = localStorage.getItem("token");
    const endpoint = import.meta.env.VITE_API_URL;

    const validateToken = async () => {
      if (token) {
        try {
          // Decode the token (optional, for debugging or validation)
          const decodedToken = jwtDecode(token);

          // Make the API call to validate the token
          await axios.get(`${endpoint}/api/auth/me`, {
            headers: {
              "x-auth-token": token,
            },
          });

          // If the API call succeeds, set isValid to true and store the token
          setIsValid({ status: true, token });
        } catch (error) {
          // If the API call fails, set isValid to false and clear the token
          setIsValid({ status: false, token: "" });
          localStorage.removeItem("token"); // Clear invalid token from localStorage
        }
      } else {
        // No token, set isValid to false
        setIsValid({ status: false, token: "" });
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
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;