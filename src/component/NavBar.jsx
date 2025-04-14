import {
  AppBar,
  Toolbar,
  IconButton,
  Link as MuiLink,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import React from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import Auth from "./Auth";
import PropTypes from "prop-types";
import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { Menu } from "@mui/icons-material";
import Logo from "./Logo";

const NavLink = React.forwardRef(({ to, children }, ref) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <MuiLink
      component={RouterLink}
      ref={ref}
      to={to}
      sx={{
        color: "inherit",
        textDecoration: "none",
        margin: "0 10px",
        fontSize: "1rem",
        fontWeight: "bold",
        "&:hover": {
          textDecoration: isActive ? "none" : "underline", // No underline if active on hover
        },
        ...(isActive && {
          color: "primary",
        }),
      }}
    >
      {children}
    </MuiLink>
  );
});

NavLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

NavLink.displayName = "NavLink"

const Navbar = () => {
  const { isValid } = useContext(AuthContext);
  const [mobileOpen, setMobileOpen] = useState();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  let tokenInfo = "";
  if (isValid.status) {
    tokenInfo = jwtDecode(isValid.token);
  }
  return (
    <>
      <AppBar position="static" sx={{ position: "fixed" }}>
        <Toolbar sx={{flexDirection:{xs : 'row'}}} >
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={handleDrawerToggle}
            sx={{ display: { xs: "block", sm: "none" } }} // Show only on mobile
          >
            <Menu />
          </IconButton>
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
           <Logo/>
          </Box>
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              justifyContent: "left",
              flexGrow: 1,
            }}
          >
            <NavLink to="/">Home</NavLink>
            <NavLink to="/auctions">Auctions</NavLink>
            {isValid.status && tokenInfo.role === "admin" && (
              <NavLink to="/admin">Admin Panel</NavLink>
            )}
            {isValid.status && tokenInfo.role === "merchant" && (
              <NavLink to={`/dashboard/${tokenInfo?.role}/gems/all`}>Gems</NavLink>
            )}
            {isValid.status &&
              ["merchant", "bidder"].includes(tokenInfo.role) && (
                <NavLink to={`/dashboard/${tokenInfo?.username}/payment/all`}>Payment</NavLink>
              )}
            {isValid.status && (
              <NavLink to="/dashboard">Account & Settings</NavLink>
            )}
          </Box>
          <Box sx={{display: { xs: "none", md: "flex" }}}>
            <Auth/>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }} // Better performance on mobile
        sx={{
          display: { xs: "flex", md: "none" }, // Show only on mobile
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 250 },
        }}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={handleDrawerToggle}
        >
          <List>
            <ListItem button component={NavLink} to="/">
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem button component={NavLink} to="/auctions">
              <ListItemText primary="Auctions" />
            </ListItem>
            {isValid.status && tokenInfo.role === "merchant" && (
              <ListItem button component={NavLink} to="/gems">
                <ListItemText primary="Gems" />
              </ListItem>
            )}
            {isValid.status &&
              ["merchant", "bidder"].includes(tokenInfo.role) && (
                <ListItem button component={NavLink} to="/payments">
                  <ListItemText primary="Payment" />
                </ListItem>
              )}
            {isValid.status && (
              <ListItem button component={NavLink} to="/dashboard">
                <ListItemText primary="Account & Settings" />
              </ListItem>
            )}
            <ListItem>
              <Auth/>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
