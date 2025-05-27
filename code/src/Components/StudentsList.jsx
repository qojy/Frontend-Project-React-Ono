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
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import Layout from "./Layout";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  checkStudentIdExists,
} from "../firebase/students";

export default function StudentsList() {
  const [students, setStudents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    id: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const loadedStudents = await getStudents();
      setStudents(loadedStudents);
    } catch (error) {
      console.error("Error loading students:", error);
      alert("Error loading students. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (student = null) => {
    if (student) {
      setFormData(student);
      setSelectedStudent(student);
    } else {
      setFormData({ fullName: "", id: "" });
      setSelectedStudent(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({ fullName: "", id: "" });
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

  const handleSubmit = async () => {
    if (!formData.fullName || !formData.id) {
      alert("Please fill in all fields");
      return;
    }

    try {
      if (selectedStudent) {
        // Edit existing student
        await updateStudent(selectedStudent.id, formData);
      } else {
        // Check if student ID already exists
        const exists = await checkStudentIdExists(formData.id);
        if (exists) {
          alert("A student with this ID already exists");
          return;
        }
        // Add new student
        await addStudent(formData);
      }

      await loadStudents(); // Reload the students list
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving student:", error);
      alert("Error saving student. Please try again.");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteStudent(selectedStudent.id);
      await loadStudents(); // Reload the students list
      handleCloseDeleteDialog();
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("Error deleting student. Please try again.");
    }
  };

  if (loading) {
    return (
      <Layout>
        <Container>
          <Typography>Loading students...</Typography>
        </Container>
      </Layout>
    );
  }

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
                    <TableCell>{student.fullName}</TableCell>
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
                name="fullName"
                label="Full Name"
                type="text"
                fullWidth
                value={formData.fullName}
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
              Are you sure you want to delete {selectedStudent?.fullName}? This
              action cannot be undone.
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
