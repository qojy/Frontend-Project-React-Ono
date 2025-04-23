import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

export default function ManageClasses() {
  const [classes, setClasses] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    room: "",
  });

  useEffect(() => {
    const storedClasses = JSON.parse(localStorage.getItem("classes")) || [];
    setClasses(storedClasses);
  }, []);

  const saveToLocalStorage = (updatedClasses) => {
    localStorage.setItem("classes", JSON.stringify(updatedClasses));
    setClasses(updatedClasses);
  };

  const handleOpenDialog = (classData = null) => {
    if (classData) {
      setFormData(classData);
      setSelectedClass(classData);
    } else {
      setFormData({ name: "", room: "" });
      setSelectedClass(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({ name: "", room: "" });
    setSelectedClass(null);
  };

  const handleOpenDeleteDialog = (classData) => {
    setSelectedClass(classData);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedClass(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.room) {
      alert("Please fill in all fields");
      return;
    }

    let updatedClasses;
    if (selectedClass) {
      // Edit existing class
      updatedClasses = classes.map((c) =>
        c.name === selectedClass.name ? { ...formData } : c
      );
    } else {
      // Add new class
      if (classes.some((c) => c.name === formData.name)) {
        alert("A class with this name already exists");
        return;
      }
      updatedClasses = [...classes, formData];
    }

    saveToLocalStorage(updatedClasses);
    handleCloseDialog();
  };

  const handleDelete = () => {
    const updatedClasses = classes.filter((c) => c.name !== selectedClass.name);
    saveToLocalStorage(updatedClasses);
    handleCloseDeleteDialog();
  };

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h5" component="h2">
            Manage Classes
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add New Class
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Class Name</TableCell>
                <TableCell>Room</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {classes.map((classItem) => (
                <TableRow key={classItem.name}>
                  <TableCell>{classItem.name}</TableCell>
                  <TableCell>{classItem.room}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(classItem)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleOpenDeleteDialog(classItem)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {classes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No classes found. Add a new class to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Add/Edit Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>
            {selectedClass ? "Edit Class" : "Add New Class"}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Class Name"
              type="text"
              fullWidth
              value={formData.name}
              onChange={handleInputChange}
              disabled={!!selectedClass}
            />
            <TextField
              margin="dense"
              name="room"
              label="Room"
              type="text"
              fullWidth
              value={formData.room}
              onChange={handleInputChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">
              {selectedClass ? "Save Changes" : "Add Class"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            Are you sure you want to delete {selectedClass?.name}? This action
            cannot be undone.
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
            <Button onClick={handleDelete} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
}
