import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

export default function ClassDialog({
  open,
  selectedClass,
  formData,
  setFormData,
  formErrors,
  onClose,
  onSubmit,
}) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <Dialog open={open} onClose={onClose}>
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
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSubmit} variant="contained">
          {selectedClass ? "Save Changes" : "Add Class"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
