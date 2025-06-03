import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Avatar,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

export default function MenuTable({ dishes, onEdit, onDelete }) {
  return (
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
                <IconButton onClick={() => onEdit(dish)} color="primary">
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => onDelete(dish)} color="error">
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
