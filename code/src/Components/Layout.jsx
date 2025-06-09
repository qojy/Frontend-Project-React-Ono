import React from "react";
import { Box, IconButton, useTheme, GlobalStyles } from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";
import { useNavigate } from "react-router-dom";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <>
      <GlobalStyles
        styles={{ body: { backgroundColor: theme.palette.background.default } }}
      />
      <Box
        sx={{
          minHeight: "100vh",
          width: "100vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "white",
          backgroundImage:
            "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            zIndex: 0,
          },
        }}
      >
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: { xs: 7, sm: 8 },
            mb: { xs: 7, sm: 0 },
            position: "relative",
            zIndex: 1,
          }}
        >
          {children}
        </Box>
        <IconButton
          color="inherit"
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
            color: "primary.main",
            zIndex: 2,
            "&:hover": {
              backgroundColor: "background.paper",
              transform: "scale(1.1)",
            },
          }}
        >
          <HelpIcon fontSize="large" />
        </IconButton>
      </Box>
    </>
  );
}
