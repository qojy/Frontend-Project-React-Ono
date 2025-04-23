import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Grid, Card, CardContent, Typography } from "@mui/material";
import Layout from "./Layout";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ListAltIcon from "@mui/icons-material/ListAlt";
import HistoryIcon from "@mui/icons-material/History";
import HelpIcon from "@mui/icons-material/Help";

export default function Homepage() {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: "Create New Order",
      icon: <AddShoppingCartIcon sx={{ fontSize: 40 }} />,
      path: "/neworder",
    },
    {
      title: "View Status",
      icon: <ListAltIcon sx={{ fontSize: 40 }} />,
      path: "/orderstatus",
    },
    {
      title: "Order History",
      icon: <HistoryIcon sx={{ fontSize: 40 }} />,
      path: "/orderhistory",
    },
    {
      title: "Help",
      icon: <HelpIcon sx={{ fontSize: 40 }} />,
      path: "/help",
    },
  ];

  return (
    <Layout>
      <div>Homepage Content</div>
    </Layout>
  );
}
