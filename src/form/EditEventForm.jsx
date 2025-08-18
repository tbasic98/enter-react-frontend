// form/EditEventForm.jsx
import React, { useState, useEffect } from "react";
import { TextField, MenuItem, Alert, Grid } from "@mui/material";
import {
  LocalizationProvider,
  DatePicker,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { hr } from "date-fns/locale";
import { updateEvent, fetchRooms } from "../api";
import FormModal from "../components/FormModal";

export function EditEventForm({ open, onClose, event, onEventUpdated }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    startDate: null,
    startTime: null,
    endDate: null,
    endTime: null,
    roomId: "",
  });

  const [rooms, setRooms] = useState([]);
  const [validationError, setValidationError] = useState("");

  // Dohvati sobe za dropdown
  useEffect(() => {
    if (open) {
      fetchRooms()
        .then((response) => {
          setRooms(response.data?.rooms || response.data || []);
        })
        .catch((error) => {
          console.error("Error fetching rooms:", error);
        });
    }
  }, [open]);

  // Popuni formu s postojećim podacima
  useEffect(() => {
    if (event && open) {
      const startDate = event.startTime ? new Date(event.startTime) : null;
      const endDate = event.endTime ? new Date(event.endTime) : null;

      setForm({
        title: event.title || "",
        description: event.description || "",
        startDate: startDate,
        startTime: startDate,
        endDate: endDate,
        endTime: endDate,
        roomId: event.roomId ? event.roomId.toString() : "",
      });
    }
  }, [event, open]);

  // Helper funkcija za kombiniranje datuma i vremena
  const combineDateTime = (date, time) => {
    if (!date || !time) return null;

    const dateObj = new Date(date);
    const timeObj = new Date(time);

    dateObj.setHours(timeObj.getHours(), timeObj.getMinutes(), 0, 0);
    return dateObj;
  };

  // Validacija datuma i vremena
  const validateDateTime = (startDateTime, endDateTime) => {
    if (!startDateTime || !endDateTime) {
      return "";
    }

    if (startDateTime >= endDateTime) {
      return "Početak meetinga mora biti prije završetka meetinga.";
    }

    const startDate = startDateTime.toDateString();
    const endDate = endDateTime.toDateString();

    if (startDate !== endDate) {
      return "Meeting mora počinjati i završavati istog dana.";
    }

    return "";
  };

  const handleDateTimeChange = () => {
    const startDateTime = combineDateTime(form.startDate, form.startTime);
    const endDateTime = combineDateTime(form.endDate, form.endTime);

    if (startDateTime && endDateTime) {
      const error = validateDateTime(startDateTime, endDateTime);
      setValidationError(error);
    } else {
      setValidationError("");
    }
  };

  const handleDateChange = (field, date) => {
    setForm((prev) => ({ ...prev, [field]: date }));
    setTimeout(handleDateTimeChange, 0);
  };

  const handleTimeChange = (field, time) => {
    setForm((prev) => ({ ...prev, [field]: time }));
    setTimeout(handleDateTimeChange, 0);
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const startDateTime = combineDateTime(form.startDate, form.startTime);
    const endDateTime = combineDateTime(form.endDate, form.endTime);

    const validationErr = validateDateTime(startDateTime, endDateTime);

    if (validationErr) {
      setValidationError(validationErr);
      return;
    }

    try {
      const eventData = {
        title: form.title,
        description: form.description || null,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        roomId: parseInt(form.roomId, 10),
      };

      const response = await updateEvent(event.id, eventData);
      onEventUpdated(response.data);
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  return (
    <FormModal
      open={open}
      onClose={() => {
        onClose();
        setValidationError("");
      }}
      title="Uredi meeting"
      onSubmit={handleSubmit}
      submitLabel="Ažuriraj meeting"
      submitDisabled={!!validationError}
    >
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={hr}>
        <TextField
          label="Naziv meetinga"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
          placeholder="Unesite naziv meetinga"
        />

        <TextField
          label="Opis"
          name="description"
          value={form.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
          rows={3}
          placeholder="Opcionalni opis meetinga"
        />

        {/* Početak meetinga */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="Datum početka"
              value={form.startDate}
              onChange={(date) => handleDateChange("startDate", date)}
              format="dd/MM/yyyy"
              slotProps={{
                textField: {
                  required: true,
                  fullWidth: true,
                  error: validationError.includes("Početak"),
                  helperText: "DD/MM/YYYY",
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TimePicker
              label="Vrijeme početka"
              value={form.startTime}
              onChange={(time) => handleTimeChange("startTime", time)}
              format="HH:mm"
              ampm={false}
              slotProps={{
                textField: {
                  required: true,
                  fullWidth: true,
                  error: validationError.includes("Početak"),
                  helperText: "24h format",
                },
              }}
            />
          </Grid>
        </Grid>

        {/* Završetak meetinga */}
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="Datum završetka"
              value={form.endDate}
              onChange={(date) => handleDateChange("endDate", date)}
              format="dd/MM/yyyy"
              slotProps={{
                textField: {
                  required: true,
                  fullWidth: true,
                  error:
                    validationError.includes("završetak") ||
                    validationError.includes("dan"),
                  helperText: "DD/MM/YYYY",
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TimePicker
              label="Vrijeme završetka"
              value={form.endTime}
              onChange={(time) => handleTimeChange("endTime", time)}
              format="HH:mm"
              ampm={false}
              slotProps={{
                textField: {
                  required: true,
                  fullWidth: true,
                  error:
                    validationError.includes("završetak") ||
                    validationError.includes("dan"),
                  helperText: "24h format",
                },
              }}
            />
          </Grid>
        </Grid>

        {validationError && (
          <Alert severity="error" sx={{ mt: 2, mb: 1 }}>
            {validationError}
          </Alert>
        )}

        <TextField
          select
          label="Soba"
          name="roomId"
          value={form.roomId}
          onChange={handleChange}
          required
          fullWidth
          margin="normal"
          helperText="Odaberite sobu za meeting"
        >
          <MenuItem value="">
            <em>Odaberite sobu</em>
          </MenuItem>
          {rooms.map((room) => (
            <MenuItem key={room.id} value={room.id}>
              {room.name} {room.location && `(${room.location})`}
            </MenuItem>
          ))}
        </TextField>
      </LocalizationProvider>
    </FormModal>
  );
}
