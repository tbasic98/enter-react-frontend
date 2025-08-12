import { AddUserForm } from "../form/AddUserForm";
import { EditUserForm } from "../form/EditUserForm"; // nova komponenta za edit
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { fetchUsers, deleteUser } from "../api"; // dodajte deleteUser import
import { DeleteConfirmationModal } from "../modal/DeleteConfirmationModal";

export default function UsersPage() {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dohvaćanje korisnika prilikom učitavanja komponente
  useEffect(() => {
    fetchUsers()
      .then((response) => {
        setUsers(response.data?.users);
        setLoading(false);
      })
      .catch((err) => {
        setError("Greška pri dohvaćanju korisnika");
        setLoading(false);
        console.error("Error fetching users:", err);
      });
  }, []);

  // Funkcija za dodavanje novog korisnika u listu
  const handleUserAdded = (newUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
    setOpen(false);
  };

  // Funkcija za uređivanje korisnika
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditOpen(true);
  };

  // Funkcija za ažuriranje korisnika u listi
  const handleUserUpdated = (updatedUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
    setEditOpen(false);
    setSelectedUser(null);
  };

  // Funkcija za otvaranje delete dialog-a
  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteUser(selectedUser.id);
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== selectedUser.id)
      );
      setDeleteOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      // Error toast će se prikazati automatski preko interceptora
    }
  };

  if (loading)
    return <CircularProgress sx={{ display: "block", margin: "50px auto" }} />;
  if (error)
    return (
      <Typography color="error" sx={{ textAlign: "center", mt: 4 }}>
        {error}
      </Typography>
    );

  return (
    <Box sx={{ maxWidth: 1200, margin: "auto", mt: 4, p: 2 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Upravljanje korisnicima
      </Typography>

      <Button variant="contained" onClick={() => setOpen(true)} sx={{ mb: 2 }}>
        Dodaj novog korisnika
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>ID</strong>
              </TableCell>
              <TableCell>
                <strong>Ime</strong>
              </TableCell>
              <TableCell>
                <strong>Prezime</strong>
              </TableCell>
              <TableCell>
                <strong>Korisničko ime</strong>
              </TableCell>
              <TableCell>
                <strong>Email</strong>
              </TableCell>
              <TableCell>
                <strong>Uloga</strong>
              </TableCell>
              <TableCell>
                <strong>Datum kreiranja</strong>
              </TableCell>
              <TableCell>
                <strong>Akcije</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users && users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} sx={{ textAlign: "center", py: 3 }}>
                  Nema korisnika za prikaz
                </TableCell>
              </TableRow>
            ) : (
              users?.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Typography
                      variant="caption"
                      sx={{
                        bgcolor:
                          user.role === "admin" ? "primary.main" : "grey.300",
                        color: user.role === "admin" ? "white" : "black",
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                      }}
                    >
                      {user.role}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleString("hr-HR")}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleEditUser(user)}
                      color="primary"
                      size="small"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteUser(user)}
                      color="error"
                      size="small"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add User Form */}
      <AddUserForm
        setUsers={setUsers}
        open={open}
        onClose={() => setOpen(false)}
        setOpen={setOpen}
        onUserAdded={handleUserAdded}
      />

      {/* Edit User Form */}
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

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationModal
        deleteOpen={deleteOpen}
        setDeleteOpen={setDeleteOpen}
        selectedData={selectedUser}
        handleConfirm={handleConfirmDelete}
      />
    </Box>
  );
}
