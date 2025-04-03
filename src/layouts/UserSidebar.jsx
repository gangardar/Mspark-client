import {
  CheckCircle,
  Dashboard,
  Diamond,
  ListAlt,
  ShoppingCart,
} from "@mui/icons-material";
import {
  Box,
  Collapse,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom"; // Import Link and useParams
import Logo from "../component/Logo";
import AuthContext from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";

const UserSidebar = () => {
  const { isValid } = useContext(AuthContext);
  const [openGems, setOpenGems] = useState(false);
  const [openAuction, setOpenAuction] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [userData, setUserData] = useState(null);
  const { user } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Only run auth checks once isValid has potential values
    if (isValid === undefined) return;

    // If we have a token, verify it
    if (isValid?.token) {
      try {
        const decoded = jwtDecode(isValid.token);
        setUserData(decoded);
        const role = decoded?.role;

        // Validate role
        if (role !== "merchant" && role !== "bidder") {
          navigate("/");
        }
      } catch (error) {
        console.error("Token decoding failed:", error);
        navigate("/login");
      }
    }

    // Mark auth as checked
    setAuthChecked(true);
  }, [isValid, navigate]);

  if (!authChecked) return <div>Loading authentication...</div>;

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          width: 240, // Fixed width for the sidebar
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 240, // Ensure the drawer paper has the same width
            boxSizing: "border-box",
          },
        }}
      >
        <Box
          sx={{ display: "flex", alignItems: "center", alignSelf: "center" }}
        >
          <Logo />
        </Box>
        <List>
          <ListItem button component={Link} to={`/dashboard/${user}`}>
            <ListItemIcon>
              <Dashboard />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          {userData?.role === "merchant" && (
            <ListItem button onClick={() => setOpenGems(!openGems)}>
              <ListItemIcon>
                <Diamond />
              </ListItemIcon>
              <ListItemText primary="Gems" />
            </ListItem>
          )}
          <Collapse in={openGems} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: 4 }}>
              <ListItem
                button
                component={Link}
                to={`/dashboard/${user}/gem/all`}
              >
                <ListItemIcon>
                  <ListAlt />
                </ListItemIcon>
                <ListItemText primary="All Gems" />
              </ListItem>
              <ListItem
                button
                component={Link}
                to={`/dashboard/${user}/gem/register`}
              >
                <ListItemIcon>
                  <ListAlt />
                </ListItemIcon>
                <ListItemText primary="Register Gem" />
              </ListItem>
              <ListItem
                button
                component={Link}
                to={`/dashboard/${user}/gems/verified`}
              >
                <ListItemIcon>
                  <CheckCircle />
                </ListItemIcon>
                <ListItemText primary="Verified Gems" />
              </ListItem>
              <ListItem
                button
                component={Link}
                to={`/dashboard/${user}/gems/sold`}
              >
                <ListItemIcon>
                  <ShoppingCart />
                </ListItemIcon>
                <ListItemText primary="Sold Gems" />
              </ListItem>
            </List>
          </Collapse>
          <ListItem button onClick={() => setOpenAuction(!openAuction)}>
            <ListItemIcon>
              <Diamond />
            </ListItemIcon>
            <ListItemText primary="Auctions" />
          </ListItem>
          <Collapse in={openAuction} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: 4 }}>
              <ListItem
                button
                component={Link}
                to={`/dashboard/${user}/auction/active`}
              >
                <ListItemIcon>
                  <ListAlt />
                </ListItemIcon>
                <ListItemText primary="All Active Auction" />
              </ListItem>
              {userData?.role === "merchant" && (
                <ListItem
                  button
                  component={Link}
                  to={`/dashboard/${user}/auction/new-auction`}
                >
                  <ListItemIcon>
                    <ShoppingCart />
                  </ListItemIcon>
                  <ListItemText primary="New Auction" />
                </ListItem>
              )}
              {userData?.role === "bidder" && (
                <ListItem
                  button
                  component={Link}
                  to={`/dashboard/${user}/auction/bid`}
                >
                  <ListItemIcon>
                    <ShoppingCart />
                  </ListItemIcon>
                  <ListItemText primary="Bid History" />
                </ListItem>
              )}
              <ListItem
                button
                component={Link}
                to={`/dashboard/${user}/auction/active`}
              >
                <ListItemIcon>
                  <ListAlt />
                </ListItemIcon>
                <ListItemText primary="Active Gem" />
              </ListItem>
              <ListItem
                button
                component={Link}
                to={`/dashboard/${user}/auction/completed`}
              >
                <ListItemIcon>
                  <ShoppingCart />
                </ListItemIcon>
                <ListItemText primary="Completed Auctions" />
              </ListItem>
            </List>
          </Collapse>
        </List>
      </Drawer>
    </>
  );
};

export default UserSidebar;
