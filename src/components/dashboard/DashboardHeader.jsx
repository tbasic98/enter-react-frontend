// components/dashboard/DashboardHeader.jsx
import { Box, Typography, Stack, Avatar } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import { useTimer } from "../../hooks/useTimer";
import { useAuth } from "../../AuthContext";

const DashboardHeader = () => {
  const { user } = useAuth();

  const { currentTime } = useTimer();

  const formatFullDate = (date) => {
    return date.toLocaleDateString("hr-HR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!user) {
    <NoUserData />;
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            sx={{
              width: 50,
              height: 50,
              bgcolor: "primary.main",
            }}
          >
            <AccountCircle sx={{ fontSize: 30 }} />
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Dobro jutro, {user?.firstName}! 👋
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {formatFullDate(currentTime)} •{" "}
              {currentTime.toLocaleTimeString("hr-HR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Typography>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};

export default DashboardHeader;
