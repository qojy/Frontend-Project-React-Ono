import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  useTheme,
  Container,
  Button,
  Snackbar,
  CardMedia,
  CircularProgress,
} from "@mui/material";
import Layout from "./Layout";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ListAltIcon from "@mui/icons-material/ListAlt";
import HistoryIcon from "@mui/icons-material/History";
import HelpIcon from "@mui/icons-material/Help";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import StudentDashboard from "./StudentDashboard";
import AdminDashboard from "./AdminDashboard";
import MuiAlert from "@mui/material/Alert";
import { seedFirestore, resetFirestore } from "../firebase/seed";
import { getOrders } from "../firebase/orders";
import { getMenuItems } from "../firebase/menu";

export default function Homepage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [loading, setLoading] = useState(true);
  const [topDishes, setTopDishes] = useState([]);

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

  const handleSeed = async () => {
    try {
      await seedFirestore();
      setSnackbar({
        open: true,
        message: "Firestore seeded successfully!",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Error seeding Firestore",
        severity: "error",
      });
    }
  };

  const handleReset = async () => {
    try {
      await resetFirestore();
      setSnackbar({
        open: true,
        message: "Firestore reset successfully!",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Error resetting Firestore",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [orders, menuItems] = await Promise.all([
          getOrders(),
          getMenuItems(),
        ]);
        // Only delivered orders
        const delivered = orders.filter((o) => o.status === "delivered");
        // Count dishes
        const dishCount = {};
        delivered.forEach((order) => {
          (order.items || []).forEach((item) => {
            dishCount[item.id] = (dishCount[item.id] || 0) + item.quantity;
          });
        });
        // Get top 5 dish IDs
        const top5 = Object.entries(dishCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([id]) => id);
        // Get full dish objects
        const topDishesArr = top5
          .map((id) => menuItems.find((m) => m.id === id))
          .filter(Boolean);
        setTopDishes(topDishesArr);
      } catch (err) {
        setTopDishes([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

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
        {/* Seed Firestore Button (only in development) */}
        {process.env.NODE_ENV === "development" && (
          <Box
            sx={{ mb: 2, display: "flex", justifyContent: "center", gap: 2 }}
          >
            <Button variant="contained" color="secondary" onClick={handleSeed}>
              Seed Firestore with Sample Data
            </Button>
            <Button variant="outlined" color="error" onClick={handleReset}>
              Reset Firestore Data
            </Button>
          </Box>
        )}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <MuiAlert elevation={6} variant="filled" severity={snackbar.severity}>
            {snackbar.message}
          </MuiAlert>
        </Snackbar>
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
          <Typography
            variant="h5"
            sx={{
              mb: 3,
              fontWeight: 600,
              color: "primary.main",
              textAlign: "center",
            }}
          >
            Top 5 Most Ordered Dishes
          </Typography>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 200,
              }}
            >
              <CircularProgress color="primary" size={60} />
            </Box>
          ) : (
            <Grid
              container
              spacing={3}
              justifyContent="center"
              sx={{ textAlign: "center" }}
            >
              {topDishes.length === 0 ? (
                <Typography
                  variant="subtitle1"
                  sx={{ width: "100%", textAlign: "center", mt: 4 }}
                >
                  No order history yet.
                </Typography>
              ) : (
                topDishes.map((dish) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={dish.id}>
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
                      onClick={() =>
                        navigate("/neworder", {
                          state: { addDish: { ...dish, quantity: 1 } },
                        })
                      }
                    >
                      <CardMedia
                        component="img"
                        height="180"
                        image={
                          dish.image || "https://via.placeholder.com/400x240"
                        }
                        alt={dish.name}
                        sx={{ objectFit: "cover" }}
                      />
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Typography
                          variant="h5"
                          component="h2"
                          sx={{ fontWeight: 700, color: "text.primary" }}
                        >
                          {dish.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          {dish.description}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Allergens: {dish.allergens || "None"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Prep Time: {dish.prepTime} min
                        </Typography>
                        <Typography
                          variant="h6"
                          color="primary"
                          sx={{ fontWeight: 600, mt: 1 }}
                        >
                          ₪{dish.price}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              )}
            </Grid>
          )}
        </Box>
        {/* Student Dashboard Section */}
        <Typography
          variant="h5"
          sx={{
            mt: 8,
            mb: 3,
            fontWeight: 600,
            color: "primary.main",
            textAlign: "center",
          }}
        >
          Student Dashboard
        </Typography>
        <StudentDashboard />
        {/* Admin Dashboard Section */}
        <Typography
          variant="h5"
          sx={{
            mt: 8,
            mb: 3,
            fontWeight: 600,
            color: "primary.main",
            textAlign: "center",
          }}
        >
          Admin Dashboard
        </Typography>
        <AdminDashboard />
      </Container>
    </Layout>
  );
}
