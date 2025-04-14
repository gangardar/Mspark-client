import { Box, CssBaseline } from "@mui/material";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import UserSidebar from "./UserSidebar";
import PropTypes from "prop-types";

export const AdminLayout = ({ isAdmin = false }) => {
  // Sidebar width - can be made dynamic if needed
  const drawerWidth = 240;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />

      {/* Sidebar - fixed width */}
      {isAdmin ? (
        <Sidebar drawerWidth={drawerWidth} />
      ) : (
        <UserSidebar drawerWidth={drawerWidth} />
      )}

      {/* Main content area */}
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: `calc(100% - ${drawerWidth}px)`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Content area - below header */}
        <Box
          sx={{
            flexGrow: 1,
            overflow: "auto",
            p: 3,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

AdminLayout.propTypes = {
  isAdmin: PropTypes.bool,
};
