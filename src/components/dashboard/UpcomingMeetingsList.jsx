// components/dashboard/UpcomingMeetingsList.jsx
import { Card, CardContent, Typography, Box, Divider } from "@mui/material";
import { Upcoming } from "@mui/icons-material";

const UpcomingMeetingsList = ({ meetings }) => {
  const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleTimeString("hr-HR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "N/A";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("hr-HR", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  return (
    <Card elevation={4} sx={{ borderRadius: 3, height: "50%" }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Upcoming color="info" sx={{ mr: 1 }} />
          <Typography variant="h6" fontWeight="bold">
            Nadolazeći meetingi
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />

        {meetings.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            sx={{ py: 2 }}
          >
            Nema nadolazećih meetinga
          </Typography>
        ) : (
          <Box sx={{ width: "100%" }}>
            {meetings.slice(0, 3).map((meeting, index) => (
              <Box
                key={meeting.id}
                sx={{
                  py: 1.5,
                  borderBottom:
                    index < Math.min(meetings.length, 3) - 1
                      ? "1px solid #f0f0f0"
                      : "none",
                }}
              >
                <Typography variant="body1" fontWeight="500" sx={{ mb: 0.5 }}>
                  {meeting.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatDate(meeting.startTime)} •{" "}
                  {formatTime(meeting.startTime)}
                </Typography>
              </Box>
            ))}
            {meetings.length > 3 && (
              <Box sx={{ py: 1, textAlign: "center", mt: 1 }}>
                <Typography variant="body2" color="primary">
                  + još {meetings.length - 3} meetinga
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingMeetingsList;
