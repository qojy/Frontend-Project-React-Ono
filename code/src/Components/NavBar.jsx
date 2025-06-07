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
  const adminTabs = [
    { icon: <HomeIcon />, label: "Home", path: "/" },
    { icon: <SchoolIcon />, label: "Manage Classes", path: "/manageclasses" },
    { icon: <SchoolIcon />, label: "Students List", path: "/studentslist" },
    { icon: <RestaurantIcon />, label: "Menu", path: "/menu" },
    { icon: <HistoryIcon />, label: "Active Orders", path: "/activeorders" },
    { icon: <HistoryIcon />, label: "Order History", path: "/orderhistory" },
    { icon: <HelpIcon />, label: "Help", path: "/help" },
  ];
  const studentTabs = [
    { icon: <HomeIcon />, label: "Home", path: "/" },
    { icon: <ListAltIcon />, label: "View Status", path: "/activeorders" },
    { icon: <HistoryIcon />, label: "Order History", path: "/orderhistory" },
    { icon: <HelpIcon />, label: "Help", path: "/help" },
  ];
  const isAdmin = window.localStorage.getItem("viewMode") === "admin";
  const tabs = isAdmin ? adminTabs : studentTabs;
  const paths = tabs.map((tab) => tab.path);
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
            {tabs.map((tab, idx) => (
              <Tab key={tab.label} icon={tab.icon} label={tab.label} />
            ))}
          </StyledTabs>
        </Box>
        <CreateOrderButton
          startIcon={<AddShoppingCartIcon />}
          onClick={() => navigate("/neworder")}
        >
          Create New Order
        </CreateOrderButton>
      </NavContent>
    </FloatingNav>
  );
}
