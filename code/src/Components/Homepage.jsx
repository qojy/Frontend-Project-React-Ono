import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Grid, Card, CardContent, Typography } from "@mui/material";
import Layout from "./Layout";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ListAltIcon from "@mui/icons-material/ListAlt";
import HistoryIcon from "@mui/icons-material/History";
import HelpIcon from "@mui/icons-material/Help";

export default function Homepage() {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: "Create New Order",
      icon: <AddShoppingCartIcon sx={{ fontSize: 40 }} />,
      path: "/neworder",
    },
    {
      title: "View Status",
      icon: <ListAltIcon sx={{ fontSize: 40 }} />,
      path: "/orderstatus",
    },
    {
      title: "Order History",
      icon: <HistoryIcon sx={{ fontSize: 40 }} />,
      path: "/orderhistory",
    },
    {
      title: "Help",
      icon: <HelpIcon sx={{ fontSize: 40 }} />,
      path: "/help",
    },
  ];

  return (
    <Layout>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Welcome to Ono
        </Typography>
        <Grid container spacing={3}>
          {menuItems.map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item.title}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  "&:hover": {
                    boxShadow: 6,
                    cursor: "pointer",
                  },
                }}
                onClick={() => navigate(item.path)}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
                  {item.icon}
                  <Typography variant="h6" component="div" sx={{ mt: 2 }}>
                    {item.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Layout>
  );
}
