import { CheckCircle, Dashboard, Diamond, ListAlt, People, ShoppingCart } from "@mui/icons-material";
import {
  Box,
  Collapse,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useState } from "react";
import { Link, useParams } from "react-router-dom"; // Import Link and useParams
import Logo from "../component/Logo";

const UserSidebar = () => {
  const [openGems, setOpenGems] = useState(false);
  const [openMerchant, setOpenMerchant] = useState(false);
  const { user } = useParams(); // Get the `:user` parameter from the URL

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
        <Box sx={{ display: "flex", alignItems: "center", alignSelf: "center" }}>
          <Logo />
        </Box>

        <List>
          <ListItem button component={Link} to={`/dashboard/${user}`}>
            <ListItemIcon>
              <Dashboard />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button component={Link} to={`/dashboard/${user}/bidder`}>
            <ListItemIcon>
              <People />
            </ListItemIcon>
            <ListItemText primary="Bidder" />
          </ListItem>
          <ListItem button onClick={() => setOpenMerchant(!openMerchant)}>
            <ListItemIcon>
              <People />
            </ListItemIcon>
            <ListItemText primary="Merchant" />
          </ListItem>
          <Collapse in={openMerchant} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: 4 }}>
              <ListItem button component={Link} to={`/dashboard/${user}/merchant/all`}>
                <ListItemIcon>
                  <ListAlt />
                </ListItemIcon>
                <ListItemText primary="All Gems" />
              </ListItem>
              <ListItem button component={Link} to={`/dashboard/${user}/merchant/verified`}>
                <ListItemIcon>
                  <CheckCircle />
                </ListItemIcon>
                <ListItemText primary="Verified Gems" />
              </ListItem>
              <ListItem button component={Link} to={`/dashboard/${user}/merchant/sold`}>
                <ListItemIcon>
                  <ShoppingCart />
                </ListItemIcon>
                <ListItemText primary="Sold Gems" />
              </ListItem>
            </List>
          </Collapse>
          <ListItem button onClick={() => setOpenGems(!openGems)}>
            <ListItemIcon>
              <Diamond />
            </ListItemIcon>
            <ListItemText primary="Gems" />
          </ListItem>
          <Collapse in={openGems} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: 4 }}>
              <ListItem button component={Link} to={`/dashboard/${user}/gem/all`}>
                <ListItemIcon>
                  <ListAlt />
                </ListItemIcon>
                <ListItemText primary="All Gems" />
              </ListItem>
              <ListItem button component={Link} to={`/dashboard/${user}/gem/register`}>
                <ListItemIcon>
                  <ListAlt />
                </ListItemIcon>
                <ListItemText primary="Register Gem" />
              </ListItem>
              <ListItem button component={Link} to={`/dashboard/${user}/gems/verified`}>
                <ListItemIcon>
                  <CheckCircle />
                </ListItemIcon>
                <ListItemText primary="Verified Gems" />
              </ListItem>
              <ListItem button component={Link} to={`/dashboard/${user}/gems/sold`}>
                <ListItemIcon>
                  <ShoppingCart />
                </ListItemIcon>
                <ListItemText primary="Sold Gems" />
              </ListItem>
            </List>
          </Collapse>
        </List>
      </Drawer>
    </>
  );
};

export default UserSidebar;