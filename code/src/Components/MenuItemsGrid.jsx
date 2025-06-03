import React from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Button,
  Divider,
  Tooltip,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";

const MenuItemsGrid = ({ menuItems, cart, onAddToCart, onRemoveFromCart }) => {
  const getItemQuantityInCart = (itemId) => {
    const item = cart.find((item) => item.id === itemId);
    return item ? item.quantity : 0;
  };
  return (
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
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={item.id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.16)",
                },
              }}
            >
              <CardMedia
                component="img"
                height="240"
                image={item.image || "https://via.placeholder.com/400x240"}
                alt={item.name}
                sx={{ objectFit: "cover" }}
              />
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="h5"
                    component="h2"
                    sx={{ fontWeight: 700, color: "text.primary" }}
                  >
                    {item.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ID: {item.id}
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 2, minHeight: "3em", lineHeight: 1.5 }}
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
                        onClick={() => onRemoveFromCart(item.id)}
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
                        onClick={() => onAddToCart(item)}
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
                  </Box>
                ) : (
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<AddIcon />}
                    onClick={() => onAddToCart(item)}
                    fullWidth
                    sx={{
                      py: 1,
                      fontWeight: 600,
                      "&:hover": { transform: "scale(1.02)" },
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
  );
};

export default MenuItemsGrid;
