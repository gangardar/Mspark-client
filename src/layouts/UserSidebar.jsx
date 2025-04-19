import {
  AccountCircle,
  CheckCircle,
  Dashboard,
  Diamond,
  Gavel,
  ListAlt,
  Payment,
  Inventory,
  AddCircle,
  History,
  Cancel,
  Pending,
  VerifiedUser,
  Sell,
  Menu,
  DeliveryDining,
  LocalShipping,
  AddBox,
  Route,
  PanTool,
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
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import Logo from "../component/Logo";
import AuthContext from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";

const StyledListItem = styled(ListItem)(({ theme, selected }) => ({
  backgroundColor: selected ? theme.palette.action.selected : "transparent",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
  whiteSpace: "nowrap",
  overflow: "hidden",
}));

const UserSidebar = () => {
  const { isValid } = useContext(AuthContext);
  const [openGems, setOpenGems] = useState(false);
  const [openAuction, setOpenAuction] = useState(false);
  const [openPayment, setOpenPayment] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [openDeliveries, setOpenDeliveries] = useState(false);
  const [userData, setUserData] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const drawerWidth = collapsed ? 64 : 240;

  // Check if current path matches the link
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Check if current path starts with the link (for nested routes)
  const isParentActive = (path) => {
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    if (isValid === undefined) return;

    if (isValid?.token) {
      try {
        const decoded = jwtDecode(isValid.token);
        setUserData(decoded);
        const role = decoded?.role;

        if (role !== "merchant" && role !== "bidder") {
          navigate("/");
        }
      } catch (error) {
        console.error("Token decoding failed:", error);
        navigate("/login");
      }
    }

    setAuthChecked(true);

    // Set initial expanded state based on current path
    setOpenGems(isParentActive(`/dashboard/${user}/gem`));
    setOpenAuction(isParentActive(`/dashboard/${user}/auction`));
    setOpenPayment(isParentActive(`/dashboard/${user}/payment`));
  }, [isValid, navigate, user]);

  if (!authChecked) return <div>Loading authentication...</div>;

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
              to={`/dashboard/${user}`}
              selected={isActive(`/dashboard/${user}`)}
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

          {/* Gems Section - Merchant Only */}
          {userData?.role === "merchant" && (
            <>
              <Tooltip
                title="Gems"
                placement="right"
                disableHoverListener={!collapsed}
              >
                <StyledListItem
                  button
                  onClick={() => setOpenGems(!openGems)}
                  selected={isParentActive(`/dashboard/${user}/gem`)}
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
              <Collapse
                in={openGems && !collapsed}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  <Tooltip title="All Gems" placement="right">
                    <StyledListItem
                      button
                      component={Link}
                      to={`/dashboard/${user}/gem/all`}
                      selected={isActive(`/dashboard/${user}/gem/all`)}
                      sx={{ pl: 4 }}
                    >
                      <ListItemIcon>
                        <Inventory />
                      </ListItemIcon>
                      <ListItemText primary="All Gems" />
                    </StyledListItem>
                  </Tooltip>
                  <Tooltip title="Register Gem" placement="right">
                    <StyledListItem
                      button
                      component={Link}
                      to={`/dashboard/${user}/gem/register`}
                      selected={isActive(`/dashboard/${user}/gem/register`)}
                      sx={{ pl: 4 }}
                    >
                      <ListItemIcon>
                        <AddCircle />
                      </ListItemIcon>
                      <ListItemText primary="Register Gem" />
                    </StyledListItem>
                  </Tooltip>
                  <Tooltip title="Verified Gems" placement="right">
                    <StyledListItem
                      button
                      component={Link}
                      to={`/dashboard/${user}/gem/verified`}
                      selected={isActive(`/dashboard/${user}/gem/verified`)}
                      sx={{ pl: 4 }}
                    >
                      <ListItemIcon>
                        <VerifiedUser />
                      </ListItemIcon>
                      <ListItemText primary="Verified Gems" />
                    </StyledListItem>
                  </Tooltip>
                  <Tooltip title="Sold Gems" placement="right">
                    <StyledListItem
                      button
                      component={Link}
                      to={`/dashboard/${user}/gem/sold`}
                      selected={isActive(`/dashboard/${user}/gem/sold`)}
                      sx={{ pl: 4 }}
                    >
                      <ListItemIcon>
                        <Sell />
                      </ListItemIcon>
                      <ListItemText primary="Sold Gems" />
                    </StyledListItem>
                  </Tooltip>
                </List>
              </Collapse>
            </>
          )}

          {/* Auctions Section */}
          <Tooltip
            title="Auctions"
            placement="right"
            disableHoverListener={!collapsed}
          >
            <StyledListItem
              button
              onClick={() => setOpenAuction(!openAuction)}
              selected={isParentActive(`/dashboard/${user}/auction`)}
              sx={{
                justifyContent: collapsed ? "center" : "initial",
                px: collapsed ? 2 : 3,
              }}
            >
              <ListItemIcon sx={{ minWidth: collapsed ? "auto" : 56 }}>
                <Gavel />
              </ListItemIcon>
              {!collapsed && <ListItemText primary="Auctions" />}
            </StyledListItem>
          </Tooltip>
          <Collapse in={openAuction && !collapsed} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {userData?.role === "bidder" && (
                <Tooltip title="Bid History" placement="right">
                  <StyledListItem
                    button
                    component={Link}
                    to={`/dashboard/${user}/auction/bid`}
                    selected={isActive(`/dashboard/${user}/auction/bid`)}
                    sx={{ pl: 4 }}
                  >
                    <ListItemIcon>
                      <History />
                    </ListItemIcon>
                    <ListItemText primary="Bid History" />
                  </StyledListItem>
                </Tooltip>
              )}
              <Tooltip title="All Auctions" placement="right">
                <StyledListItem
                  button
                  component={Link}
                  to={`/dashboard/${user}/auction/all`}
                  selected={isActive(`/dashboard/${user}/auction/all`)}
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <ListAlt />
                  </ListItemIcon>
                  <ListItemText primary="All Auctions" />
                </StyledListItem>
              </Tooltip>
              {userData?.role === "merchant" && (
                <Tooltip title="New Auction" placement="right">
                  <StyledListItem
                    button
                    component={Link}
                    to={`/dashboard/${user}/auction/new-auction`}
                    selected={isActive(
                      `/dashboard/${user}/auction/new-auction`
                    )}
                    sx={{ pl: 4 }}
                  >
                    <ListItemIcon>
                      <AddCircle />
                    </ListItemIcon>
                    <ListItemText primary="New Auction" />
                  </StyledListItem>
                </Tooltip>
              )}
              <Tooltip title="Active Auctions" placement="right">
                <StyledListItem
                  button
                  component={Link}
                  to={`/dashboard/${user}/auction/active`}
                  selected={isActive(`/dashboard/${user}/auction/active`)}
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <Pending />
                  </ListItemIcon>
                  <ListItemText primary="Active Auctions" />
                </StyledListItem>
              </Tooltip>
              <Tooltip title="Completed Auctions" placement="right">
                <StyledListItem
                  button
                  component={Link}
                  to={`/dashboard/${user}/auction/completed`}
                  selected={isActive(`/dashboard/${user}/auction/completed`)}
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <CheckCircle />
                  </ListItemIcon>
                  <ListItemText primary="Completed Auctions" />
                </StyledListItem>
              </Tooltip>
            </List>
          </Collapse>

          {/* Payments Section */}
          <Tooltip
            title="Payments"
            placement="right"
            disableHoverListener={!collapsed}
          >
            <StyledListItem
              button
              onClick={() => setOpenPayment(!openPayment)}
              selected={isParentActive(`/dashboard/${user}/payment`)}
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
                  to={`/dashboard/${user}/payment/all`}
                  selected={isActive(`/dashboard/${user}/payment/all`)}
                  sx={{ pl: 4 }}
                >
                  <ListItemIcon>
                    <ListAlt />
                  </ListItemIcon>
                  <ListItemText primary="All Payments" />
                </StyledListItem>
              </Tooltip>
              {userData?.role === "bidder" && (
                <>
                  <Tooltip title="Pending Payments" placement="right">
                    <StyledListItem
                      button
                      component={Link}
                      to={`/dashboard/${user}/payment/pending`}
                      selected={isActive(`/dashboard/${user}/payment/pending`)}
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
                      to={`/dashboard/${user}/payment/failed`}
                      selected={isActive(`/dashboard/${user}/payment/failed`)}
                      sx={{ pl: 4 }}
                    >
                      <ListItemIcon>
                        <Cancel />
                      </ListItemIcon>
                      <ListItemText primary="Failed Payments" />
                    </StyledListItem>
                  </Tooltip>
                </>
              )}
            </List>
          </Collapse>

          {/* Deliveries Routes */}
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
                  to={`/dashboard/${user}/deliveries/all`}
                  selected={isActive(`/dashboard/${user}/deliveries/all`)}
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
                  to={`/dashboard/${user}/deliveries/create`}
                  selected={isActive(`/dashboard/${user}/deliveries/create`)}
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
                  to={`/dashboard/${user}/deliveries/inTransit`}
                  selected={isActive(`/dashboard/${user}/deliveries/inTransit`)}
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
                  to={`/dashboard/${user}/deliveries/pending`}
                  selected={isActive(`/dashboard/${user}/deliveries/all`)}
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
          title="Profile"
          placement="right"
          disableHoverListener={!collapsed}
        >
          <StyledListItem
            button
            component={Link}
            to={`/dashboard/${user}/profile`}
            selected={isActive(`/dashboard/${user}/profile`)}
            sx={{
              justifyContent: collapsed ? "center" : "initial",
              px: collapsed ? 2 : 3,
            }}
          >
            <ListItemIcon sx={{ minWidth: collapsed ? "auto" : 56 }}>
              <AccountCircle />
            </ListItemIcon>
            {!collapsed && <ListItemText primary="Profile" />}
          </StyledListItem>
        </Tooltip>
      </List>
    </Drawer>
  );
};

export default UserSidebar;
