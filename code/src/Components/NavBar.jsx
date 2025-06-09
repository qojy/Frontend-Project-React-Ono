import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Paper from "@mui/material/Paper";
import HomeIcon from "@mui/icons-material/Home";
import SchoolIcon from "@mui/icons-material/School";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import HistoryIcon from "@mui/icons-material/History";
import HelpIcon from "@mui/icons-material/Help";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import Box from "@mui/material/Box";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const NAVBAR_HEIGHT = 64;

const FloatingNav = styled(AppBar)(({ theme }) => ({
  backgroundColor: "#6e861f",
  color: "#ffffff",
  height: NAVBAR_HEIGHT,
  minHeight: NAVBAR_HEIGHT,
  maxHeight: NAVBAR_HEIGHT,
  boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
  display: "flex",
  justifyContent: "center",
  borderRadius: 0,
}));

const Logo = styled("img")({
  height: 48,
  borderRadius: 12,
  padding: 0,
  marginLeft: 8,
  marginRight: 24,
  alignSelf: "center",
});

const NavContent = styled("div")({
  display: "flex",
  alignItems: "center",
  height: NAVBAR_HEIGHT,
  width: "100%",
});

const StyledTabs = styled(Tabs)(({ theme }) => ({
  height: NAVBAR_HEIGHT,
  minHeight: NAVBAR_HEIGHT,
  display: "flex",
  alignItems: "center",
  "& .MuiTab-root": {
    textTransform: "none",
    fontWeight: 500,
    fontSize: "1rem",
    minWidth: 100,
    color: "#fff",
    height: NAVBAR_HEIGHT,
    minHeight: NAVBAR_HEIGHT,
    display: "flex",
    alignItems: "center",
    padding: "0 16px",
    "&.Mui-selected": {
      color: "#fff",
      fontWeight: 600,
    },
    "&:hover": {
      color: "#fff",
      backgroundColor: "rgba(255,255,255,0.08)",
    },
  },
  "& .MuiTabs-indicator": {
    backgroundColor: "#b3d236",
    height: 3,
    borderRadius: "3px 3px 0 0",
  },
}));

const CreateOrderButton = styled(Button)(({ theme }) => ({
  background: "#b3d236",
  color: "#fff",
  fontWeight: 700,
  borderRadius: 8,
  height: 40,
  minWidth: 180,
  marginLeft: 24,
  textTransform: "none",
  boxShadow: "0 2px 4px rgba(179, 210, 54, 0.18)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    background: "#8ea62b",
    boxShadow: "0 4px 8px rgba(179, 210, 54, 0.28)",
    transform: "translateY(-1px)",
  },
  "& .MuiButton-startIcon": {
    marginRight: 8,
  },
}));

export default function CustomNavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = (path) => {
    navigate(path);
    handleClose();
  };

  const adminMenuItems = [
    { icon: <SchoolIcon />, label: "Manage Classes", path: "/manageclasses" },
    { icon: <SchoolIcon />, label: "Students List", path: "/studentslist" },
    { icon: <RestaurantIcon />, label: "Menu", path: "/menu" },
  ];

  const mainTabs = [
    { icon: <HomeIcon />, label: "Home", path: "/" },
    { icon: <HistoryIcon />, label: "Active Orders", path: "/activeorders" },
    { icon: <HistoryIcon />, label: "Order History", path: "/orderhistory" },
    { icon: <HelpIcon />, label: "Help", path: "/help" },
  ];

  const paths = mainTabs.map((tab) => tab.path);
  const value = paths.indexOf(location.pathname);

  const handleChange = (event, newValue) => {
    navigate(paths[newValue]);
  };

  return (
    <FloatingNav position="fixed" elevation={0}>
      <NavContent>
        <Logo
          src="/ono-logo.png"
          alt="Ono Cafeteria"
          onClick={() => navigate("/")}
        />
        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
          <StyledTabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            indicatorColor="primary"
            textColor="inherit"
            aria-label="navigation tabs"
          >
            {mainTabs.map((tab, idx) => (
              <Tab key={tab.label} icon={tab.icon} label={tab.label} />
            ))}
            <Tab
              onClick={handleClick}
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <AdminPanelSettingsIcon />
                  <span>Admin</span>
                  <KeyboardArrowDownIcon />
                </Box>
              }
            />
          </StyledTabs>
        </Box>
        <CreateOrderButton
          startIcon={<AddShoppingCartIcon />}
          onClick={() => navigate("/neworder")}
        >
          Create New Order
        </CreateOrderButton>
      </NavContent>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {adminMenuItems.map((item) => (
          <MenuItem
            key={item.label}
            onClick={() => handleMenuClick(item.path)}
            sx={{
              minWidth: 180,
              "&:hover": {
                backgroundColor: "rgba(179, 210, 54, 0.08)",
              },
            }}
          >
            <ListItemIcon sx={{ color: "primary.main" }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText>{item.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </FloatingNav>
  );
}
