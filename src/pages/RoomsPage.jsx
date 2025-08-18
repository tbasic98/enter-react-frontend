import React, { useEffect, useState } from "react";
import { fetchRooms, deleteRoom } from "../api";
import { AddRoomForm } from "../form/AddRoomForm";
import { EditRoomForm } from "../form/EditRoomForm";
import { DeleteConfirmationModal } from "../modal/DeleteConfirmationModal";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  IconButton,
  Container,
  Chip,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";

export default function RoomsPage() {
  // State management
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Fetch rooms on component mount
  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    setLoading(true);
    try {
      const response = await fetchRooms();
      setRooms(response.data?.rooms || response.data || []);
    } catch (err) {
      setError("Greška pri dohvaćanju soba");
      console.error("Error fetching rooms:", err);
    } finally {
      setLoading(false);
    }
  };

  // Event handlers
  const handleAddRoom = () => {
    setOpen(true);
  };

  const handleRoomAdded = (newRoom) => {
    setRooms((prevRooms) => [...prevRooms, newRoom]);
    setOpen(false);
  };

  const handleEditRoom = (room) => {
    setSelectedRoom(room);
    setEditOpen(true);
  };

  const handleRoomUpdated = (updatedRoom) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) => (room.id === updatedRoom.id ? updatedRoom : room))
    );
    setEditOpen(false);
    setSelectedRoom(null);
  };

  const handleDeleteRoom = (room) => {
    setSelectedRoom(room);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedRoom) return;

    try {
      await deleteRoom(selectedRoom.id);
      setRooms((prevRooms) =>
        prevRooms.filter((room) => room.id !== selectedRoom.id)
      );
      setDeleteOpen(false);
      setSelectedRoom(null);
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  };

  // Helper functions
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("hr-HR", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "N/A";
    }
  };

  const getCapacityDisplay = (capacity) => {
    if (!capacity || capacity === 0) return "N/A";
    return `${capacity} osoba`;
  };

  const getLocationDisplay = (location) => {
    return location && String(location).trim() ? String(location) : "N/A";
  };

  // Loading and error states
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
          width: "100%",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          width: "100%",
          maxWidth: "95%",
          margin: "0 auto",
          mt: 4,
          px: 2,
        }}
      >
        <Typography color="error" variant="h6" sx={{ textAlign: "center" }}>
          {error}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Button variant="outlined" onClick={loadRooms}>
            Pokušaj ponovno
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "98%",
        margin: "0 auto",
        px: { xs: 1, sm: 2 },
        py: { xs: 2, sm: 3 },
      }}
    >
      {/* Header section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          mb: 3,
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 2, sm: 0 },
          px: 1,
        }}
      >
        <Button
          variant="contained"
          onClick={handleAddRoom}
          startIcon={<Add />}
          size="large"
          sx={{
            px: 3,
            py: 1.5,
            justifySelf: "flex-end",
            backgroundColor: "primary.dark",
            color: "white",
            borderRadius: 2,
            boxShadow: 2,
            "&:hover": {
              boxShadow: 4,
              transform: "translateY(-1px)",
            },
            transition: "all 0.2s ease-in-out",
          }}
        >
          Dodaj novu sobu
        </Button>
      </Box>

      {/* Statistics */}
      <Box sx={{ mb: 3, px: 1 }}>
        <Chip
          label={`Ukupno soba: ${rooms?.length || 0}`}
          color="primary"
          variant="outlined"
          sx={{ fontSize: "0.9rem" }}
        />
      </Box>

      {/* Table section - maksimalno široka */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          overflow: "auto",
          width: "100%",
        }}
      >
        <Table
          sx={{
            minWidth: 800,
            width: "100%",
            tableLayout: "auto",
          }}
        >
          <TableHead>
            <TableRow
              sx={{
                bgcolor: "primary.dark",
                "& .MuiTableCell-head": {
                  color: "white",
                  fontWeight: 600,
                  fontSize: "1rem",
                  py: 2,
                },
              }}
            >
              <TableCell sx={{ width: "8%", minWidth: 70 }}>ID</TableCell>
              <TableCell sx={{ width: "28%", minWidth: 250 }}>
                Naziv sobe
              </TableCell>
              <TableCell sx={{ width: "22%", minWidth: 200 }}>
                Lokacija
              </TableCell>
              <TableCell sx={{ width: "15%", minWidth: 140 }}>
                Kapacitet
              </TableCell>
              <TableCell sx={{ width: "20%", minWidth: 200 }}>
                Datum kreiranja
              </TableCell>
              <TableCell
                sx={{
                  width: "7%",
                  minWidth: 140,
                  textAlign: "center",
                }}
              >
                Akcije
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!rooms || rooms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: "center", py: 10 }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Nema soba za prikaz
                  </Typography>
                  <Typography variant="body2" color="text.disabled">
                    Dodajte prvu sobu klikom na gumb "Dodaj novu sobu"
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              rooms.map((room) => (
                <TableRow
                  key={room?.id || Math.random()}
                  hover
                  sx={{
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                    "& .MuiTableCell-root": {
                      py: 2,
                      fontSize: "0.95rem",
                    },
                  }}
                >
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: "primary.main",
                      fontSize: "1rem",
                    }}
                  >
                    {String(room?.id || "")}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: "text.primary",
                      fontSize: "1rem",
                    }}
                  >
                    {String(room?.name || "N/A")}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "text.secondary",
                      fontSize: "0.95rem",
                    }}
                  >
                    {getLocationDisplay(room?.location)}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getCapacityDisplay(room?.capacity)}
                      size="medium"
                      variant="outlined"
                      color={room?.capacity ? "success" : "default"}
                      sx={{
                        minWidth: 90,
                        fontSize: "0.85rem",
                      }}
                    />
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "text.secondary",
                      fontSize: "0.9rem",
                    }}
                  >
                    {formatDate(room?.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 1.5,
                      }}
                    >
                      <IconButton
                        onClick={() => handleEditRoom(room)}
                        color="primary"
                        size="medium"
                        sx={{
                          "&:hover": {
                            transform: "scale(1.1)",
                          },
                          transition: "all 0.2s ease-in-out",
                          p: 1,
                        }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteRoom(room)}
                        color="error"
                        size="medium"
                        sx={{
                          "&:hover": {
                            transform: "scale(1.1)",
                          },
                          transition: "all 0.2s ease-in-out",
                          p: 1,
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modals */}
      <AddRoomForm
        open={open}
        onClose={() => setOpen(false)}
        onRoomAdded={handleRoomAdded}
      />

      {selectedRoom && (
        <EditRoomForm
          open={editOpen}
          onClose={() => {
            setEditOpen(false);
            setSelectedRoom(null);
          }}
          room={selectedRoom}
          onRoomUpdated={handleRoomUpdated}
        />
      )}

      <DeleteConfirmationModal
        deleteOpen={deleteOpen}
        type="sobu"
        selectedData={selectedRoom}
        setDeleteOpen={setDeleteOpen}
        handleConfirm={handleConfirmDelete}
      />
    </Box>
  );
}
