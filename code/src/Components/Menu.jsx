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
      <Container maxWidth={false} sx={{ maxWidth: "100%" }}>
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

          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Image</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Allergens</TableCell>
                  <TableCell align="right">Price (₪)</TableCell>
                  <TableCell align="right">Prep Time (min)</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dishes.map((dish) => (
                  <TableRow key={dish.id}>
                    <TableCell>{dish.id}</TableCell>
                    <TableCell>
                      <Avatar
                        src={dish.image}
                        alt={dish.name}
                        variant="rounded"
                        sx={{ width: 60, height: 60 }}
                      >
                        {!dish.image && <AddPhotoAlternateIcon />}
                      </Avatar>
                    </TableCell>
                    <TableCell>{dish.name}</TableCell>
                    <TableCell>{dish.description}</TableCell>
                    <TableCell>{dish.allergens || "None"}</TableCell>
                    <TableCell align="right">{dish.price}</TableCell>
                    <TableCell align="right">{dish.prepTime}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={() => handleEdit(dish)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(dish)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
            <DialogTitle>
              {dialogMode === "add" ? "Add New Dish" : "Edit Dish"}
            </DialogTitle>
            <DialogContent>
              <Box
                sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    src={editedDish.image}
                    alt={editedDish.name}
                    variant="rounded"
                    sx={{ width: 100, height: 100 }}
                  >
                    {!editedDish.image && <AddPhotoAlternateIcon />}
                  </Avatar>
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<AddPhotoAlternateIcon />}
                  >
                    Upload Image
                    <Input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </Button>
                </Box>
                {dialogMode === "add" && (
                  <TextField
                    margin="dense"
                    label="Dish ID"
                    fullWidth
                    value={editedDish.id}
                    onChange={(e) =>
                      setEditedDish({ ...editedDish, id: e.target.value })
                    }
                    error={!!formErrors.id}
                    helperText={formErrors.id}
                  />
                )}
                <TextField
                  margin="dense"
                  label="Dish Name (letters only)"
                  fullWidth
                  value={editedDish.name}
                  onChange={(e) =>
                    setEditedDish({ ...editedDish, name: e.target.value })
                  }
                  error={!!formErrors.name}
                  helperText={formErrors.name}
                />
                <TextField
                  margin="dense"
                  label="Price (₪)"
                  type="number"
                  fullWidth
                  value={editedDish.price}
                  onChange={(e) =>
                    setEditedDish({ ...editedDish, price: e.target.value })
                  }
                  error={!!formErrors.price}
                  helperText={formErrors.price}
                />
                <TextField
                  margin="dense"
                  label="Description"
                  fullWidth
                  multiline
                  rows={3}
                  value={editedDish.description}
                  onChange={(e) =>
                    setEditedDish({
                      ...editedDish,
                      description: e.target.value,
                    })
                  }
                />
                <TextField
                  margin="dense"
                  label="Allergens (comma-separated)"
                  fullWidth
                  value={editedDish.allergens}
                  onChange={(e) =>
                    setEditedDish({ ...editedDish, allergens: e.target.value })
                  }
                  error={!!formErrors.allergens}
                  helperText={
                    formErrors.allergens || "Example: gluten, dairy, nuts"
                  }
                />
                <TextField
                  margin="dense"
                  label="Preparation Time (minutes)"
                  type="number"
                  fullWidth
                  value={editedDish.prepTime}
                  onChange={(e) =>
                    setEditedDish({ ...editedDish, prepTime: e.target.value })
                  }
                  error={!!formErrors.prepTime}
                  helperText={formErrors.prepTime}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button
                onClick={handleDialogSave}
                variant="contained"
                color="primary"
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={deleteConfirmOpen}
            onClose={() => setDeleteConfirmOpen(false)}
          >
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              Are you sure you want to delete {dishToDelete?.name}?
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteConfirmOpen(false)}>
                Cancel
              </Button>
              <Button onClick={confirmDelete} color="error" variant="contained">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Container>
    </Layout>
  );
}
