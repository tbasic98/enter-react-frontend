import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

export const DeleteConfirmationModal = ({
  deleteOpen,
  setDeleteOpen,
  selectedData,
  handleConfirm,
  type = "korisnika",
}) => {
  // Funkcija za potvrdu brisanja korisnika

  return (
    <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
      <DialogTitle>Potvrda brisanja</DialogTitle>
      <DialogContent>
        <Typography>
          Jeste li sigurni da želite obrisati {type}{" "}
          <strong>
            {selectedData?.name} {selectedData?.firstName}{" "}
            {selectedData?.lastName}
          </strong>
          ?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDeleteOpen(false)}>Odustani</Button>
        <Button onClick={handleConfirm} color="error" variant="contained">
          Obriši
        </Button>
      </DialogActions>
    </Dialog>
  );
};
