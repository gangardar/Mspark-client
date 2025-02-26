/* eslint-disable no-unused-vars */
import React, { useState, createContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isValid, setIsValid] = useState(false);

  const login = () => setIsValid(true);
  const logout = () => setIsValid(false);

  return (
    <AuthContext.Provider value={{ isValid, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
