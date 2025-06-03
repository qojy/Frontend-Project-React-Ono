import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Avatar,
  TextField,
  Input,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

export default function MenuDialog({
  open,
  dialogMode,
  editedDish,
  setEditedDish,
  formErrors,
  handleDialogSave,
  setOpenDialog,
}) {
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedDish({ ...editedDish, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpenDialog(false)}>
      <DialogTitle>
        {dialogMode === "add" ? "Add New Dish" : "Edit Dish"}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
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
              setEditedDish({ ...editedDish, description: e.target.value })
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
            helperText={formErrors.allergens || "Example: gluten, dairy, nuts"}
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
        <Button onClick={handleDialogSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
