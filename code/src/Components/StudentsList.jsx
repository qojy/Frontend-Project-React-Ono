import React, { useState, useEffect } from "react";
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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Fab,
  Tooltip,
  Container,
} from "@mui/material";
import Layout from "./Layout";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { addStudent } from "../firebase/students";

export default function StudentsList() {
  const [students, setStudents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    id: "",
  });

  useEffect(() => {
    const loadedStudents = JSON.parse(localStorage.getItem("students") || "[]");
    setStudents(loadedStudents);
  }, []);

  const saveToLocalStorage = (updatedStudents) => {
    localStorage.setItem("students", JSON.stringify(updatedStudents));
    setStudents(updatedStudents);
  };

  addStudent(students).then(() => {
    navigate("/students");
  });

  const handleOpenDialog = (student = null) => {
    if (student) {
      setFormData(student);
      setSelectedStudent(student);
    } else {
      setFormData({ firstName: "", lastName: "", id: "" });
      setSelectedStudent(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({ firstName: "", lastName: "", id: "" });
    setSelectedStudent(null);
  };

  const handleOpenDeleteDialog = (student) => {
    setSelectedStudent(student);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedStudent(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (!formData.firstName || !formData.lastName || !formData.id) {
      alert("Please fill in all fields");
      return;
    }

    let updatedStudents;
    if (selectedStudent) {
      // Edit existing student
      updatedStudents = students.map((s) =>
        s.id === selectedStudent.id ? { ...formData } : s
      );
    } else {
      // Add new student
      if (students.some((s) => s.id === formData.id)) {
        alert("A student with this ID already exists");
        return;
      }
      updatedStudents = [...students, formData];
    }

    saveToLocalStorage(updatedStudents);
    handleCloseDialog();
  };

  const handleDelete = () => {
    const updatedStudents = students.filter((s) => s.id !== selectedStudent.id);
    saveToLocalStorage(updatedStudents);
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
              Students List
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Tooltip title="Add New Student">
              <Fab color="primary" onClick={() => handleOpenDialog()}>
                <AddIcon />
              </Fab>
            </Tooltip>
          </Box>

          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Full Name</TableCell>
                  <TableCell>ID</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      {student.firstName} {student.lastName}
                    </TableCell>
                    <TableCell>{student.id}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(student)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleOpenDeleteDialog(student)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {students.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No students found. Add a new student to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Add/Edit Dialog */}
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>
              {selectedStudent ? "Edit Student" : "Add New Student"}
            </DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                name="firstName"
                label="First Name"
                type="text"
                fullWidth
                value={formData.firstName}
                onChange={handleInputChange}
              />
              <TextField
                margin="dense"
                name="lastName"
                label="Last Name"
                type="text"
                fullWidth
                value={formData.lastName}
                onChange={handleInputChange}
              />
              <TextField
                margin="dense"
                name="id"
                label="Student ID"
                type="text"
                fullWidth
                value={formData.id}
                onChange={handleInputChange}
                disabled={!!selectedStudent}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button onClick={handleSubmit} variant="contained">
                {selectedStudent ? "Save Changes" : "Add Student"}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
              Are you sure you want to delete {selectedStudent?.firstName}{" "}
              {selectedStudent?.lastName}? This action cannot be undone.
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
