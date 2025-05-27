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
import Box from "@mui/material/Box";

const StyledTabs = styled(Tabs)(({ theme }) => ({
  width: "100%",
  display: "flex",
  justifyContent: "center",
  backgroundColor: "transparent",
  color: theme.palette.primary.contrastText,
  boxShadow: "none",
  zIndex: theme.zIndex.appBar + 1,

  "& .MuiTab-root": {
    color: theme.palette.primary.contrastText,
    fontWeight: 500,
  },
  "& .MuiTab-root.Mui-selected": {
    color: "#000 !important",
  },
  "& .MuiTabs-indicator": {
    backgroundColor: "#000",
  },
}));

const FloatingNav = styled(Paper)(({ theme }) => ({
  position: "fixed",
  top: 24,
  left: "50%",
  transform: "translateX(-50%)",
  width: "min(900px, 90vw)",
  borderRadius: 16,
  boxShadow: theme.shadows[6],
  display: "flex",
  alignItems: "center",
  padding: "0 16px",
  zIndex: 1301,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

const Logo = styled("img")({
  height: 48,
  marginRight: 24,
  cursor: "pointer",
});

export default function CustomNavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = React.useState(0);

  React.useEffect(() => {
    const pathToIndex = {
      "/": 0,
      "/manageclasses": 1,
      "/studentslist": 2,
      "/menu": 3,
      "/activeorders": 4,
      "/orderhistory": 5,
      "/help": 6,
    };
    setValue(pathToIndex[location.pathname] ?? 0);
  }, [location]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    const paths = [
      "/",
      "/manageclasses",
      "/studentslist",
      "/menu",
      "/activeorders",
      "/orderhistory",
      "/help",
    ];
    navigate(paths[newValue]);
  };

  return (
    <FloatingNav elevation={6}>
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
          textColor="primary"
          aria-label="navigation tabs"
          centered
        >
          <Tab icon={<HomeIcon />} label="Home" />
          <Tab icon={<SchoolIcon />} label="Manage Classes" />
          <Tab icon={<SchoolIcon />} label="Students List" />
          <Tab icon={<RestaurantIcon />} label="Menu" />
          <Tab icon={<HistoryIcon />} label="Active Orders" />
          <Tab icon={<HistoryIcon />} label="Order History" />
          <Tab
            icon={<HelpIcon sx={{ color: "primary.main" }} />}
            label="Help"
          />
        </StyledTabs>
      </Box>
    </FloatingNav>
  );
}
