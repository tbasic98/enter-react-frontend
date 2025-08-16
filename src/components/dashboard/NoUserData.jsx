import { Alert } from "@mui/material";
import { Container } from "postcss";

export const NoUserData = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Alert severity="warning">
        Nema podataka o korisniku. Molimo prijavite se ponovno.
      </Alert>
    </Container>
  );
};
