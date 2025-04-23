import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Paper from "@mui/material/Paper";
import HomeIcon from "@mui/icons-material/Home";
import SchoolIcon from "@mui/icons-material/School";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import HistoryIcon from "@mui/icons-material/History";
import HelpIcon from "@mui/icons-material/Help";

const StyledBottomNavigation = styled(BottomNavigation)(({ theme }) => ({
  width: "100%",
  position: "fixed",
  bottom: 0,
  backgroundColor: theme.palette.background.paper,
  zIndex: theme.zIndex.drawer,
}));

export default function CustomNavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = React.useState(0);

  React.useEffect(() => {
    const pathToIndex = {
      "/": 0,
      "/classes": 1,
      "/menu": 2,
      "/order-history": 3,
      "/help": 4,
    };
    setValue(pathToIndex[location.pathname] || 0);
  }, [location]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    const paths = ["/", "/classes", "/menu", "/order-history", "/help"];
    navigate(paths[newValue]);
  };

  return (
    <Paper
      sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
      elevation={3}
    >
      <StyledBottomNavigation value={value} onChange={handleChange} showLabels>
        <BottomNavigationAction label="Home" icon={<HomeIcon />} />
        <BottomNavigationAction label="Classes" icon={<SchoolIcon />} />
        <BottomNavigationAction label="Menu" icon={<RestaurantIcon />} />
        <BottomNavigationAction label="History" icon={<HistoryIcon />} />
        <BottomNavigationAction label="Help" icon={<HelpIcon />} />
      </StyledBottomNavigation>
    </Paper>
  );
}
