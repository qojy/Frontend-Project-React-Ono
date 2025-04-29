import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Container,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Layout from "./Layout";
import { format } from "date-fns";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Load orders, menu items, and students from localStorage
    const loadedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    const loadedMenuItems = JSON.parse(
      localStorage.getItem("menuDishes") || "[]"
    );
    const loadedStudents = JSON.parse(localStorage.getItem("students") || "[]");

    // Filter only delivered orders
    const deliveredOrders = loadedOrders.filter(
      (order) => order.status === "delivered"
    );

    setOrders(deliveredOrders);
    setMenuItems(loadedMenuItems);
    setStudents(loadedStudents);
  }, []);

  const getStudentName = (studentId) => {
    const student = students.find((s) => s.id === studentId);
    return student
      ? `${student.firstName} ${student.lastName}`
      : "Unknown Student";
  };

  const getItemDetails = (items) => {
    return items
      .map((item) => {
        const menuItem = menuItems.find((m) => m.id === item.id);
        return menuItem
          ? `${menuItem.name} (x${item.quantity})`
          : "Unknown Item";
      })
      .join(", ");
  };

  const filteredOrders = orders.filter((order) => {
    const searchLower = searchTerm.toLowerCase();
    const studentName = getStudentName(order.studentId).toLowerCase();
    const items = getItemDetails(order.items).toLowerCase();
    const orderId = order.id.toLowerCase();
    const className = order.className.toLowerCase();

    return (
      studentName.includes(searchLower) ||
      items.includes(searchLower) ||
      orderId.includes(searchLower) ||
      className.includes(searchLower)
    );
  });

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Typography
            variant="h5"
            component="h2"
            sx={{
              mb: 4,
              fontWeight: 600,
              color: "primary.main",
            }}
          >
            Order History
          </Typography>

          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search by student name, class, order ID, or items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <TableContainer
            component={Paper}
            elevation={3}
            sx={{ borderRadius: 2 }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Order ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Student</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Class</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Items</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Total Price</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Payment Method</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography variant="subtitle1" sx={{ py: 3 }}>
                        {searchTerm
                          ? "No matching orders found"
                          : "No completed orders found"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{getStudentName(order.studentId)}</TableCell>
                      <TableCell>{order.className}</TableCell>
                      <TableCell>{getItemDetails(order.items)}</TableCell>
                      <TableCell>₪{order.totalPrice}</TableCell>
                      <TableCell>
                        {format(new Date(order.date), "MMM d, yyyy HH:mm")}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={order.paymentMethod}
                          color="default"
                          variant="outlined"
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>
    </Layout>
  );
}
