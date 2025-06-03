import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Fab,
  Tooltip,
  Input,
  Avatar,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import Layout from "./Layout";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import {
  getMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../firebase/menu";
import MenuTable from "./MenuTable";
import MenuDialog from "./MenuDialog";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import CircularProgress from "@mui/material/CircularProgress";

// Default menu items if nothing is in localStorage
const defaultDishes = [
  {
    id: "1",
    name: "Pizza",
    price: 50,
    description: "Classic Margherita Pizza",
    image: null,
    allergens: "gluten, dairy",
    prepTime: 20,
  },
  {
    id: "2",
    name: "Hamburger",
    price: 45,
    description: "Beef burger with fries",
    image: null,
    allergens: "gluten, eggs, sesame",
    prepTime: 15,
  },
  {
    id: "3",
    name: "Salad",
    price: 25,
    description: "Fresh garden salad",
    image: null,
    allergens: "",
    prepTime: 10,
  },
];

export default function Menu() {
  const navigate = useNavigate();
  const [dishes, setDishes] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("add");
  const [selectedDish, setSelectedDish] = useState(null);
  const [editedDish, setEditedDish] = useState({
    id: "",
    name: "",
    price: "",
    description: "",
    image: null,
    allergens: "",
    prepTime: "",
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [dishToDelete, setDishToDelete] = useState(null);
  const [formErrors, setFormErrors] = useState({
    id: "",
    name: "",
    price: "",
    allergens: "",
    prepTime: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    setLoading(true);
    try {
      const loadedDishes = await getMenuItems();
      setDishes(loadedDishes);
    } catch (error) {
      alert("Error loading menu items");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedDish({
          ...editedDish,
          image: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddNew = () => {
    setDialogMode("add");
    setEditedDish({
      id: "",
      name: "",
      price: "",
      description: "",
      image: null,
      allergens: "",
      prepTime: "",
    });
    setOpenDialog(true);
  };

  const handleEdit = (dish) => {
    setDialogMode("edit");
    setSelectedDish(dish);
    setEditedDish({ ...dish });
    setOpenDialog(true);
  };

  const handleDelete = (dish) => {
    setDishToDelete(dish);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteMenuItem(dishToDelete.id);
      setDishes(dishes.filter((dish) => dish.id !== dishToDelete.id));
      setDeleteConfirmOpen(false);
    } catch (error) {
      alert("Error deleting menu item");
    }
  };

  const validateForm = () => {
    const errors = {};
    if (
      dialogMode === "add" &&
      dishes.some((dish) => dish.id === editedDish.id)
    ) {
      errors.id = "Dish ID must be unique";
    }
    if (!/^[A-Za-z\s]+$/.test(editedDish.name)) {
      errors.name = "Name must contain letters only";
    }
    if (!editedDish.price || parseFloat(editedDish.price) <= 0) {
      errors.price = "Price must be a positive number";
    }
    if (
      editedDish.allergens &&
      !/^[A-Za-z]+(,[A-Za-z]+)*$/.test(editedDish.allergens.replace(/\s/g, ""))
    ) {
      errors.allergens = "Allergens must be comma-separated words";
    }
    if (!editedDish.prepTime || parseInt(editedDish.prepTime) <= 0) {
      errors.prepTime = "Preparation time must be a positive number";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleDialogSave = async () => {
    if (!validateForm()) return;
    try {
      if (dialogMode === "add") {
        const newDish = {
          ...editedDish,
          price: Number(editedDish.price),
          prepTime: Number(editedDish.prepTime),
        };
        const newId = await addMenuItem(newDish);
        setDishes([...dishes, { ...newDish, id: newId }]);
      } else {
        const updatedDish = {
          ...editedDish,
          price: Number(editedDish.price),
          prepTime: Number(editedDish.prepTime),
        };
        await updateMenuItem(selectedDish.id, updatedDish);
        setDishes(
          dishes.map((dish) =>
            dish.id === selectedDish.id ? { ...updatedDish, id: dish.id } : dish
          )
        );
      }
      setOpenDialog(false);
    } catch (error) {
      alert("Error saving menu item");
    }
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
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 4, gap: 3 }}>
              <IconButton onClick={() => navigate("/")} sx={{ mr: 2 }}>
                <ArrowBackIcon />
              </IconButton>
              <Typography
                variant="h5"
                component="h2"
                sx={{ color: "primary.main" }}
              >
                Menu
              </Typography>
              <Box sx={{ flexGrow: 1 }} />
              <Tooltip title="Add New Dish">
                <Fab color="primary" onClick={handleAddNew}>
                  <AddIcon />
                </Fab>
              </Tooltip>
            </Box>

            <MenuTable
              dishes={dishes}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />

            <MenuDialog
              open={openDialog}
              dialogMode={dialogMode}
              editedDish={editedDish}
              setEditedDish={setEditedDish}
              formErrors={formErrors}
              handleDialogSave={handleDialogSave}
              setOpenDialog={setOpenDialog}
            />

            <DeleteConfirmDialog
              open={deleteConfirmOpen}
              dishToDelete={dishToDelete}
              onClose={() => setDeleteConfirmOpen(false)}
              onConfirm={confirmDelete}
            />
          </Box>
        )}
      </Container>
    </Layout>
  );
}
