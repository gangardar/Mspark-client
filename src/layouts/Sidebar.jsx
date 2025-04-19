import {
  AccountCircle,
  AddBox,
  AdminPanelSettings,
  Assignment,
  Cancel,
  CheckCircle,
  Dashboard,
  DeliveryDining,
  Diamond,
  Gavel,
  ListAlt,
  LocalShipping,
  PanTool,
  Payment,
  Pending,
  Route,
  ShoppingCart,
  Store,
} from "@mui/icons-material";
import {
  Box,
  Collapse,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  styled,
  IconButton,
  Divider,
  Tooltip,
  useTheme,
} from "@mui/material";
import { useState, useEffect } from "react";
import Logo from "../component/Logo";
import Menu from "@mui/icons-material/Menu";
import { Link, useLocation } from "react-router-dom";

const StyledListItem = styled(ListItem)(({ theme, selected }) => ({
  backgroundColor: selected ? theme.palette.action.selected : "transparent",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
  whiteSpace: "nowrap",
  overflow: "hidden",
}));

const Sidebar = () => {
  const [openGems, setOpenGems] = useState(false);
  const [openAuction, setOpenAuction] = useState(false);
  const [openDeliveries, setOpenDeliveries] = useState(false);
  const [openPayment, setOpenPayment] = useState(false);
  const [openUser, setOpenUser] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const theme = useTheme();
  const location = useLocation(); // Properly track route changes

  const drawerWidth = collapsed ? 64 : 240;

  // Check if current path matches the link
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Check if current path starts with the link (for nested routes)
  const isParentActive = (path) => {
    return location.pathname.startsWith(path);
  };

  // Set initial expanded state based on current path
  useEffect(() => {
    setOpenGems(isParentActive("/admin/gems"));
    setOpenAuction(isParentActive("/admin/auctions"));
    setOpenPayment(isParentActive("/admin/payment"));
    setOpenDeliveries(isParentActive("/admin/deliveries"));
    setOpenUser(isParentActive("/admin/users"));
  }, [location.pathname]);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: "hidden",
        },
      }}
    >
      <Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "space-between",
            p: 2,
            minHeight: "64px",
          }}
        >
          {!collapsed && <Logo />}
          <IconButton onClick={() => setCollapsed(!collapsed)}>
            <Menu />
          </IconButton>
        </Box>
        <Divider />
        <List>
          {/* Dashboard */}
          <Tooltip
            title="Dashboard"
            placement="right"
            disableHoverListener={!collapsed}
          >
            <StyledListItem
              button
              component={Link}
              to="/admin"
              selected={isActive("/admin")}
              sx={{
                justifyContent: collapsed ? "center" : "initial",
                px: collapsed ? 2 : 3,
              }}
            >
              <ListItemIcon sx={{ minWidth: collapsed ? "auto" : 56 }}>
                <Dashboard />
              </ListItemIcon>
              {!collapsed && <ListItemText primary="Dashboard" />}
            </StyledListItem>
          </Tooltip>

          {/* Users Section */}
          <Tooltip
            title="Users"
            placement="right"
            disableHoverListener={!collapsed}
          >
            <StyledListItem
              button
              onClick={() => setOpenUser(!openUser)}
              selected={isParentActive("/admin/users")}
              sx={{
                justifyContent: collapsed ? "center" : "initial",
                px: collapsed ? 2 : 3,
              }}
            >
              <ListItemIcon sx={{ minWidth: collapsed ? "auto" : 56 }}>
                <Diamond />
              </ListItemIcon>
              {!collapsed && <ListItemText primary="Users" />}
            </StyledListItem>
          </Tooltip>
          <Collapse in={openUser && !collapsed} timeout="auto" unmountOnExit>
  <List component="div" disablePadding>
    {/* All Users */}
    <Tooltip title="All Users" placement="right">
      <StyledListItem
        button
        component={Link}
        to="/admin/users/all"
        selected={isActive("/admin/users/all")}
        sx={{ 
          pl: collapsed ? 2 : 4,
          justifyContent: collapsed ? 'center' : 'flex-start'
        }}
      >
        <ListItemIcon sx={{ minWidth: collapsed ? 'auto' : '56px' }}>
          <ListAlt />
        </ListItemIcon>
        {!collapsed && <ListItemText primary="All Users" />}
      </StyledListItem>
    </Tooltip>

    {/* Admin */}
    <Tooltip title="Admin" placement="right">
      <StyledListItem
        button
        component={Link}
        to="/admin/users/admin"
        selected={isActive("/admin/users/admin")}
        sx={{ 
          pl: collapsed ? 2 : 4,
          justifyContent: collapsed ? 'center' : 'flex-start'
        }}
      >
        <ListItemIcon sx={{ minWidth: collapsed ? 'auto' : '56px' }}>
          <AdminPanelSettings /> {/* Different icon for admin */}
        </ListItemIcon>
        {!collapsed && <ListItemText primary="Admin" />}
      </StyledListItem>
    </Tooltip>

    {/* Merchants */}
    <Tooltip title="Merchants" placement="right">
      <StyledListItem
        button
        component={Link}
        to="/admin/users/merchants"
        selected={isActive("/admin/users/merchants")}
        sx={{ 
          pl: collapsed ? 2 : 4,
          justifyContent: collapsed ? 'center' : 'flex-start'
        }}
      >
        <ListItemIcon sx={{ minWidth: collapsed ? 'auto' : '56px' }}>
          <Store /> {/* Different icon for merchants */}
        </ListItemIcon>
        {!collapsed && <ListItemText primary="Merchants" />}
      </StyledListItem>
    </Tooltip>

    {/* Bidders */}
    <Tooltip title="Bidders" placement="right">
      <StyledListItem
        button
        component={Link}
        to="/admin/users/bidders"
        selected={isActive("/admin/users/bidders")}
        sx={{ 
          pl: collapsed ? 2 : 4,
          justifyContent: collapsed ? 'center' : 'flex-start'
        }}
      >
        <ListItemIcon sx={{ minWidth: collapsed ? 'auto' : '56px' }}>
          <Gavel /> {/* Different icon for bidders */}
        </ListItemIcon>
        {!collapsed && <ListItemText primary="Bidders" />}
      </StyledListItem>
    </Tooltip>
  </List>
</Collapse>

          {/* Gems Section */}
          <Tooltip
            title="Gems"
            placement="right"
            disableHoverListener={!collapsed}
          >
            <StyledListItem
              button
              onClick={() => setOpenGems(!openGems)}
              selected={isParentActive("/admin/gems")}
              sx={{
                justifyContent: collapsed ? "center" : "initial",
                px: collapsed ? 2 : 3,
              }}
            >
              <ListItemIcon sx={{ minWidth: collapsed ? "auto" : 56 }}>
                <Diamond />
              </ListItemIcon>
              {!collapsed && <ListItemText primary="Gems" />}
            </StyledListItem>
          </Tooltip>
          <Collapse in={openGems && !collapsed} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <Tooltip title="All Gems" placement="right">
                <StyledListItem
                  button
                  component={Link}
                  to="/admin/gems/all"
                  selected={isActive("/admin/gems/all")}
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <ListAlt />
                  </ListItemIcon>
                  <ListItemText primary="All Gems" />
                </StyledListItem>
              </Tooltip>
              <Tooltip title="Assigned Gems" placement="right">
                <StyledListItem
                  button
                  component={Link}
                  to={"/admin/gems/assigned"}
                  selected={isActive("/admin/gems/assigned")}
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <Assignment />
                  </ListItemIcon>
                  <ListItemText primary="Assigned Gems" />
                </StyledListItem>
              </Tooltip>
              <Tooltip title="Verified Gems" placement="right">
                <StyledListItem
                  button
                  component={Link}
                  to="/admin/gems/verified"
                  selected={isActive("/admin/gems/verified")}
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <CheckCircle />
                  </ListItemIcon>
                  <ListItemText primary="Verified Gems" />
                </StyledListItem>
              </Tooltip>
              <Tooltip title="Sold Gems" placement="right">
                <StyledListItem
                  button
                  component={Link}
                  to="/admin/gems/sold"
                  selected={isActive("/admin/gems/sold")}
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <ShoppingCart />
                  </ListItemIcon>
                  <ListItemText primary="Sold Gems" />
                </StyledListItem>
              </Tooltip>
            </List>
          </Collapse>

          {/* Auctions Section */}
          <Tooltip
            title="Auctions"
            placement="right"
            disableHoverListener={!collapsed}
          >
            <StyledListItem
              button
              onClick={() => setOpenAuction(!openAuction)}
              selected={isParentActive("/admin/auctions")}
              sx={{
                justifyContent: collapsed ? "center" : "initial",
                px: collapsed ? 2 : 3,
              }}
            >
              <ListItemIcon sx={{ minWidth: collapsed ? "auto" : 56 }}>
                <Diamond />
              </ListItemIcon>
              {!collapsed && <ListItemText primary="Auctions" />}
            </StyledListItem>
          </Tooltip>
          <Collapse in={openAuction && !collapsed} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <Tooltip title="Active Auctions" placement="right">
                <StyledListItem
                  button
                  component={Link}
                  to="/admin/auctions/active"
                  selected={isActive("/admin/auctions/active")}
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <ListAlt />
                  </ListItemIcon>
                  <ListItemText primary="Active Auctions" />
                </StyledListItem>
              </Tooltip>
            </List>
          </Collapse>

          {/* Payment Section */}
          <Tooltip
            title="Payments"
            placement="right"
            disableHoverListener={!collapsed}
          >
            <StyledListItem
              button
              onClick={() => setOpenPayment(!openPayment)}
              selected={isParentActive(`/admin/payment`)}
              sx={{
                justifyContent: collapsed ? "center" : "initial",
                px: collapsed ? 2 : 3,
              }}
            >
              <ListItemIcon sx={{ minWidth: collapsed ? "auto" : 56 }}>
                <Payment />
              </ListItemIcon>
              {!collapsed && <ListItemText primary="Payments" />}
            </StyledListItem>
          </Tooltip>
          <Collapse in={openPayment && !collapsed} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <Tooltip title="All Payments" placement="right">
                <StyledListItem
                  button
                  component={Link}
                  to={`/admin/payment/all`}
                  selected={isActive(`/admin/payment/all`)}
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <ListAlt />
                  </ListItemIcon>
                  <ListItemText primary="All Payments" />
                </StyledListItem>
              </Tooltip>
              <Tooltip title="Pending Payments" placement="right">
                <StyledListItem
                  button
                  component={Link}
                  to={`/admin/payment/pending`}
                  selected={isActive(`/admin/payment/pending`)}
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <Pending />
                  </ListItemIcon>
                  <ListItemText primary="Pending Payments" />
                </StyledListItem>
              </Tooltip>
              <Tooltip title="Failed Payments" placement="right">
                <StyledListItem
                  button
                  component={Link}
                  to={`/admin/payment/failed`}
                  selected={isActive(`/admin/payment/failed`)}
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <Cancel />
                  </ListItemIcon>
                  <ListItemText primary="Failed Payments" />
                </StyledListItem>
              </Tooltip>
            </List>
          </Collapse>

          {/* Delivery Section */}
          <Tooltip
            title="Deliveries"
            placement="right"
            disableHoverListener={!collapsed}
          >
            <StyledListItem
              button
              onClick={() => setOpenDeliveries(!openDeliveries)}
              selected={isParentActive("/admin/deliveries")}
              sx={{
                justifyContent: collapsed ? "center" : "initial",
                px: collapsed ? 2 : 3,
              }}
            >
              <ListItemIcon sx={{ minWidth: collapsed ? "auto" : 56 }}>
                <DeliveryDining />
              </ListItemIcon>
              {!collapsed && <ListItemText primary="Deliveries" />}
            </StyledListItem>
          </Tooltip>
          <Collapse
            in={openDeliveries && !collapsed}
            timeout="auto"
            unmountOnExit
          >
            <List component="div" disablePadding>
              <Tooltip title="All Deliveries" placement="right">
                <StyledListItem
                  button
                  component={Link}
                  to="/admin/deliveries/all"
                  selected={isActive("/admin/deliveries/all")}
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <LocalShipping />
                  </ListItemIcon>
                  <ListItemText primary="All Deliveries" />
                </StyledListItem>
              </Tooltip>
            </List>
            <List component="div" disablePadding>
              <Tooltip title="Create New" placement="right">
                <StyledListItem
                  button
                  component={Link}
                  to="/admin/deliveries/create"
                  selected={isActive("/admin/deliveries/create")}
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <AddBox />
                  </ListItemIcon>
                  <ListItemText primary="New Delivery" />
                </StyledListItem>
              </Tooltip>
            </List>
            <List component="div" disablePadding>
              <Tooltip title="In Transit" placement="right">
                <StyledListItem
                  button
                  component={Link}
                  to="/admin/deliveries/inTransit"
                  selected={isActive("/admin/deliveries/inTransit")}
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <Route />
                  </ListItemIcon>
                  <ListItemText primary="In Transit" />
                </StyledListItem>
              </Tooltip>
            </List>
            <List component="div" disablePadding>
              <Tooltip title="Pending" placement="right">
                <StyledListItem
                  button
                  component={Link}
                  to="/admin/deliveries/pending"
                  selected={isActive("/admin/deliveries/pending")}
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <PanTool />
                  </ListItemIcon>
                  <ListItemText primary="Pending" />
                </StyledListItem>
              </Tooltip>
            </List>
          </Collapse>
        </List>
      </Box>
      {/* Profile Link at Bottom */}
      <List>
        <Tooltip
          title="Mspark"
          placement="right"
          disableHoverListener={!collapsed}
        >
          <StyledListItem
            button
            component={Link}
            to="/admin/mspark"
            selected={isActive("/admin/mspark")}
            sx={{
              justifyContent: collapsed ? "center" : "initial",
              px: collapsed ? 2 : 3,
            }}
          >
            <ListItemIcon sx={{ minWidth: collapsed ? "auto" : 56 }}>
              <AccountCircle />
            </ListItemIcon>
            {!collapsed && <ListItemText primary="Mspark" />}
          </StyledListItem>
        </Tooltip>
      </List>
    </Drawer>
  );
};

export default Sidebar;
