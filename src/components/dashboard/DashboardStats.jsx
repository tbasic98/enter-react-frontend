// components/dashboard/DashboardStats.jsx
import React from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import {
  Schedule,
  Today,
  CalendarMonth,
  Room as RoomIcon,
  Add,
} from "@mui/icons-material";

const DashboardStats = ({
  currentMeeting,
  todayMeetingsCount,
  totalMeetingsCount,
  availableRoomsCount,
  setOpen,
}) => {
  // Event handlers
  const handleAddEvent = () => {
    setOpen(true);
  };

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {/* Current Status */}
      <Grid item xs={12} sm={6} md={2.4}>
        <Card
          elevation={3}
          sx={{
            background: currentMeeting
              ? "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)"
              : "linear-gradient(135deg, #00b894 0%, #00cec9 100%)",
            color: "white",
            borderRadius: 3,
            height: "100%",
          }}
        >
          <CardContent sx={{ textAlign: "center" }}>
            <Schedule sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6" fontWeight="bold">
              {currentMeeting ? "U meetingu" : "Slobodan"}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {currentMeeting ? currentMeeting.title : "Nema aktivnih meetinga"}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Today's Count */}
      <Grid item xs={12} sm={6} md={2.4}>
        <Card elevation={3} sx={{ borderRadius: 3, height: "100%" }}>
          <CardContent sx={{ textAlign: "center" }}>
            <Today color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" fontWeight="bold" color="primary">
              {todayMeetingsCount}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Danas
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Total Count */}
      <Grid item xs={12} sm={6} md={2.4}>
        <Card elevation={3} sx={{ borderRadius: 3, height: "100%" }}>
          <CardContent sx={{ textAlign: "center" }}>
            <CalendarMonth color="info" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" fontWeight="bold" color="info.main">
              {totalMeetingsCount}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ukupno
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Available Rooms */}
      <Grid item xs={12} sm={6} md={2.4}>
        <Card elevation={3} sx={{ borderRadius: 3, height: "100%" }}>
          <CardContent sx={{ textAlign: "center" }}>
            <RoomIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" fontWeight="bold" color="success.main">
              {availableRoomsCount}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Dostupne sobe
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Add Meeting Card */}
      <Grid item xs={12} sm={6} md={2.4}>
        <Card
          elevation={3}
          sx={{
            borderRadius: 3,
            height: "100%",
            background: "linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)",
            cursor: "pointer",
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: 6,
            },
          }}
          onClick={handleAddEvent}
        >
          <CardContent sx={{ textAlign: "center", color: "white" }}>
            <Add sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6" fontWeight="bold">
              Novi meeting
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Kreiraj novi
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default DashboardStats;
