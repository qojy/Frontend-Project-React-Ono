import React from "react";
import { Box, IconButton, useTheme, GlobalStyles } from "@mui/material";
import CustomAppBar from "./AppBar";
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
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          backgroundColor: "white",
          maxWidth: "1200px",
          margin: "0 auto",
          boxShadow: 3,
        }}
      >
        <CustomAppBar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3 },
            mt: { xs: 7, sm: 8 },
            mb: { xs: 7, sm: 0 },
            width: "100%",
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
