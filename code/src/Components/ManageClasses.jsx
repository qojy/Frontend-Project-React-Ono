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
  Fab,
  Tooltip,
  Container,
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
    building: "",
    floor: "",
    roomNumber: "",
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    building: "",
    floor: "",
    roomNumber: "",
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
      const [building, floor, roomNumber] = classData.room.split("-");
      setFormData({
        name: classData.name,
        building,
        floor,
        roomNumber,
      });
      setSelectedClass(classData);
    } else {
      setFormData({ name: "", building: "", floor: "", roomNumber: "" });
      setSelectedClass(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({ name: "", building: "", floor: "", roomNumber: "" });
    setFormErrors({ name: "", building: "", floor: "", roomNumber: "" });
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

  const validateForm = () => {
    const errors = {};

    // Validate building (letters only)
    if (!/^[A-Za-z]+$/.test(formData.building)) {
      errors.building = "Building name must contain letters only";
    }

    // Validate floor (numbers only)
    if (!/^\d+$/.test(formData.floor)) {
      errors.floor = "Floor must be a number";
    }

    // Validate room number (positive number)
    if (
      !/^\d+$/.test(formData.roomNumber) ||
      parseInt(formData.roomNumber) <= 0
    ) {
      errors.roomNumber = "Room number must be a positive number";
    }

    return errors;
  };

  const handleSubmit = () => {
    if (
      !formData.name ||
      !formData.building ||
      !formData.floor ||
      !formData.roomNumber
    ) {
      alert("Please fill in all fields");
      return;
    }

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const fullRoomId = `${formData.building}-${formData.floor}-${formData.roomNumber}`;
    const classData = {
      name: formData.name,
      room: fullRoomId,
    };

    let updatedClasses;
    if (selectedClass) {
      // Edit existing class
      updatedClasses = classes.map((c) =>
        c.name === selectedClass.name ? classData : c
      );
    } else {
      // Add new class
      if (classes.some((c) => c.name === formData.name)) {
        alert("A class with this name already exists");
        return;
      }
      updatedClasses = [...classes, classData];
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
      <Container maxWidth={false} sx={{ maxWidth: "100%" }}>
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 4, gap: 3 }}>
            <Typography
              variant="h5"
              component="h2"
              sx={{ color: "primary.main" }}
            >
              Manage Classes
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Tooltip title="Add New Class">
              <Fab color="primary" onClick={() => handleOpenDialog()}>
                <AddIcon />
              </Fab>
            </Tooltip>
          </Box>

          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
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
                name="building"
                label="Building Name (letters only)"
                type="text"
                fullWidth
                value={formData.building}
                onChange={handleInputChange}
                error={!!formErrors.building}
                helperText={formErrors.building}
              />
              <TextField
                margin="dense"
                name="floor"
                label="Floor Number"
                type="text"
                fullWidth
                value={formData.floor}
                onChange={handleInputChange}
                error={!!formErrors.floor}
                helperText={formErrors.floor}
              />
              <TextField
                margin="dense"
                name="roomNumber"
                label="Room Number"
                type="text"
                fullWidth
                value={formData.roomNumber}
                onChange={handleInputChange}
                error={!!formErrors.roomNumber}
                helperText={formErrors.roomNumber}
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
      </Container>
    </Layout>
  );
}
