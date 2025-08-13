// pages/UnauthorizedPage.jsx
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Typography, Button, Paper, Alert, Stack } from "@mui/material";
import { Lock, Home, ArrowBack, Warning } from "@mui/icons-material";

export default function UnauthorizedPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const getAttemptedPage = () => {
    const pathname = location.state?.from?.pathname;
    if (pathname === "/users") return "Upravljanje korisnicima";
    if (pathname === "/rooms") return "Upravljanje sobama";
    return "ovu stranicu";
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: "0 auto",
        mt: 4,
        px: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 6,
          display: "flex",
          flexDirection: "column",
          gap: "5px",
          textAlign: "center",
          borderRadius: 3,
        }}
      >
        {/* Icon */}
        <Box
          sx={{
            width: 80,
            height: 80,
            bgcolor: "error.light",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 3,
          }}
        >
          <Lock sx={{ fontSize: 40, color: "white" }} />
        </Box>

        {/* Title */}
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: "text.primary",
            mb: 2,
          }}
        >
          Neovlašteni pristup
        </Typography>

        {/* Description */}
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            mb: 2,
            fontSize: "1.1rem",
            lineHeight: 1.6,
          }}
        >
          Nemate dozvolu za pristup stranici{" "}
          <strong>"{getAttemptedPage()}"</strong>.
        </Typography>

        {/* Alert Box */}
        <Alert
          severity="warning"
          icon={<Warning />}
          sx={{
            mb: 4,
            textAlign: "left",
            fontSize: "0.95rem",
          }}
        >
          Ova stranica je dostupna samo korisnicima s administratorskim
          privilegijama
        </Alert>

        {/* Action Buttons */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ mt: 4, justifyContent: "center" }}
        >
          <Button
            variant="contained"
            size="large"
            onClick={handleGoToDashboard}
            startIcon={<Home />}
            sx={{
              px: 3,
              py: 1.5,
              fontSize: "1rem",
              fontWeight: 600,
              borderRadius: 2,
              background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
              boxShadow: "0 3px 10px 2px rgba(33, 203, 243, .3)",
              "&:hover": {
                boxShadow: "0 6px 20px 2px rgba(33, 203, 243, .4)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease-in-out",
            }}
          >
            Idi na Dashboard
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
