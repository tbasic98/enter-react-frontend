import React, { useEffect, useState } from "react";
import { fetchRooms, createRoom, updateRoom, deleteRoom } from "../api";

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [form, setForm] = useState({ name: "" });
  const [error, setError] = useState(null);

  const loadRooms = async () => {
    setLoading(true);
    try {
      const res = await fetchRooms();
      setRooms(res.data);
    } catch (err) {
      setError("Failed to load rooms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const startEdit = (room) => {
    setEditingRoom(room);
    setForm({ name: room.name });
  };

  const cancelEdit = () => {
    setEditingRoom(null);
    setForm({ name: "" });
    setError(null);
  };

  const handleChange = (e) => {
    setForm({ name: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!form.name.trim()) {
      setError("Room name is required");
      return;
    }
    try {
      if (editingRoom) {
        await updateRoom(editingRoom.id, form);
      } else {
        await createRoom(form);
      }
      cancelEdit();
      loadRooms();
    } catch {
      setError("Failed to save room");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;
    try {
      await deleteRoom(id);
      loadRooms();
    } catch {
      setError("Failed to delete room");
    }
  };

  return (
    <div className="container-wrapper">
      <div className="container">
        <h2>Rooms</h2>
        {error && <div style={{ color: "red" }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
          <input
            name="name"
            placeholder="Room Name"
            value={form.name}
            onChange={handleChange}
            required
            style={{ marginRight: 10 }}
          />
          <button type="submit">{editingRoom ? "Update" : "Create"}</button>
          {editingRoom && (
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
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.length === 0 && (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center" }}>
                    No rooms found.
                  </td>
                </tr>
              )}
              {rooms.map((room) => (
                <tr key={room.id}>
                  <td>{room.id}</td>
                  <td>{room.name}</td>
                  <td>
                    <button onClick={() => startEdit(room)}>Edit</button>
                    <button
                      onClick={() => handleDelete(room.id)}
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
