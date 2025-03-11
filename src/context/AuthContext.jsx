/* eslint-disable no-unused-vars */
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import PropTypes from "prop-types";
import React, { useState, createContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isValid, setIsValid] = useState({status : false, token : ''}); // Default to false

  useEffect(() => {
    const token = localStorage.getItem('token');
    const endpoint = import.meta.env.VITE_API_URL;

    if (token) {
      try {
        // Decode the token (optional, for debugging or validation)
        const decodedToken = jwtDecode(token);
        console.log('Decoded token:', decodedToken);

        // Make the API call to validate the token
        axios.get(`${endpoint}/api/auth/me`, {
          headers: {
            "x-auth-token": token,
          },
        })
          .then(() => setIsValid({status : true, token})) // Set isValid to true on success
          .catch(() => setIsValid({status : false, token : ''})); // Set isValid to false on failure
      } catch (error) {
        console.error('Error decoding token:', error);
        setIsValid({status : false, token}); // Set isValid to false if token is invalid
      }
    } else {
      setIsValid({status : false, token : ''}); // No token, set isValid to false
    }
  }, []);
  
  const login = () => setIsValid(true);
  const logout = () => setIsValid(false);

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
