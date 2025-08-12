// form/EditUserForm.jsx
import React, { useState, useEffect } from "react";
import { TextField, MenuItem } from "@mui/material";
import { updateUser } from "../api";
import FormModal from "../components/FormModal"; // vaša shared komponenta

const roles = [
  { value: "user", label: "User" },
  { value: "admin", label: "Admin" },
];

export function EditUserForm({ open, onClose, user, onUserUpdated }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    role: "user",
  });

  // Popuni formu s postojećim podacima kad se otvori
  useEffect(() => {
    if (user && open) {
      setForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        username: user.username || "",
        email: user.email || "",
        role: user.role || "user",
      });
    }
  }, [user, open]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateUser(user.id, form);
      onUserUpdated(response.data);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title="Uredi korisnika"
      onSubmit={handleSubmit}
      submitLabel="Ažuriraj korisnika"
    >
      <TextField
        label="Ime"
        name="firstName"
        value={form.firstName}
        onChange={handleChange}
        required
        fullWidth
        margin="normal"
      />
      <TextField
        label="Prezime"
        name="lastName"
        value={form.lastName}
        onChange={handleChange}
        required
        fullWidth
        margin="normal"
      />
      <TextField
        label="Korisničko ime"
        name="username"
        value={form.username}
        onChange={handleChange}
        required
        fullWidth
        margin="normal"
      />
      <TextField
        label="Email"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        required
        fullWidth
        margin="normal"
      />
      <TextField
        select
        label="Uloga"
        name="role"
        value={form.role}
        onChange={handleChange}
        fullWidth
        margin="normal"
      >
        {roles.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </FormModal>
  );
}
