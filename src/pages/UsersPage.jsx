import React, { useEffect, useState } from "react";
import { fetchUsers, deleteUser } from "../api";
import { AddUserForm } from "../form/AddUserForm";
import { EditUserForm } from "../form/EditUserForm";
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
  Chip,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";

export default function UsersPage() {
  // State management
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await fetchUsers();
      setUsers(response.data?.users || response.data || []);
    } catch (err) {
      setError("Greška pri dohvaćanju korisnika");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  // Event handlers
  const handleAddUser = () => {
    setOpen(true);
  };

  const handleUserAdded = (newUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
    setOpen(false);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditOpen(true);
  };

  const handleUserUpdated = (updatedUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
    setEditOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;

    try {
      await deleteUser(selectedUser.id);
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== selectedUser.id)
      );
      setDeleteOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error deleting user:", error);
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

  const getRoleDisplay = (role) => {
    return role && String(role).trim() ? String(role) : "N/A";
  };

  const getFullName = (firstName, lastName) => {
    const first =
      firstName && String(firstName).trim() ? String(firstName) : "";
    const last = lastName && String(lastName).trim() ? String(lastName) : "";
    return `${first} ${last}`.trim() || "N/A";
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
          <Button variant="outlined" onClick={loadUsers}>
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
          onClick={handleAddUser}
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
          Dodaj novog korisnika
        </Button>
      </Box>

      {/* Statistics */}
      <Box sx={{ mb: 3, px: 1 }}>
        <Chip
          label={`Ukupno korisnika: ${users?.length || 0}`}
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
              <TableCell sx={{ width: "6%", minWidth: 60 }}>ID</TableCell>
              <TableCell sx={{ width: "15%", minWidth: 120 }}>Ime</TableCell>
              <TableCell sx={{ width: "15%", minWidth: 120 }}>
                Prezime
              </TableCell>
              <TableCell sx={{ width: "18%", minWidth: 150 }}>
                Korisničko ime
              </TableCell>
              <TableCell sx={{ width: "20%", minWidth: 200 }}>Email</TableCell>
              <TableCell sx={{ width: "10%", minWidth: 100 }}>Uloga</TableCell>
              <TableCell sx={{ width: "16%", minWidth: 180 }}>
                Datum kreiranja
              </TableCell>
              <TableCell
                sx={{
                  width: "10%",
                  minWidth: 140,
                  textAlign: "center",
                }}
              >
                Akcije
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!users || users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} sx={{ textAlign: "center", py: 10 }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Nema korisnika za prikaz
                  </Typography>
                  <Typography variant="body2" color="text.disabled">
                    Dodajte prvog korisnika klikom na gumb "Dodaj novog
                    korisnika"
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow
                  key={user?.id || Math.random()}
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
                    {String(user?.id || "")}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: "text.primary",
                      fontSize: "1rem",
                    }}
                  >
                    {String(user?.firstName || "N/A")}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: "text.primary",
                      fontSize: "1rem",
                    }}
                  >
                    {String(user?.lastName || "N/A")}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "text.secondary",
                      fontSize: "0.95rem",
                    }}
                  >
                    {String(user?.username || "N/A")}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "text.secondary",
                      fontSize: "0.95rem",
                    }}
                  >
                    {String(user?.email || "N/A")}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getRoleDisplay(user?.role)}
                      size="medium"
                      variant="outlined"
                      color={user?.role === "admin" ? "error" : "default"}
                      sx={{
                        minWidth: 70,
                        fontSize: "0.85rem",
                        bgcolor:
                          user?.role === "admin" ? "error.light" : "grey",
                        color: "white",
                      }}
                    />
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "text.secondary",
                      fontSize: "0.9rem",
                    }}
                  >
                    {formatDate(user?.createdAt)}
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
                        onClick={() => handleEditUser(user)}
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
                        onClick={() => handleDeleteUser(user)}
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
      <AddUserForm
        open={open}
        onClose={() => setOpen(false)}
        onUserAdded={handleUserAdded}
      />

      {selectedUser && (
        <EditUserForm
          open={editOpen}
          onClose={() => {
            setEditOpen(false);
            setSelectedUser(null);
          }}
          user={selectedUser}
          onUserUpdated={handleUserUpdated}
        />
      )}

      <DeleteConfirmationModal
        deleteOpen={deleteOpen}
        type="korisnika"
        selectedData={selectedUser}
        setDeleteOpen={setDeleteOpen}
        handleConfirm={handleConfirmDelete}
      />
    </Box>
  );
}
