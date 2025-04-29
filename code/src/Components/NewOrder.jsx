import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
} from "@mui/material";
import Layout from "./Layout";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import HelpIcon from "@mui/icons-material/Help";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

export default function NewOrder() {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [classes, setClasses] = useState([]);

  // Load menu items and classes from localStorage
  useEffect(() => {
    const savedMenu = localStorage.getItem("menuDishes");
    if (savedMenu) {
      setMenuItems(JSON.parse(savedMenu));
    }

    const savedClasses = localStorage.getItem("classes");
    if (savedClasses) {
      setClasses(JSON.parse(savedClasses));
    }
  }, []);

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

  const handlePlaceOrder = () => {
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

    // Create new order object with shorter ID and complete item information
    const newOrder = {
      id: Math.floor(Math.random() * 10000).toString(), // Shorter ID (4 digits)
      studentId: "1", // TODO: Replace with actual logged-in student ID
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

    // Get existing orders and add new one
    const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    const updatedOrders = [...existingOrders, newOrder];

    // Save to localStorage
    localStorage.setItem("orders", JSON.stringify(updatedOrders));

    // Navigate to active orders
    navigate("/activeorders");
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter((item) => item.id !== itemId));
  };

  return (
    <Layout>
      <Container maxWidth={false} sx={{ maxWidth: "100%" }}>
        <Box
          sx={{
            py: 4,
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
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="class-select-label">Select Class</InputLabel>
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
              <Grid item xs={12} sm={6}>
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
          <Box>
            <Typography
              variant="h4"
              sx={{
                mb: 3,
                fontWeight: 500,
                color: "text.primary",
                textAlign: "center",
              }}
            >
              Menu Items
            </Typography>
            <Grid
              container
              spacing={3}
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(4, 1fr)",
                },
                gap: 3,
                "& > .MuiGrid-item": {
                  width: "100%",
                  maxWidth: "100%",
                  flexBasis: "auto",
                  padding: 0,
                },
              }}
            >
              {menuItems.map((item) => (
                <Grid item key={item.id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      position: "relative",
                      borderRadius: 2,
                      boxShadow: 3,
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 6,
                      },
                    }}
                  >
                    {item.image ? (
                      <Box
                        component="img"
                        src={item.image}
                        alt={item.name}
                        sx={{
                          width: "100%",
                          height: 200,
                          objectFit: "cover",
                          borderTopLeftRadius: 8,
                          borderTopRightRadius: 8,
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: "100%",
                          height: 200,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: "grey.100",
                          borderTopLeftRadius: 8,
                          borderTopRightRadius: 8,
                        }}
                      >
                        <Typography color="text.secondary">
                          No image available
                        </Typography>
                      </Box>
                    )}
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Typography
                        variant="h5"
                        gutterBottom
                        sx={{
                          fontWeight: 600,
                          color: "text.primary",
                          mb: 2,
                        }}
                      >
                        {item.name}
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          ID: {item.id}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          minHeight: "3em",
                          lineHeight: 1.5,
                        }}
                      >
                        {item.description}
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Allergens: {item.allergens || "None"}
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Prep Time: {item.prepTime} min
                        </Typography>
                      </Box>
                      <Typography
                        variant="h5"
                        color="primary"
                        sx={{
                          fontWeight: 600,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        ₪{item.price}
                      </Typography>
                    </CardContent>
                    <Divider />
                    <CardActions
                      sx={{
                        justifyContent: "space-between",
                        alignItems: "center",
                        p: 2,
                        bgcolor: "background.default",
                      }}
                    >
                      {getItemQuantityInCart(item.id) > 0 ? (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            width: "100%",
                            justifyContent: "space-between",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              bgcolor: "background.paper",
                              borderRadius: 1,
                              p: 0.5,
                            }}
                          >
                            <IconButton
                              size="medium"
                              onClick={() => handleQuantityChange(item.id, -1)}
                              sx={{
                                color: "primary.main",
                                "&:hover": { bgcolor: "primary.lighter" },
                              }}
                            >
                              <RemoveIcon />
                            </IconButton>
                            <Typography
                              sx={{
                                minWidth: "2em",
                                textAlign: "center",
                                fontWeight: 600,
                              }}
                            >
                              {getItemQuantityInCart(item.id)}
                            </Typography>
                            <IconButton
                              size="medium"
                              onClick={() => handleQuantityChange(item.id, 1)}
                              sx={{
                                color: "primary.main",
                                "&:hover": { bgcolor: "primary.lighter" },
                              }}
                            >
                              <AddIcon />
                            </IconButton>
                          </Box>
                          <Tooltip title="Remove from cart">
                            <IconButton
                              size="medium"
                              color="error"
                              onClick={() => removeFromCart(item.id)}
                              sx={{
                                "&:hover": {
                                  bgcolor: "error.lighter",
                                  transform: "scale(1.1)",
                                },
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      ) : (
                        <Button
                          variant="contained"
                          size="large"
                          startIcon={<AddIcon />}
                          onClick={() => handleAddToCart(item)}
                          fullWidth
                          sx={{
                            py: 1,
                            fontWeight: 600,
                            "&:hover": {
                              transform: "scale(1.02)",
                            },
                          }}
                        >
                          Add to Cart
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Cart Section */}
          {cart.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Typography
                variant="h4"
                sx={{
                  mb: 3,
                  fontWeight: 500,
                  color: "text.primary",
                }}
              >
                Your Order
              </Typography>
              <Paper
                elevation={3}
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontSize: "1.1rem", fontWeight: 600 }}>
                          ID
                        </TableCell>
                        <TableCell sx={{ fontSize: "1.1rem", fontWeight: 600 }}>
                          Dish Name
                        </TableCell>
                        <TableCell sx={{ fontSize: "1.1rem", fontWeight: 600 }}>
                          Allergens
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ fontSize: "1.1rem", fontWeight: 600 }}
                        >
                          Prep Time (min)
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ fontSize: "1.1rem", fontWeight: 600 }}
                        >
                          Price (₪)
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{ fontSize: "1.1rem", fontWeight: 600 }}
                        >
                          Quantity
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ fontSize: "1.1rem", fontWeight: 600 }}
                        >
                          Total (₪)
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{ fontSize: "1.1rem", fontWeight: 600 }}
                        >
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {cart.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell sx={{ fontSize: "1rem" }}>
                            {item.id}
                          </TableCell>
                          <TableCell sx={{ fontSize: "1rem" }}>
                            {item.name}
                          </TableCell>
                          <TableCell sx={{ fontSize: "1rem" }}>
                            {item.allergens || "None"}
                          </TableCell>
                          <TableCell align="right" sx={{ fontSize: "1rem" }}>
                            {item.prepTime}
                          </TableCell>
                          <TableCell align="right" sx={{ fontSize: "1rem" }}>
                            {item.price}
                          </TableCell>
                          <TableCell align="center">
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 1,
                                bgcolor: "background.default",
                                borderRadius: 1,
                                p: 0.5,
                                mx: "auto",
                                width: "fit-content",
                              }}
                            >
                              <IconButton
                                size="medium"
                                onClick={() =>
                                  handleQuantityChange(item.id, -1)
                                }
                                sx={{ color: "primary.main" }}
                              >
                                <RemoveIcon />
                              </IconButton>
                              <Typography
                                sx={{
                                  minWidth: "2em",
                                  textAlign: "center",
                                  fontSize: "1rem",
                                  fontWeight: 600,
                                }}
                              >
                                {item.quantity}
                              </Typography>
                              <IconButton
                                size="medium"
                                onClick={() => handleQuantityChange(item.id, 1)}
                                sx={{ color: "primary.main" }}
                              >
                                <AddIcon />
                              </IconButton>
                            </Box>
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              fontSize: "1rem",
                              fontWeight: 500,
                              color: "primary.main",
                            }}
                          >
                            ₪{item.price * item.quantity}
                          </TableCell>
                          <TableCell align="center">
                            <Tooltip title="Remove from cart">
                              <IconButton
                                size="medium"
                                color="error"
                                onClick={() => removeFromCart(item.id)}
                                sx={{
                                  "&:hover": {
                                    bgcolor: "error.lighter",
                                    transform: "scale(1.1)",
                                  },
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell colSpan={3} align="right">
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Total Prep Time:
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              color: "primary.main",
                            }}
                          >
                            {getTotalPrepTime()} min
                          </Typography>
                        </TableCell>
                        <TableCell colSpan={4} />
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={3} align="right">
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Total Price:
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              color: "primary.main",
                            }}
                          >
                            ₪{getTotalPrice()}
                          </Typography>
                        </TableCell>
                        <TableCell colSpan={4} />
                      </TableRow>
                    </TableFooter>
                  </Table>
                </TableContainer>
              </Paper>

              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                onClick={handlePlaceOrder}
                sx={{
                  mt: 4,
                  py: 2,
                  fontSize: "1.2rem",
                  fontWeight: 600,
                  borderRadius: 2,
                  boxShadow: 3,
                  "&:hover": {
                    boxShadow: 6,
                    transform: "translateY(-2px)",
                  },
                }}
              >
                Place Order
              </Button>
            </Box>
          )}

          <Box sx={{ flexGrow: 1 }} />
        </Box>
      </Container>
    </Layout>
  );
}
