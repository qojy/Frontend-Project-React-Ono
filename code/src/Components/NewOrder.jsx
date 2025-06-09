import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TableFooter,
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider,
  Tooltip,
  Container,
  CardMedia,
  CircularProgress,
} from "@mui/material";
import Layout from "./Layout";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import HelpIcon from "@mui/icons-material/Help";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { getMenuItems } from "../firebase/menu";
import { getClasses } from "../firebase/classes";
import { addOrder } from "../firebase/orders";
import MenuItemsGrid from "./MenuItemsGrid";
import CartSummary from "./CartSummary";
import { getStudents } from "../firebase/students";

export default function NewOrder() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  // Add dish from homepage if present
  useEffect(() => {
    if (location.state && location.state.addDish) {
      setCart((prevCart) => {
        const exists = prevCart.find(
          (item) => item.id === location.state.addDish.id
        );
        if (exists) {
          // Do nothing if already exists
          return prevCart;
        } else {
          return [...prevCart, location.state.addDish];
        }
      });
    }
    // eslint-disable-next-line
  }, [location.state]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [loadedMenuItems, loadedClasses, loadedStudents] =
        await Promise.all([getMenuItems(), getClasses(), getStudents()]);
      setMenuItems(loadedMenuItems);
      setClasses(loadedClasses);
      setStudents(loadedStudents);
    } catch (error) {
      alert("Error loading menu, classes, or students");
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (itemId, change) => {
    setCart(
      cart
        .map((item) => {
          if (item.id === itemId) {
            const newQuantity = item.quantity + change;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleAddToCart = (menuItem) => {
    const existingItem = cart.find((item) => item.id === menuItem.id);
    if (existingItem) {
      handleQuantityChange(menuItem.id, 1);
    } else {
      setCart([...cart, { ...menuItem, quantity: 1 }]);
    }
  };

  const getItemQuantityInCart = (itemId) => {
    const item = cart.find((item) => item.id === itemId);
    return item ? item.quantity : 0;
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalPrepTime = () => {
    // Calculate prep time for each unique item (considering quantity)
    const itemPrepTimes = cart.map((item) => item.prepTime * item.quantity);
    // Return the maximum prep time
    return Math.max(...itemPrepTimes, 0);
  };

  const handlePlaceOrder = async () => {
    if (!selectedStudent) {
      alert("Please select a student");
      return;
    }
    if (!selectedClass) {
      alert("Please select a class");
      return;
    }
    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }
    if (cart.length === 0) {
      alert("Please add items to your order");
      return;
    }
    try {
      const newOrder = {
        student: students.find((s) => s.id === selectedStudent)?.fullName || "",
        studentId: selectedStudent,
        className: selectedClass,
        room: classes.find((c) => c.name === selectedClass)?.room,
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        totalPrice: getTotalPrice(),
        paymentMethod,
        status: "preparing",
        date: new Date().toISOString(),
      };
      await addOrder(newOrder);
      navigate("/activeorders");
    } catch (error) {
      alert("Error placing order");
    }
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter((item) => item.id !== itemId));
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
        {loading && (
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
        )}
        {!loading && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              minHeight: "calc(100vh - 64px)",
              width: "100%",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 4, gap: 3 }}>
              <Typography
                variant="h5"
                component="h2"
                sx={{ color: "primary.main" }}
              >
                New Order
              </Typography>
              <Box sx={{ flexGrow: 1 }} />
            </Box>

            {/* Order Details Section */}
            <Paper
              elevation={3}
              sx={{
                p: 3,
                mb: 4,
                borderRadius: 2,
              }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth required>
                    <InputLabel id="student-select-label">
                      Select Student
                    </InputLabel>
                    <Select
                      labelId="student-select-label"
                      id="student-select"
                      value={selectedStudent}
                      label="Select Student"
                      onChange={(e) => setSelectedStudent(e.target.value)}
                    >
                      {students.map((student) => (
                        <MenuItem key={student.id} value={student.id}>
                          {student.fullName} ({student.id})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel id="class-select-label">
                      Select Class
                    </InputLabel>
                    <Select
                      labelId="class-select-label"
                      id="class-select"
                      value={selectedClass}
                      label="Select Class"
                      onChange={(e) => setSelectedClass(e.target.value)}
                    >
                      {classes.map((classItem) => (
                        <MenuItem key={classItem.name} value={classItem.name}>
                          {classItem.name} - Room {classItem.room}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel id="payment-method-label">
                      Payment Method
                    </InputLabel>
                    <Select
                      labelId="payment-method-label"
                      id="payment-method"
                      value={paymentMethod}
                      label="Payment Method"
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <MenuItem value="cash">Cash</MenuItem>
                      <MenuItem value="credit">Credit Card</MenuItem>
                      <MenuItem value="bit">Bit</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>

            {/* Menu Items Grid */}
            <MenuItemsGrid
              menuItems={menuItems}
              cart={cart}
              onAddToCart={handleAddToCart}
              onRemoveFromCart={removeFromCart}
            />

            {/* Cart Section */}
            <CartSummary
              cart={cart}
              getTotalPrice={getTotalPrice}
              getTotalPrepTime={getTotalPrepTime}
              onRemoveFromCart={removeFromCart}
              handlePlaceOrder={handlePlaceOrder}
            />

            <Box sx={{ flexGrow: 1 }} />
          </Box>
        )}
      </Container>
    </Layout>
  );
}
