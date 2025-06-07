import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
// import your order fetching utility here, e.g. import { fetchOrderById } from '../utils/orders';

const mockFetchOrderById = async (id) => {
  // Replace this with your real data fetching logic
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          id,
          orderNumber: id,
          studentName: "John Doe",
          className: "5A",
          date: new Date().toISOString(),
          totalPrice: 42.5,
          items: [
            { name: "Sandwich", price: 15, quantity: 1 },
            { name: "Juice", price: 7.5, quantity: 2 },
          ],
          status: "delivered",
        }),
      500
    )
  );
};

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace mockFetchOrderById with your real fetch function
    mockFetchOrderById(orderId).then((data) => {
      setOrder(data);
      setLoading(false);
    });
  }, [orderId]);

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
            Order #{order.orderNumber}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Student: {order.studentName}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Class: {order.className}
          </Typography>
          <Typography variant="subtitle2" gutterBottom>
            Date: {new Date(order.date).toLocaleString()}
          </Typography>
          <Typography variant="subtitle2" gutterBottom>
            Status: {order.status}
          </Typography>
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Items:
          </Typography>
          <Box component="ul" sx={{ pl: 3, mb: 2 }}>
            {order.items.map((item, idx) => (
              <li key={idx}>
                <Typography variant="body2">
                  {item.name} (x{item.quantity}) - ₪{item.price}
                </Typography>
              </li>
            ))}
          </Box>
          <Typography variant="h6" color="primary">
            Total: ₪{order.totalPrice}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
