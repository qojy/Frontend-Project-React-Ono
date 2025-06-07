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
  Grid,
  Card,
  CardContent,
  Modal,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import ClassIcon from "@mui/icons-material/Class";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import PaymentIcon from "@mui/icons-material/Payment";
import Layout from "./Layout";
import { format } from "date-fns";
import { getOrdersByStatus } from "../firebase/orders";
import { getMenuItems } from "../firebase/menu";
import { getStudents } from "../firebase/students";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [deliveredOrders, loadedMenuItems, loadedStudents] =
        await Promise.all([
          getOrdersByStatus("delivered"),
          getMenuItems(),
          getStudents(),
        ]);
      setOrders(deliveredOrders);
      setMenuItems(loadedMenuItems);
      setStudents(loadedStudents);
    } catch (error) {
      alert("Error loading order history");
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

  const filteredOrders = orders.filter((order) => {
    const searchLower = searchTerm.toLowerCase();
    const studentName = (getStudentName(order.studentId) || "").toLowerCase();
    const items = (getItemDetails(order.items) || "").toLowerCase();
    const orderId = (order.id || "").toLowerCase();
    const className = (order.className || "").toLowerCase();
    return (
      studentName.includes(searchLower) ||
      items.includes(searchLower) ||
      orderId.includes(searchLower) ||
      className.includes(searchLower)
    );
  });

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
                          : "No delivered orders found"}
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
                      <TableCell>
                        <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          onClick={() => handleOpenDetails(order)}
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
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

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
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <PaymentIcon fontSize="small" />
                  Payment Method: {selectedOrder.paymentMethod}
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
