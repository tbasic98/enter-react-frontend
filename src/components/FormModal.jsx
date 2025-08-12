import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from "@mui/material";

export default function FormModal({
  open,
  onClose,
  title,
  onSubmit,
  children,
  submitLabel = "Spremi",
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          {children}
          <DialogActions sx={{ mt: 2 }}>
            <Button onClick={onClose}>Odustani</Button>
            <Button variant="contained" type="submit">
              {submitLabel}
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
