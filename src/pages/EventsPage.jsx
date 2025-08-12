import React, { useEffect, useState } from "react";
import {
  fetchEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  fetchRooms,
} from "../api";

const DURATION_OPTIONS = [15, 30, 45, 60];

function minutesToTimeString(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

function timeStringToMinutes(time) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [form, setForm] = useState({
    title: "",
    room_id: "",
    start_time: "08:00",
    duration: 15,
  });
  const [error, setError] = useState(null);

  // Load events & rooms
  const loadData = async () => {
    setLoading(true);
    try {
      const [evRes, roomsRes] = await Promise.all([
        fetchEvents(),
        fetchRooms(),
      ]);
      setEvents(evRes.data);
      setRooms(roomsRes.data);
    } catch {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const startEdit = (ev) => {
    setEditingEvent(ev);
    const startMinutes = timeStringToMinutes(ev.start_time);
    const endMinutes = timeStringToMinutes(ev.end_time);
    setForm({
      title: ev.title,
      room_id: ev.room_id,
      start_time: ev.start_time,
      duration: endMinutes - startMinutes,
    });
  };

  const cancelEdit = () => {
    setEditingEvent(null);
    setForm({ title: "", room_id: "", start_time: "08:00", duration: 15 });
    setError(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Calculate available durations for selected room and start_time
  const getAvailableDurations = () => {
    if (!form.room_id || !form.start_time) return [];

    const startM = timeStringToMinutes(form.start_time);
    const roomEvents = events
      .filter(
        (ev) =>
          ev.room_id === Number(form.room_id) &&
          ev.id !== (editingEvent ? editingEvent.id : null)
      )
      .map((ev) => ({
        start: timeStringToMinutes(ev.start_time),
        end: timeStringToMinutes(ev.end_time),
      }));

    // Find next event after startM
    const nextEvent = roomEvents
      .filter((ev) => ev.start >= startM)
      .sort((a, b) => a.start - b.start)[0];
    const maxEnd = nextEvent ? nextEvent.start : 24 * 60; // max end of day if no next event

    const maxDuration = maxEnd - startM;
    // Max 60 minutes max duration, minimum duration is 15 mins
    const availableDurations = DURATION_OPTIONS.filter((d) => d <= maxDuration);

    return availableDurations;
  };

  const availableDurations = getAvailableDurations();

  // Check if can create event at all (minimum 15 mins gap)
  const canCreateEvent = availableDurations.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!form.room_id) {
      toast.error("Room is required");
      return;
    }
    if (!form.start_time) {
      toast.error("Start time is required");
      return;
    }
    if (!availableDurations.includes(Number(form.duration))) {
      toast.error("Invalid duration selected or does not fit in schedule");
      return;
    }

    const startM = timeStringToMinutes(form.start_time);
    const endM = startM + Number(form.duration);
    const eventData = {
      title: form.title,
      room_id: Number(form.room_id),
      start_time: form.start_time,
      end_time: minutesToTimeString(endM),
    };

    try {
      if (editingEvent) {
        await updateEvent(editingEvent.id, eventData);
      } else {
        await createEvent(eventData);
      }
      cancelEdit();
      loadData();
    } catch {
      toast.error("Failed to save event");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await deleteEvent(id);
      loadData();
    } catch {
      toast.error("Failed to delete event");
    }
  };

  return (
    <div className="container-wrapper">
      <div className="container">
        <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
          <input
            name="title"
            placeholder="Event Title"
            value={form.title}
            onChange={handleChange}
            required
            style={{ marginRight: 10 }}
          />

          <select
            name="room_id"
            value={form.room_id}
            onChange={handleChange}
            required
            style={{ marginRight: 10 }}
          >
            <option value="">Select Room</option>
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>

          <input
            type="time"
            name="start_time"
            value={form.start_time}
            onChange={handleChange}
            min="00:00"
            max="23:59"
            step="900" // 15 min increments
            required
            style={{ marginRight: 10 }}
          />

          <select
            name="duration"
            value={form.duration}
            onChange={handleChange}
            disabled={!canCreateEvent}
            required
            style={{ marginRight: 10 }}
          >
            {availableDurations.length === 0 && (
              <option>No available durations</option>
            )}
            {availableDurations.map((d) => (
              <option key={d} value={d}>
                {d} minutes
              </option>
            ))}
          </select>

          <button type="submit" disabled={!canCreateEvent}>
            {editingEvent ? "Update" : "Create"}
          </button>
          {editingEvent && (
            <button
              onClick={cancelEdit}
              type="button"
              style={{ marginLeft: 10 }}
            >
              Cancel
            </button>
          )}
        </form>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <table border="1" cellPadding="5" cellSpacing="0" width="100%">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Room</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Duration</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    No events found.
                  </td>
                </tr>
              )}
              {events.map((ev) => (
                <tr key={ev.id}>
                  <td>{ev.id}</td>
                  <td>{ev.title}</td>
                  <td>
                    {rooms.find((r) => r.id === ev.room_id)?.name || "Unknown"}
                  </td>
                  <td>{ev.start_time}</td>
                  <td>{ev.end_time}</td>
                  <td>
                    {timeStringToMinutes(ev.end_time) -
                      timeStringToMinutes(ev.start_time)}{" "}
                    min
                  </td>
                  <td>
                    <button onClick={() => startEdit(ev)}>Edit</button>
                    <button
                      onClick={() => handleDelete(ev.id)}
                      style={{ marginLeft: 10 }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
