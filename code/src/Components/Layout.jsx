import React from "react";
import { Box } from "@mui/material";
import CustomAppBar from "./AppBar";

export default function Layout({ children }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
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
    </Box>
  );
}
