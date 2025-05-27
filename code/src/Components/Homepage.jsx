import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  useTheme,
  Container,
} from "@mui/material";
import Layout from "./Layout";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ListAltIcon from "@mui/icons-material/ListAlt";
import HistoryIcon from "@mui/icons-material/History";
import HelpIcon from "@mui/icons-material/Help";

export default function Homepage() {
  const navigate = useNavigate();
  const theme = useTheme();

  const menuItems = [
    {
      title: "Create New Order",
      icon: <AddShoppingCartIcon sx={{ fontSize: 40 }} />,
      path: "/neworder",
    },
    {
      title: "View Status",
      icon: <ListAltIcon sx={{ fontSize: 40 }} />,
      path: "/activeorders",
    },
    {
      title: "Order History",
      icon: <HistoryIcon sx={{ fontSize: 40 }} />,
      path: "/orderhistory",
    },
    {
      title: "Help",
      icon: <HelpIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      path: "/help",
    },
  ];

  return (
    <Layout>
      <Container
        maxWidth={false}
        sx={{
          maxWidth: "1400px",
          width: "100%",
          mx: "auto",
          py: 4,
          px: { xs: 2, md: 4 },
          backgroundColor: "background.paper",
          borderRadius: 3,
          boxShadow: 3,
        }}
      >
        <Box sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              mb: 4,
              color: "primary.main",
              fontWeight: 600,
              textAlign: "center",
            }}
          >
            Welcome to Ono Cafeteria
          </Typography>
          <Grid
            container
            spacing={3}
            justifyContent="center"
            sx={{ textAlign: "center" }}
          >
            {menuItems.map((item) => (
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={item.title}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    cursor: "pointer",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.16)",
                    },
                  }}
                  onClick={() => navigate(item.path)}
                >
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      p: 3,
                    }}
                  >
                    <Box
                      sx={{
                        color: "primary.main",
                        mb: 2,
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{
                        color: "text.primary",
                        fontWeight: 500,
                      }}
                    >
                      {item.title}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Layout>
  );
}
