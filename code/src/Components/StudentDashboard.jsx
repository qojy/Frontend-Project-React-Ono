import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { getOrders } from "../firebase/orders";
import { getClasses } from "../firebase/classes";
import { getMenuItems } from "../firebase/menu";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

function getMonth(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleString("default", { month: "short" });
}

export default function StudentDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [classes, setClasses] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("all");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [ordersData, classesData, menuData, studentsData] =
          await Promise.all([
            getOrders(),
            getClasses(),
            getMenuItems(),
            import("../firebase/students").then((m) => m.getStudents()),
          ]);
        setOrders(ordersData);
        setClasses(classesData);
        setMenuItems(menuData);
        setStudents(studentsData);
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
  let deliveredOrders = orders.filter((o) => o.status === "delivered");
  if (selectedStudent !== "all") {
    deliveredOrders = deliveredOrders.filter(
      (o) => o.studentId === selectedStudent
    );
  }

  // Calculate statistics
  const today = new Date().toISOString().slice(0, 10);
  const ordersToday = deliveredOrders.filter(
    (o) => o.date && o.date.slice(0, 10) === today
  );
  const totalOrdersToday = ordersToday.length;
  const totalOrdersMonth = deliveredOrders.filter((o) => {
    const d = new Date(o.date);
    const now = new Date();
    return (
      d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    );
  }).length;
  const totalSpent = deliveredOrders.reduce(
    (sum, o) => sum + (o.totalPrice || 0),
    0
  );

  // Most common class
  const classCount = {};
  deliveredOrders.forEach((o) => {
    if (o.className)
      classCount[o.className] = (classCount[o.className] || 0) + 1;
  });
  const mostCommonClass =
    Object.entries(classCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

  // Most common dish
  const dishCount = {};
  deliveredOrders.forEach((o) => {
    if (Array.isArray(o.items)) {
      o.items.forEach((item) => {
        dishCount[item.name] = (dishCount[item.name] || 0) + 1;
      });
    }
  });
  const mostCommonDish =
    Object.entries(dishCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

  // Monthly orders for bar chart
  const monthlyOrdersMap = {};
  deliveredOrders.forEach((o) => {
    if (o.date) {
      const m = getMonth(o.date);
      monthlyOrdersMap[m] = (monthlyOrdersMap[m] || 0) + 1;
    }
  });
  const monthlyOrders = Object.entries(monthlyOrdersMap).map(
    ([month, orders]) => ({ month, orders })
  );

  // Class distribution for pie chart
  const classDistributionArr = Object.entries(classCount).map(
    ([name, value]) => ({ name, value })
  );

  return (
    <Box sx={{ width: "100%", mb: 8 }}>
      {/* Student Filter */}
      <Box sx={{ mb: 3, maxWidth: 350 }}>
        <FormControl fullWidth>
          <InputLabel id="student-filter-label">Student</InputLabel>
          <Select
            labelId="student-filter-label"
            value={selectedStudent}
            label="Student"
            onChange={(e) => setSelectedStudent(e.target.value)}
          >
            <MenuItem value="all">All Students</MenuItem>
            {students.map((student) => (
              <MenuItem key={student.id} value={student.id}>
                {student.fullName} ({student.id})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

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
                    Today's Orders
                  </Typography>
                  <Typography variant="h4">{totalOrdersToday}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Monthly Orders
                  </Typography>
                  <Typography variant="h4">{totalOrdersMonth}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Spent
                  </Typography>
                  <Typography variant="h4">₪{totalSpent}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Charts */}
          <Grid container spacing={3}>
            {/* Monthly Orders Chart */}
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
                  Monthly Orders
                </Typography>
                <ResponsiveContainer>
                  <BarChart data={monthlyOrders}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="orders" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Class Distribution Chart */}
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
                  Class Distribution
                </Typography>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={classDistributionArr}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {classDistributionArr.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* Most Common Items */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Most Common Items
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography>
                      Most Common Class: <strong>{mostCommonClass}</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography>
                      Most Common Dish: <strong>{mostCommonDish}</strong>
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
