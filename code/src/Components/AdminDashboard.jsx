import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { getOrders } from "../firebase/orders";
import { getStudents } from "../firebase/students";
import { getMenuItems } from "../firebase/menu";

function getMonth(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleString("default", { month: "short" });
}

function getMonthYear(dateStr) {
  const d = new Date(dateStr);
  return `${d.toLocaleString("default", {
    month: "short",
  })} ${d.getFullYear()}`;
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [students, setStudents] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [ordersData, studentsData, menuData] = await Promise.all([
          getOrders(),
          getStudents(),
          getMenuItems(),
        ]);
        setOrders(ordersData);
        setStudents(studentsData);
        setMenuItems(menuData);
        setError(null);
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Only delivered orders
  const deliveredOrders = orders.filter((o) => o.status === "delivered");

  // Total revenue
  const totalRevenue = deliveredOrders.reduce(
    (sum, o) => sum + (o.totalPrice || 0),
    0
  );
  // Total orders
  const totalOrders = deliveredOrders.length;
  // Average order value
  const averageOrderValue = totalOrders
    ? (totalRevenue / totalOrders).toFixed(2)
    : 0;
  // Active users (unique students)
  const activeUsers = new Set(deliveredOrders.map((o) => o.student)).size;
  // Student who ordered the most
  let topStudent = "-";
  let topStudentCount = 0;
  const studentOrderCount = {};
  deliveredOrders.forEach((o) => {
    if (o.student) {
      studentOrderCount[o.student] = (studentOrderCount[o.student] || 0) + 1;
    }
  });
  const topStudentEntry = Object.entries(studentOrderCount).sort(
    (a, b) => b[1] - a[1]
  )[0];
  if (topStudentEntry) {
    topStudent = topStudentEntry[0];
    topStudentCount = topStudentEntry[1];
  }
  // Top payment method
  let topPaymentMethod = "-";
  const paymentMethodCount = {};
  deliveredOrders.forEach((o) => {
    if (o.paymentMethod) {
      paymentMethodCount[o.paymentMethod] =
        (paymentMethodCount[o.paymentMethod] || 0) + 1;
    }
  });
  const topPaymentEntry = Object.entries(paymentMethodCount).sort(
    (a, b) => b[1] - a[1]
  )[0];
  if (topPaymentEntry) {
    topPaymentMethod = topPaymentEntry[0];
  }
  // Most popular dish
  const dishCount = {};
  deliveredOrders.forEach((o) => {
    if (Array.isArray(o.items)) {
      o.items.forEach((item) => {
        dishCount[item.name] = (dishCount[item.name] || 0) + 1;
      });
    }
  });
  const popularDish =
    Object.entries(dishCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";
  // Peak order hour
  const hourCount = {};
  deliveredOrders.forEach((o) => {
    if (o.date) {
      const hour = new Date(o.date).getHours();
      hourCount[hour] = (hourCount[hour] || 0) + 1;
    }
  });
  const peakHour = Object.entries(hourCount).sort(
    (a, b) => b[1] - a[1]
  )[0]?.[0];
  const peakHourStr = peakHour !== undefined ? `${peakHour}:00` : "-";
  // Revenue by month (line chart)
  const revenueByMonthMap = {};
  deliveredOrders.forEach((o) => {
    if (o.date) {
      const m = getMonthYear(o.date);
      revenueByMonthMap[m] = (revenueByMonthMap[m] || 0) + (o.totalPrice || 0);
    }
  });
  const revenueData = Object.entries(revenueByMonthMap).map(
    ([month, revenue]) => ({ month, revenue })
  );
  // Popular dishes (bar chart)
  const popularDishesArr = Object.entries(dishCount).map(([name, orders]) => ({
    name,
    orders,
  }));

  return (
    <Box sx={{ width: "100%", mb: 8 }}>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 200,
          }}
        >
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <>
          {/* Statistics Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Revenue
                  </Typography>
                  <Typography variant="h4">₪{totalRevenue}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Orders
                  </Typography>
                  <Typography variant="h4">{totalOrders}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Average Order Value
                  </Typography>
                  <Typography variant="h4">₪{averageOrderValue}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Charts */}
          <Grid container spacing={3}>
            {/* Revenue Chart */}
            <Grid item xs={12} md={8}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  height: 400,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Monthly Revenue
                </Typography>
                <ResponsiveContainer>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Popular Dishes Chart */}
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  height: 400,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Popular Dishes
                </Typography>
                <ResponsiveContainer>
                  <BarChart data={popularDishesArr}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="orders" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Additional Statistics */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Additional Statistics
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Typography>
                      Top Student: <strong>{topStudent}</strong> (
                      {topStudentCount} orders)
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography>
                      Most Popular Dish: <strong>{popularDish}</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography>
                      Peak Order Hour: <strong>{peakHourStr}</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography>
                      Top Payment Method: <strong>{topPaymentMethod}</strong>
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
}
