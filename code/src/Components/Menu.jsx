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
} from "@mui/material";
import Layout from "./Layout";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

// Default menu items if nothing is in localStorage
const defaultDishes = [
  {
    id: 1,
    name: "Pizza",
    price: 50,
    description: "Classic Margherita Pizza",
    image: null,
  },
  {
    id: 2,
    name: "Hamburger",
    price: 45,
    description: "Beef burger with fries",
    image: null,
  },
  {
    id: 3,
    name: "Salad",
    price: 25,
    description: "Fresh garden salad",
    image: null,
  },
];

export default function Menu() {
  const navigate = useNavigate();
  const [dishes, setDishes] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("add");
  const [selectedDish, setSelectedDish] = useState(null);
  const [editedDish, setEditedDish] = useState({
    name: "",
    price: "",
    description: "",
    image: null,
  });

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [dishToDelete, setDishToDelete] = useState(null);

  useEffect(() => {
    const savedDishes = localStorage.getItem("menuDishes");
    if (savedDishes) {
      setDishes(JSON.parse(savedDishes));
    } else {
      setDishes(defaultDishes);
      localStorage.setItem("menuDishes", JSON.stringify(defaultDishes));
    }
  }, []);

  useEffect(() => {
    if (dishes.length > 0) {
      localStorage.setItem("menuDishes", JSON.stringify(dishes));
    }
  }, [dishes]);

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
    setEditedDish({ name: "", price: "", description: "", image: null });
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

  const confirmDelete = () => {
    setDishes(dishes.filter((dish) => dish.id !== dishToDelete.id));
    setDeleteConfirmOpen(false);
  };

  const handleDialogSave = () => {
    if (!editedDish.name || !editedDish.price) {
      alert("Please fill in both name and price fields");
      return;
    }

    if (dialogMode === "add") {
      const newDish = {
        id: Math.max(...dishes.map((d) => d.id), 0) + 1,
        ...editedDish,
        price: Number(editedDish.price),
      };
      setDishes([...dishes, newDish]);
    } else {
      setDishes(
        dishes.map((dish) =>
          dish.id === selectedDish.id
            ? { ...editedDish, id: dish.id, price: Number(editedDish.price) }
            : dish
        )
      );
    }
    setOpenDialog(false);
  };

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <IconButton onClick={() => navigate("/")} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
            Menu Management
          </Typography>
          <Tooltip title="Add New Dish">
            <Fab color="primary" onClick={handleAddNew}>
              <AddIcon />
            </Fab>
          </Tooltip>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Price (₪)</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dishes.map((dish) => (
                <TableRow key={dish.id}>
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
                  <TableCell align="right">{dish.price}</TableCell>
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
              <TextField
                autoFocus
                margin="dense"
                label="Dish Name"
                fullWidth
                value={editedDish.name}
                onChange={(e) =>
                  setEditedDish({ ...editedDish, name: e.target.value })
                }
              />
              <TextField
                margin="dense"
                label="Price"
                type="number"
                fullWidth
                value={editedDish.price}
                onChange={(e) =>
                  setEditedDish({ ...editedDish, price: e.target.value })
                }
              />
              <TextField
                margin="dense"
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={editedDish.description}
                onChange={(e) =>
                  setEditedDish({ ...editedDish, description: e.target.value })
                }
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
            <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
            <Button onClick={confirmDelete} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
}
