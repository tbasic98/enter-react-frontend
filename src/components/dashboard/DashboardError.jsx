import { Alert } from "@mui/material";
import { Container } from "postcss";

export const DashboardError = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    </Container>
  );
};
