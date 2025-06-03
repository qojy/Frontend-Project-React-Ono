import React from "react";
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
  TableFooter,
  IconButton,
  Tooltip,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function CartSummary({
  cart,
  getTotalPrice,
  getTotalPrepTime,
  onRemoveFromCart,
  handlePlaceOrder,
}) {
  if (!cart.length) return null;
  return (
    <Box sx={{ mt: 4 }}>
      <Typography
        variant="h4"
        sx={{ mb: 3, fontWeight: 500, color: "text.primary" }}
      >
        Your Order
      </Typography>
      <Paper elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
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
                  <TableCell sx={{ fontSize: "1rem" }}>{item.id}</TableCell>
                  <TableCell sx={{ fontSize: "1rem" }}>{item.name}</TableCell>
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
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontSize: "1rem",
                      fontWeight: 500,
                      color: "primary.main",
                    }}
                  >
                    {item.price * item.quantity}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Remove from cart">
                      <IconButton
                        size="medium"
                        color="error"
                        onClick={() => onRemoveFromCart(item.id)}
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
                    sx={{ fontWeight: 600, color: "primary.main" }}
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
                    sx={{ fontWeight: 600, color: "primary.main" }}
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
          "&:hover": { boxShadow: 6, transform: "translateY(-2px)" },
        }}
      >
        Place Order
      </Button>
    </Box>
  );
}
