import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { getOrders } from "../firebase/orders";
import { getMenuItems } from "../firebase/menu";
import { getStudents } from "../firebase/students";
// import your order fetching utility here, e.g. import { fetchOrderById } from '../utils/orders';

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuItems, setMenuItems] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [orders, menu, studentsList] = await Promise.all([
          getOrders(),
          getMenuItems(),
          getStudents(),
        ]);
        setMenuItems(menu);
        setStudents(studentsList);
        const found = orders.find((o) => o.id === orderId || o._id === orderId);
        setOrder(found || null);
      } catch (err) {
        setOrder(null);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [orderId]);

  const getStudentName = (studentId) => {
    const student = students.find((s) => s.id === studentId);
    return student
      ? student.fullName || `${student.firstName} ${student.lastName}`
      : "Unknown Student";
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 300,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!order) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 300,
        }}
      >
        <Typography variant="h6" color="error">
          Order not found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
      <Card
        sx={{
          minWidth: 350,
          maxWidth: 500,
          width: "100%",
          borderLeft: "4px solid #b3d236",
          boxShadow: 3,
        }}
      >
        <CardContent>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Order #{order.id}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Student: {getStudentName(order.studentId)}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Class: {order.className}
          </Typography>
          <Typography variant="subtitle2" gutterBottom>
            Date: {order.date ? new Date(order.date).toLocaleString() : "-"}
          </Typography>
          <Typography variant="subtitle2" gutterBottom>
            Status: {order.status}
          </Typography>
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Items:
          </Typography>
          <Box component="ul" sx={{ pl: 3, mb: 2 }}>
            {order.items && order.items.length > 0 ? (
              order.items.map((item, idx) => {
                const menuItem = menuItems.find((m) => m.id === item.id);
                return (
                  <li key={idx}>
                    <Typography variant="body2">
                      {menuItem ? menuItem.name : item.name} (x{item.quantity})
                      - ₪{item.price}
                    </Typography>
                  </li>
                );
              })
            ) : (
              <li>
                <Typography variant="body2">No items</Typography>
              </li>
            )}
          </Box>
          <Typography variant="h6" color="primary">
            Total: ₪{order.totalPrice}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
