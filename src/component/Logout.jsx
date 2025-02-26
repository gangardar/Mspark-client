/* eslint-disable no-unused-vars */
import { Button } from "@mui/material";
import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";

const Logout = () => {
    const {logout} = useContext(AuthContext);
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token
    logout()
  };
  return (
    <>
      <Button onClick={handleLogout} variant="text">
        Logout
      </Button>
    </>
  );
};

export default Logout;
