import React from "react";
import { Box, IconButton } from "@mui/material";
import CustomAppBar from "./AppBar";
import HelpIcon from "@mui/icons-material/Help";
import { useNavigate } from "react-router-dom";

export default function Layout({ children }) {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <CustomAppBar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8, // Add margin top to account for AppBar
        }}
      >
        {children}
      </Box>
      <IconButton
        color="primary"
        onClick={() => navigate("/help")}
        size="large"
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 48,
          height: 48,
          backgroundColor: "background.paper",
          boxShadow: 2,
          "&:hover": {
            backgroundColor: "background.paper",
            transform: "scale(1.1)",
          },
        }}
      >
        <HelpIcon fontSize="large" />
      </IconButton>
    </Box>
  );
}
