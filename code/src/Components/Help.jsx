import React from "react";
import {
  Box,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import PaymentIcon from "@mui/icons-material/Payment";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import Layout from "./Layout";

export default function Help() {
  const sections = [
    {
      title: "How to Place an Order",
      icon: <ShoppingCartIcon />,
      content: [
        'Click on "New Order" in the navigation menu',
        "Select your class and room for delivery",
        "Browse through the menu items",
        'Click "Add to Cart" for items you want to order',
        "Adjust quantities using + and - buttons",
        "Choose your payment method",
        'Click "Place Order" to complete your order',
      ],
    },
    {
      title: "Menu and Items",
      icon: <RestaurantMenuIcon />,
      content: [
        "Browse all available items in the menu",
        "View item descriptions and prices",
        "Check for allergen information",
        "See preparation time for each item",
      ],
    },
    {
      title: "Payment Methods",
      icon: <PaymentIcon />,
      content: [
        "We accept the following payment methods:",
        "- Credit Card",
        "- Bit",
        "- Cash",
        "Payment is processed when placing the order",
      ],
    },
    {
      title: "Delivery Information",
      icon: <LocalShippingIcon />,
      content: [
        "Delivery is available to all classrooms",
        "Make sure to provide the correct room number",
        "Track your order status in real-time",
        "Delivery times may vary based on order volume",
      ],
    },
  ];

  return (
    <Layout>
      <Container maxWidth={false} sx={{ maxWidth: "100%" }}>
        <Box sx={{ py: 4 }}>
          <Typography
            variant="h3"
            component="h1"
            align="center"
            gutterBottom
            sx={{ mb: 4, color: "primary.main", fontWeight: 600 }}
          >
            Help & User Guide
          </Typography>

          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="body1" paragraph>
              Welcome to the Ono Cafeteria Ordering System! This guide will help
              you understand how to use our system effectively.
            </Typography>

            {sections.map((section, index) => (
              <Accordion key={index} sx={{ mt: 2 }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ "&.Mui-expanded": { minHeight: 64 } }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    {section.icon}
                    <Typography variant="h6">{section.title}</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {section.content.map((item, i) => (
                      <ListItem key={i}>
                        <ListItemIcon>
                          {item.startsWith("-") ? "•" : i + 1 + "."}
                        </ListItemIcon>
                        <ListItemText
                          primary={item.startsWith("-") ? item.slice(2) : item}
                        />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            ))}
          </Paper>

          <Paper elevation={3} sx={{ p: 3, mt: 4, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Need Additional Help?
            </Typography>
            <Typography variant="body1">
              If you need further assistance or have specific questions, please
              contact the cafeteria staff or your system administrator.
            </Typography>
          </Paper>
        </Box>
      </Container>
    </Layout>
  );
}
