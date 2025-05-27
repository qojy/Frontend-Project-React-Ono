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
