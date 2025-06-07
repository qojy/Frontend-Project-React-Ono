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
  Modal,
} from "@mui/material";
import Layout from "./Layout";
import { format } from "date-fns";
import { getOrdersByStatus, updateOrder } from "../firebase/orders";
import { getMenuItems } from "../firebase/menu";
import { getStudents } from "../firebase/students";
import PersonIcon from "@mui/icons-material/Person";
import ClassIcon from "@mui/icons-material/Class";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";

export default function ActiveOrders() {
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrderForStatus, setSelectedOrderForStatus] = useState(null);
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
    setSelectedOrderForStatus(order);
    setNewStatus(order.status);
    setStatusDialogOpen(true);
  };

  const handleStatusUpdate = async () => {
    try {
      await updateOrder(selectedOrderForStatus.id, { status: newStatus });
      if (newStatus === "delivered") {
        setOrders(
          orders.filter((order) => order.id !== selectedOrderForStatus.id)
        );
      } else {
        setOrders(
          orders.map((order) =>
            order.id === selectedOrderForStatus.id
              ? { ...order, status: newStatus }
              : order
          )
        );
      }
      setStatusDialogOpen(false);
      setSelectedOrderForStatus(null);
    } catch (error) {
      alert("Error updating order status");
    }
  };

  const handleOpenDetails = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseDetails = () => {
    setSelectedOrder(null);
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
                        color={statusColors[order.status] || "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleStatusChange(order)}
                          sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            boxShadow: 2,
                            "&:hover": {
                              boxShadow: 4,
                            },
                          }}
                        >
                          Change Status
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          onClick={() =>
                            window.open(
                              `/order/${order._id || order.id}`,
                              "_blank"
                            )
                          }
                          sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            boxShadow: 2,
                            "&:hover": {
                              boxShadow: 4,
                            },
                          }}
                        >
                          View Details
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Status Change Dialog */}
        <Dialog
          open={statusDialogOpen}
          onClose={() => setStatusDialogOpen(false)}
        >
          <DialogTitle>Change Order Status</DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>New Status</InputLabel>
              <Select
                value={newStatus}
                label="New Status"
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

        {/* Order Details Modal */}
        <Modal
          open={!!selectedOrder}
          onClose={handleCloseDetails}
          aria-labelledby="order-details-modal"
          aria-describedby="order-details-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            {selectedOrder && (
              <>
                <Typography
                  variant="h6"
                  component="h2"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <RestaurantMenuIcon color="primary" />
                  Order #{selectedOrder.orderNumber}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <PersonIcon fontSize="small" />
                  Student: {getStudentName(selectedOrder.studentId)}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <ClassIcon fontSize="small" />
                  Class: {selectedOrder.className}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <AccessTimeIcon fontSize="small" />
                  Date:{" "}
                  {format(new Date(selectedOrder.date), "MMM d, yyyy HH:mm")}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <AttachMoneyIcon fontSize="small" />
                  Total Price: ₪{selectedOrder.totalPrice}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  gutterBottom
                  sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1 }}
                >
                  <RestaurantMenuIcon fontSize="small" />
                  Items:
                </Typography>
                <Box sx={{ pl: 4 }}>
                  {selectedOrder.items.map((item, index) => {
                    const menuItem = menuItems.find((m) => m.id === item.id);
                    return (
                      <Typography
                        key={index}
                        variant="body2"
                        color="text.secondary"
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        • {menuItem ? menuItem.name : "Unknown Item"} (x
                        {item.quantity}) - ₪{item.price}
                      </Typography>
                    );
                  })}
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCloseDetails}
                  sx={{ mt: 2 }}
                >
                  Close
                </Button>
              </>
            )}
          </Box>
        </Modal>
      </Container>
    </Layout>
  );
}
