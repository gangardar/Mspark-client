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
import { useState } from "react";
import { Menu } from "@mui/icons-material";
import Logo from "./Logo";
import useAuth from "../context/useAuth";
import AuthButton from "./User/AuthButton";

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
          textDecoration: isActive ? "none" : "underline",
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

NavLink.displayName = "NavLink";

// Role-based navigation items
const getNavItems = (role, username) => {
  const commonItems = [
    { to: "/", label: "Home" },
    { to: "/auctions", label: "Auctions" },
  ];

  const roleSpecificItems = {
    admin: [
      { to: "/admin", label: "Admin Panel" },
      { to: `/admin/profile`, label: "Account & Settings" },
    ],
    merchant: [
      { to: `/dashboard/${username}/gem/all`, label: "Gems" },
      { to: `/dashboard/${username}/auction/all`, label: "Auctions" },
      { to: `/dashboard/${username}/payment/all`, label: "Payments" },
      { to: `/dashboard/${username}/profile`, label: "Account & Settings" },
    ],
    bidder: [
      { to: `/dashboard/${username}/payment/all`, label: "Payments" },
      { to: `/dashboard/${username}/auction/bid`, label: "My Bids" },
      { to: `/dashboard/${username}/profile`, label: "Account & Settings" },
    ],
  };

  return [...commonItems, ...(roleSpecificItems[role] || [])];
};

const Navbar = () => {
  const { isValid, userData } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginModal, setLoginModal] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Get navigation items based on user role
  const navItems = isValid.status
    ? getNavItems(userData.role, userData.username)
    : getNavItems();

  return (
    <>
      <Auth loginModal={loginModal} setLoginModal={setLoginModal} />
      <AppBar position="static" sx={{ position: "fixed" }}>
        <Toolbar sx={{ flexDirection: { xs: "row" } }}>
          {/* Mobile menu button */}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleDrawerToggle}
            sx={{ display: { xs: "block", md: "none" }, mr: 2 }}
          >
            <Menu />
          </IconButton>

          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <Logo />
          </Box>

          {/* Desktop navigation */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              justifyContent: "left",
              flexGrow: 1,
            }}
          >
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to}>
                {item.label}
              </NavLink>
            ))}
          </Box>

          {/* Auth component */}
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <AuthButton setLoginModal={setLoginModal} />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "flex", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 250,
          },
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%", // Ensure full height
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
          role="presentation"
          onClick={handleDrawerToggle}
          onKeyDown={handleDrawerToggle}
        >
          {/* Top Section - Navigation Items */}
          <List sx={{ p: 2 }}>
            {navItems.map((item) => (
              <ListItem
                button
                key={item.to}
                component={NavLink}
                to={item.to}
                sx={{
                  borderRadius: 1,
                  mb: 1,
                  "&.active": {
                    bgcolor: "action.selected",
                  },
                }}
              >
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>

          {/* Bottom Section - Profile/Auth Button */}
          <List>
            <ListItem
              sx={{
                display: "flex",
                justifyContent: "center",
                pt: 2,
                borderTop: 1,
                borderColor: "divider",
              }}
            >
              <AuthButton setLoginModal={setLoginModal} fullWidth />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
