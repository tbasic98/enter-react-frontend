// form/EditRoomForm.jsx
import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import { updateRoom } from "../api";
import FormModal from "../components/FormModal";

export function EditRoomForm({ open, onClose, room, onRoomUpdated }) {
  const [form, setForm] = useState({
    name: "",
    location: "",
    capacity: "",
  });

  // Popuni formu s postojećim podacima kad se otvori
  useEffect(() => {
    if (room && open) {
      setForm({
        name: room.name || "",
        location: room.location || "",
        capacity: room.capacity ? room.capacity.toString() : "",
      });
    }
  }, [room, open]);

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

      const response = await updateRoom(room.id, roomData);
      onRoomUpdated(response.data?.room);
    } catch (error) {
      console.error("Error updating room:", error);
    }
  };

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title="Uredi sobu"
      onSubmit={handleSubmit}
      submitLabel="Ažuriraj sobu"
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
        slotProps={{
          input: {
            inputProps: { min: 1 },
          },
        }}
      />
    </FormModal>
  );
}
