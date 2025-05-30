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
  Button,
  Chip,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import Layout from "./Layout";
import { format } from "date-fns";
import { getOrdersByStatus, updateOrder } from "../firebase/orders";
import { getMenuItems } from "../firebase/menu";
import { getStudents } from "../firebase/students";

export default function ActiveOrders() {
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const statusColors = {
    preparing: "warning",
    "on the way": "info",
    delivered: "success",
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [activeOrders, loadedMenuItems, loadedStudents] = await Promise.all(
        [getOrdersByStatus("preparing"), getMenuItems(), getStudents()]
      );
      setOrders(activeOrders);
      setMenuItems(loadedMenuItems);
      setStudents(loadedStudents);
    } catch (error) {
      alert("Error loading active orders");
    } finally {
      setLoading(false);
    }
  };

  const getStudentName = (studentId) => {
    const student = students.find((s) => s.id === studentId);
    return student
      ? student.fullName || `${student.firstName} ${student.lastName}`
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

  const getTotalPrepTime = (items) => {
    const itemPrepTimes = items.map((item) => {
      const menuItem = menuItems.find((m) => m.id === item.id);
      return menuItem ? menuItem.prepTime * item.quantity : 0;
    });
    return Math.max(...itemPrepTimes, 0);
  };

  const handleStatusChange = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setStatusDialogOpen(true);
  };

  const handleStatusUpdate = async () => {
    try {
      await updateOrder(selectedOrder.id, { status: newStatus });
      if (newStatus === "delivered") {
        setOrders(orders.filter((order) => order.id !== selectedOrder.id));
      } else {
        setOrders(
          orders.map((order) =>
            order.id === selectedOrder.id
              ? { ...order, status: newStatus }
              : order
          )
        );
      }
      setStatusDialogOpen(false);
      setSelectedOrder(null);
    } catch (error) {
      alert("Error updating order status");
    }
  };

  return (
    <Layout>
      <Container
        maxWidth={false}
        sx={{
          maxWidth: "1400px",
          mx: "auto",
          py: 4,
          px: { xs: 2, md: 4 },
          backgroundColor: "background.paper",
          borderRadius: 3,
          boxShadow: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 4, gap: 3 }}>
          <Typography
            variant="h5"
            component="h2"
            sx={{ color: "primary.main" }}
          >
            Active Orders
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
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
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  Prep Time (min)
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <Typography variant="subtitle1" sx={{ py: 3 }}>
                      No active orders found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{getStudentName(order.studentId)}</TableCell>
                    <TableCell>{order.className}</TableCell>
                    <TableCell>{getItemDetails(order.items)}</TableCell>
                    <TableCell>₪{order.totalPrice}</TableCell>
                    <TableCell align="right">
                      {getTotalPrepTime(order.items)}
                    </TableCell>
                    <TableCell>
                      {format(new Date(order.date), "MMM d, yyyy HH:mm")}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.status}
                        color={statusColors[order.status]}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleStatusChange(order)}
                        sx={{ textTransform: "none" }}
                      >
                        Update Status
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Status Update Dialog */}
        <Dialog
          open={statusDialogOpen}
          onClose={() => setStatusDialogOpen(false)}
        >
          <DialogTitle>Update Order Status</DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={newStatus}
                label="Status"
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <MenuItem value="preparing">Preparing</MenuItem>
                <MenuItem value="on the way">On the Way</MenuItem>
                <MenuItem value="delivered">Delivered</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleStatusUpdate} variant="contained">
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
}
