// pages/RoomView.jsx
import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { fetchEvents, fetchRooms } from "../api";
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  Avatar,
} from "@mui/material";
import {
  Schedule,
  Room as RoomIcon,
  Event as EventIcon,
  Person,
  AccessTime,
  Today,
  Warning,
} from "@mui/icons-material";

export default function RoomView() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update trenutnog vremena svakih 30 sekundi
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000);

    return () => clearInterval(timer);
  }, []);

  // Dohvati podatke o sobi i eventovima
  useEffect(() => {
    loadRoomData();
    // Refresh podatke svakih 2 minute
    const refreshTimer = setInterval(loadRoomData, 120000);

    return () => clearInterval(refreshTimer);
  }, [id]);

  const loadRoomData = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const [roomsResponse, eventsResponse] = await Promise.all([
        fetchRooms(),
        fetchEvents(),
      ]);

      // Pronađi specifičnu sobu
      const rooms = roomsResponse.data?.rooms || roomsResponse.data || [];
      console.log(id, rooms);
      const foundRoom = rooms.find((r) => r.id === parseInt(id));

      if (!foundRoom) {
        throw new Error("Soba nije pronađena");
      }

      // Filtriraj eventi samo za ovu sobu
      const allEvents =
        eventsResponse.data?.meetings || eventsResponse.data || [];
      const roomEvents = allEvents.filter(
        (event) => event.roomId === parseInt(id)
      );

      setRoom(foundRoom);
      setEvents(roomEvents);
    } catch (err) {
      console.error("Error loading room data:", err);
      setError("Greška pri dohvaćanju podataka o sobi");
    } finally {
      setLoading(false);
    }
  };

  // Helper funkcije
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
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  const getCurrentMeeting = () => {
    const now = currentTime;
    return events.find((event) => {
      const start = new Date(event.startTime);
      const end = new Date(event.endTime);
      return now >= start && now <= end;
    });
  };

  const getNextMeeting = () => {
    const now = currentTime;
    const futureEvents = events
      .filter((event) => new Date(event.startTime) > now)
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

    return futureEvents[0] || null;
  };

  const getTodayEvents = () => {
    const today = new Date().toDateString();
    return events
      .filter((event) => new Date(event.startTime).toDateString() === today)
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  };

  const getRoomStatus = () => {
    const currentMeeting = getCurrentMeeting();
    if (currentMeeting) {
      return { status: "occupied", meeting: currentMeeting };
    }

    const nextMeeting = getNextMeeting();
    if (nextMeeting) {
      const timeUntil = new Date(nextMeeting.startTime) - currentTime;
      const minutesUntil = Math.floor(timeUntil / (1000 * 60));

      if (minutesUntil <= 15) {
        return { status: "soon", meeting: nextMeeting, minutesUntil };
      }
    }

    return { status: "available" };
  };

  // Loading state
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <Box sx={{ textAlign: "center", color: "white" }}>
          <CircularProgress size={80} sx={{ color: "white", mb: 3 }} />
          <Typography variant="h5">Učitavam podatke o sobi...</Typography>
        </Box>
      </Box>
    );
  }
  console.log(room);
  // Error state
  if (error || !room) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
          p: 4,
        }}
      >
        <Paper
          elevation={12}
          sx={{
            p: 6,
            textAlign: "center",
            maxWidth: 500,
            borderRadius: 4,
          }}
        >
          <Warning sx={{ fontSize: 80, color: "error.main", mb: 2 }} />
          <Typography variant="h4" gutterBottom color="error">
            Greška
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {error || "Soba nije pronađena"}
          </Typography>
        </Paper>
      </Box>
    );
  }

  const roomStatus = getRoomStatus();
  const todayEvents = getTodayEvents();
  const currentMeeting = getCurrentMeeting();
  const nextMeeting = getNextMeeting();

  // Dinamičke boje ovisno o statusu
  const getStatusColor = () => {
    switch (roomStatus.status) {
      case "occupied":
        return {
          primary: "#e74c3c",
          secondary: "#c0392b",
          gradient: "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)",
        };
      case "soon":
        return {
          primary: "#f39c12",
          secondary: "#e67e22",
          gradient: "linear-gradient(135deg, #f39c12 0%, #e67e22 100%)",
        };
      default:
        return {
          primary: "#27ae60",
          secondary: "#229954",
          gradient: "linear-gradient(135deg, #27ae60 0%, #229954 100%)",
        };
    }
  };

  const statusColors = getStatusColor();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: statusColors.gradient,
        p: 3,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Paper
        elevation={8}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 4,
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <Avatar
              sx={{
                width: 60,
                height: 60,
                bgcolor: statusColors.primary,
              }}
            >
              <RoomIcon sx={{ fontSize: 30 }} />
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h3" fontWeight="bold" color="text.primary">
              {room.name}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {room.location || "Lokacija nije specificirana"}
            </Typography>
            {room.capacity && (
              <Typography variant="body1" color="text.secondary">
                Kapacitet: {room.capacity} osoba
              </Typography>
            )}
          </Grid>
          <Grid item>
            <Box sx={{ textAlign: "right" }}>
              <Typography variant="h4" fontWeight="bold">
                {currentTime.toLocaleTimeString("hr-HR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {formatDate(currentTime)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3} sx={{ flexGrow: 1 }}>
        {/* Status Card */}
        <Grid item xs={12} md={6}>
          <Card
            elevation={8}
            sx={{
              height: "100%",
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(10px)",
              borderRadius: 4,
            }}
          >
            <CardContent sx={{ p: 4, textAlign: "center", height: "100%" }}>
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  bgcolor: statusColors.primary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 3,
                  boxShadow: `0 8px 32px ${statusColors.primary}40`,
                }}
              >
                {roomStatus.status === "occupied" && (
                  <Person sx={{ fontSize: 50, color: "white" }} />
                )}
                {roomStatus.status === "soon" && (
                  <Schedule sx={{ fontSize: 50, color: "white" }} />
                )}
                {roomStatus.status === "available" && (
                  <EventIcon sx={{ fontSize: 50, color: "white" }} />
                )}
              </Box>

              <Typography variant="h3" fontWeight="bold" sx={{ mb: 2 }}>
                {roomStatus.status === "occupied" && "ZAUZETO"}
                {roomStatus.status === "soon" && "USKORO ZAUZETO"}
                {roomStatus.status === "available" && "DOSTUPNO"}
              </Typography>

              {currentMeeting && (
                <Box>
                  <Typography variant="h5" sx={{ mb: 1 }}>
                    {currentMeeting.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {currentMeeting.description}
                  </Typography>
                  <Chip
                    icon={<AccessTime />}
                    label={`${formatTime(currentMeeting.startTime)} - ${formatTime(currentMeeting.endTime)}`}
                    color="error"
                    size="large"
                    sx={{ fontSize: "1rem" }}
                  />
                </Box>
              )}

              {roomStatus.status === "soon" && nextMeeting && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Sljedeći meeting: {nextMeeting.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    Počinje za {roomStatus.minutesUntil} minuta
                  </Typography>
                  <Chip
                    icon={<Schedule />}
                    label={`${formatTime(nextMeeting.startTime)} - ${formatTime(nextMeeting.endTime)}`}
                    color="warning"
                    size="large"
                    sx={{ fontSize: "1rem" }}
                  />
                </Box>
              )}

              {roomStatus.status === "available" && nextMeeting && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Sljedeći meeting: {nextMeeting.title}
                  </Typography>
                  <Chip
                    icon={<Schedule />}
                    label={`${formatTime(nextMeeting.startTime)} - ${formatTime(nextMeeting.endTime)}`}
                    color="info"
                    size="large"
                    sx={{ fontSize: "1rem" }}
                  />
                </Box>
              )}

              {roomStatus.status === "available" && !nextMeeting && (
                <Typography variant="h6" color="text.secondary">
                  Nema planiranih meetinga danas
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Today's Schedule */}
        <Grid item xs={12} md={6}>
          <Card
            elevation={8}
            sx={{
              height: "100%",
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(10px)",
              borderRadius: 4,
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Today
                  sx={{ mr: 2, fontSize: 30, color: statusColors.primary }}
                />
                <Typography variant="h5" fontWeight="bold">
                  Današnji raspored
                </Typography>
              </Box>

              <Divider sx={{ mb: 3 }} />

              {todayEvents.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="h6" color="text.secondary">
                    Nema planiranih meetinga danas
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ maxHeight: 400, overflowY: "auto" }}>
                  {todayEvents.map((event, index) => {
                    const isCurrentMeeting = currentMeeting?.id === event.id;
                    const isPastMeeting = new Date(event.endTime) < currentTime;

                    return (
                      <Paper
                        key={event.id}
                        elevation={isCurrentMeeting ? 6 : 2}
                        sx={{
                          p: 2,
                          mb: 2,
                          borderLeft: `4px solid ${
                            isCurrentMeeting
                              ? statusColors.primary
                              : isPastMeeting
                                ? "#bdc3c7"
                                : "#3498db"
                          }`,
                          bgcolor: isCurrentMeeting
                            ? `${statusColors.primary}10`
                            : "white",
                          opacity: isPastMeeting ? 0.6 : 1,
                        }}
                      >
                        <Typography variant="h6" fontWeight="bold">
                          {event.title}
                        </Typography>
                        {event.description && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 1 }}
                          >
                            {event.description}
                          </Typography>
                        )}
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Chip
                            icon={<AccessTime />}
                            label={`${formatTime(event.startTime)} - ${formatTime(event.endTime)}`}
                            size="small"
                            color={
                              isCurrentMeeting
                                ? "error"
                                : isPastMeeting
                                  ? "default"
                                  : "primary"
                            }
                            variant={isCurrentMeeting ? "filled" : "outlined"}
                          />
                          {isCurrentMeeting && (
                            <Chip
                              label="AKTIVNO"
                              size="small"
                              color="error"
                              sx={{ fontWeight: "bold" }}
                            />
                          )}
                        </Box>
                      </Paper>
                    );
                  })}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Footer */}
      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
          Podaci se automatski osvježavaju svakih 2 minute • ID sobe: {id}
        </Typography>
      </Box>
    </Box>
  );
}
