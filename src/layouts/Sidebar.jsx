import { CheckCircle, Dashboard, Diamond, ListAlt, People, ShoppingCart } from "@mui/icons-material";
import {
  Collapse,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useState } from "react";

const Sidebar = () => {

  const [openGems, setOpenGems] = useState(false);
  const [openMerchant, setOpenMerchant] = useState(false);

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
        <List>
          <ListItem button component={"a"} href="/admin">
            <ListItemIcon>
              <Dashboard />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button component={"a"} href="/admin/bidder">
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
              <ListItem button component="a" href="/admin/merchant/all">
                <ListItemIcon>
                  <ListAlt />
                </ListItemIcon>
                <ListItemText primary="All Gems" />
              </ListItem>
              <ListItem button component="a" href="/admin/merchant/verified">
                <ListItemIcon>
                  <CheckCircle />
                </ListItemIcon>
                <ListItemText primary="Verified Gems" />
              </ListItem>
              <ListItem button component="a" href="/admin/merchant/sold">
                <ListItemIcon>
                  <ShoppingCart />
                </ListItemIcon>
                <ListItemText primary="Sold Gems" />
              </ListItem>
            </List>
          </Collapse>
          <ListItem button onClick={() => setOpenGems(!openGems)}>
                <ListItemIcon><Diamond /></ListItemIcon>
                <ListItemText primary="Gems" />
            </ListItem>
          <Collapse in={openGems} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: 4 }}>
              <ListItem button component="a" href="/admin/gems/all">
                <ListItemIcon>
                  <ListAlt />
                </ListItemIcon>
                <ListItemText primary="All Gems" />
              </ListItem>
              <ListItem button component="a" href="/admin/gems/verified">
                <ListItemIcon>
                  <CheckCircle />
                </ListItemIcon>
                <ListItemText primary="Verified Gems" />
              </ListItem>
              <ListItem button component="a" href="/admin/gems/sold">
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

export default Sidebar;
