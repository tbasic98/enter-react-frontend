// form/AddRoomForm.jsx
import React, { useState } from "react";
import { TextField } from "@mui/material";
import { createRoom } from "../api";
import FormModal from "../components/FormModal";

export function AddRoomForm({ open, onClose, onRoomAdded }) {
  const [form, setForm] = useState({
    name: "",
    location: "",
    capacity: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Pripremi podatke - pretvori capacity u broj ili postavi null
      const roomData = {
        name: form.name,
        location: form.location || null,
        capacity: form.capacity ? parseInt(form.capacity, 10) : null,
      };

      const response = await createRoom(roomData);
      onRoomAdded(response.data);
      setForm({ name: "", location: "", capacity: "" }); // reset form
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title="Dodaj novu sobu"
      onSubmit={handleSubmit}
      submitLabel="Dodaj sobu"
    >
      <TextField
        label="Naziv sobe"
        name="name"
        value={form.name}
        onChange={handleChange}
        required
        fullWidth
        margin="normal"
        placeholder="Unesite naziv sobe"
      />
      <TextField
        label="Lokacija"
        name="location"
        value={form.location}
        onChange={handleChange}
        fullWidth
        margin="normal"
        placeholder="Npr. Prvi kat, Zgrada A"
      />
      <TextField
        label="Kapacitet"
        name="capacity"
        type="number"
        value={form.capacity}
        onChange={handleChange}
        fullWidth
        margin="normal"
        placeholder="Broj osoba"
        inputProps={{ min: 1 }}
      />
    </FormModal>
  );
}
