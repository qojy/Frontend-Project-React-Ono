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

const FloatingNav = styled(AppBar)(({ theme }) => ({
  backgroundColor: "#4a5c23", // Dark olive green
  backdropFilter: "blur(8px)",
  boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
  borderBottom: "1px solid rgba(255,255,255,0.1)",
  padding: "12px 24px",
}));

const Logo = styled("img")({
  height: "64px",
  cursor: "pointer",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  borderRadius: "16px",
  padding: "6px",
  backgroundColor: "rgba(255,255,255,0.1)",
  "&:hover": {
    transform: "scale(1.05)",
    backgroundColor: "rgba(255,255,255,0.15)",
  },
});

const StyledTabs = styled(Tabs)(({ theme }) => ({
  "& .MuiTab-root": {
    textTransform: "none",
    fontWeight: 500,
    fontSize: "1rem",
    minWidth: 100,
    color: "rgba(255,255,255,0.8)",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    padding: "12px 16px",
    "&.Mui-selected": {
      color: "#ffffff",
      fontWeight: 600,
    },
    "&:hover": {
      color: "#ffffff",
      backgroundColor: "rgba(255,255,255,0.1)",
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
  color: "#ffffff",
  padding: "10px 24px",
  borderRadius: "8px",
  fontWeight: 600,
  textTransform: "none",
  boxShadow: "0 2px 4px rgba(179, 210, 54, 0.2)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    background: "#9cbc2e",
    boxShadow: "0 4px 8px rgba(179, 210, 54, 0.3)",
    transform: "translateY(-1px)",
  },
  "& .MuiButton-startIcon": {
    marginRight: "8px",
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
      <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
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
      </Box>
    </FloatingNav>
  );
}
