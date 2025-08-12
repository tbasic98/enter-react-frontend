import { useState } from "react";
import FormModal from "../components/FormModal";
import { MenuItem, TextField } from "@mui/material";
import { createUser } from "../api";
import { toast } from "react-toastify";

const roles = [
  { value: "user", label: "User" },
  { value: "admin", label: "Admin" },
];

export const AddUserForm = ({ open, setOpen, setUsers }) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    role: "user",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createUser(form); // form je stanje s podacima iz forme
      // Dodajemo novog korisnika u listu korisnika (pretpostavljam da imate stanje users i setUsers)
      setUsers((prevUsers) => [response.data, ...prevUsers]);
      // Reset forme na prazno
      setForm({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        role: "user",
      });
      // Zatvori modal
      setOpen(false);
    } catch (error) {
      throw error;
    }
  };

  return (
    <FormModal
      open={open}
      onClose={() => setOpen(false)}
      title="Dodaj novog korisnika"
      onSubmit={handleSubmit}
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
        label="Lozinka"
        name="password"
        type="password"
        value={form.password}
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
};
