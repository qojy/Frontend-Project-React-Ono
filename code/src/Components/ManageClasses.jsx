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
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import {
  getClasses,
  addClass,
  updateClass,
  deleteClass,
  checkClassNameExists,
} from "../firebase/classes";
import ClassesTable from "./ClassesTable";
import ClassDialog from "./ClassDialog";
import DeleteClassDialog from "./DeleteClassDialog";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    setLoading(true);
    try {
      const loadedClasses = await getClasses();
      setClasses(loadedClasses);
    } catch (error) {
      alert("Error loading classes");
    } finally {
      setLoading(false);
    }
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
    if (!formData.name.trim()) {
      errors.name = "Class name is required";
    }
    if (!/^[A-Za-z]+$/.test(formData.building)) {
      errors.building = "Building name must contain letters only";
    }
    if (!/^[0-9]+$/.test(formData.floor)) {
      errors.floor = "Floor must be a number";
    }
    if (
      !/^[0-9]+$/.test(formData.roomNumber) ||
      parseInt(formData.roomNumber) <= 0
    ) {
      errors.roomNumber = "Room number must be a positive number";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      const fullRoomId = `${formData.building}-${formData.floor}-${formData.roomNumber}`;
      const classData = {
        name: formData.name,
        room: fullRoomId,
      };
      if (selectedClass) {
        await updateClass(selectedClass.id, classData);
        setClasses(
          classes.map((c) =>
            c.id === selectedClass.id ? { ...classData, id: c.id } : c
          )
        );
      } else {
        const exists = await checkClassNameExists(formData.name);
        if (exists) {
          alert("A class with this name already exists");
          return;
        }
        const newId = await addClass(classData);
        setClasses([...classes, { ...classData, id: newId }]);
      }
      handleCloseDialog();
    } catch (error) {
      alert("Error saving class");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteClass(selectedClass.id);
      setClasses(classes.filter((c) => c.id !== selectedClass.id));
      handleCloseDeleteDialog();
    } catch (error) {
      alert("Error deleting class");
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

          <ClassesTable
            classes={classes}
            onEdit={handleOpenDialog}
            onDelete={handleOpenDeleteDialog}
          />

          <ClassDialog
            open={openDialog}
            selectedClass={selectedClass}
            formData={formData}
            setFormData={setFormData}
            formErrors={formErrors}
            onClose={handleCloseDialog}
            onSubmit={handleSubmit}
          />

          <DeleteClassDialog
            open={openDeleteDialog}
            selectedClass={selectedClass}
            onClose={handleCloseDeleteDialog}
            onConfirm={handleDelete}
          />
        </Box>
      </Container>
    </Layout>
  );
}
