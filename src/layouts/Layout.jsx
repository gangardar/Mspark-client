/* eslint-disable no-unused-vars */
import React from "react";
import NavBar from "../component/NavBar";
import { Outlet } from "react-router-dom";
import { Box, Stack } from "@mui/material";

const Layout = () => {
  return (
    <>
      <Box sx={{
      display: 'grid',
      gridTemplateRows: 'auto 1fr',
      minHeight: '100vh'
    }}>
      <NavBar />
      <Box 
        component="main"
        sx={{
          pt: 8, // Add top padding equal to navbar height
          minHeight: 'calc(100vh - 64px)' // Adjust viewport height
        }}
      >
        <Outlet />
      </Box>
    </Box>
    </>
  );
};

export default Layout;
