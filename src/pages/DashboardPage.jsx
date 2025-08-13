// pages/DashboardPage.jsx
import React, { useEffect, useState } from "react";
import { getUserMeetings, getAvailableRooms, deleteEvent } from "../api";
import { AddEventForm } from "../form/AddEventForm";
import { DeleteConfirmationModal } from "../modal/DeleteConfirmationModal";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  IconButton,
  Chip,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Divider,
  Alert,
  Stack,
  Container,
} from "@mui/material";
import {
  Add,
  Event as EventIcon,
  Schedule,
  Room as RoomIcon,
  Delete,
  Today,
  AccessTime,
  CalendarMonth,
  AccountCircle,
  LocationOn,
  TrendingUp,
} from "@mui/icons-material";

export const DashboardPage = () => {
  // State management
  const [userMeetings, setUserMeetings] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Dohvati korisnika iz localStorage
  const getUserFromStorage = () => {
    try {
      const userString = localStorage.getItem("user");
      return userString ? JSON.parse(userString) : null;
    } catch (error) {
      return null;
    }
  };

  const currentUser = getUserFromStorage();

  // Update trenutnog vremena svakih 30 sekundi
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000);

    return () => clearInterval(timer);
  }, []);

  // Dohvati korisničke podatke
  useEffect(() => {
    if (currentUser) {
      loadDashboardData();
      const refreshTimer = setInterval(loadDashboardData, 120000);

      return () => clearInterval(refreshTimer);
    }
  }, [currentUser?.id]);

  const loadDashboardData = async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      const [meetingsResponse, roomsResponse] = await Promise.all([
        getUserMeetings(currentUser.id),
        getAvailableRooms(),
      ]);

      setUserMeetings(
        meetingsResponse.data?.meetings || meetingsResponse.data || []
      );
      setAvailableRooms(roomsResponse.data?.rooms || roomsResponse.data || []);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setError("Greška pri dohvaćanju podataka");
    } finally {
      setLoading(false);
    }
  };

  // Event handlers
  const handleAddEvent = () => {
    setOpen(true);
  };

  const handleEventAdded = (newEvent) => {
    setUserMeetings((prevMeetings) => [...prevMeetings, newEvent]);
    setOpen(false);
  };

  const handleDeleteEvent = (event) => {
    setSelectedEvent(event);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedEvent) return;

    try {
      await deleteEvent(selectedEvent.id);
      setUserMeetings((prevMeetings) =>
        prevMeetings.filter((meeting) => meeting.id !== selectedEvent.id)
      );
      setDeleteOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error("Error deleting meeting:", error);
    }
  };

  // Helper functions
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

  // Kategorize meetings
  const getTodayMeetings = () => {
    const today = new Date().toDateString();
    return userMeetings
      .filter((meeting) => new Date(meeting.startTime).toDateString() === today)
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  };

  const getUpcomingMeetings = () => {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    return userMeetings
      .filter((meeting) => {
        const meetingDate = new Date(meeting.startTime);
        return meetingDate > tomorrow;
      })
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  };

  const getCurrentMeeting = () => {
    const now = currentTime;
    return userMeetings.find((meeting) => {
      const start = new Date(meeting.startTime);
      const end = new Date(meeting.endTime);
      return now >= start && now <= end;
    });
  };

  const canDeleteMeeting = (meeting) => {
    return meeting.userId === currentUser?.id;
  };

  // Loading state
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Učitavam dashboard...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={loadDashboardData}>
          Pokušaj ponovno
        </Button>
      </Container>
    );
  }

  if (!currentUser) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">
          Nema podataka o korisniku. Molimo prijavite se ponovno.
        </Alert>
      </Container>
    );
  }

  const todayMeetings = getTodayMeetings();
  const upcomingMeetings = getUpcomingMeetings();
  const currentMeeting = getCurrentMeeting();

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* HEADER SECTION */}
      <Box sx={{ mb: 4 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
        >
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Dobro jutro, {currentUser.firstName}! 👋
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {currentTime.toLocaleDateString("hr-HR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              •{" "}
              {currentTime.toLocaleTimeString("hr-HR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* STATS CARDS - Horizontal layout */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={3}
            sx={{
              background: currentMeeting
                ? "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)"
                : "linear-gradient(135deg, #00b894 0%, #00cec9 100%)",
              color: "white",
              height: "100%",
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <Schedule sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" fontWeight="bold">
                {currentMeeting ? "U meetingu" : "Slobodan"}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {currentMeeting
                  ? currentMeeting.title
                  : "Nema aktivnih meetinga"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ textAlign: "center" }}>
              <Today color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold" color="primary">
                {todayMeetings.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Danas
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ textAlign: "center" }}>
              <CalendarMonth color="info" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold" color="info.main">
                {userMeetings.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ukupno
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ textAlign: "center" }}>
              <RoomIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {availableRooms.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Dostupne sobe
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card
            elevation={3}
            sx={{
              borderRadius: 3,
              background: "linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)",
              cursor: "pointer",
              height: "100%",
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

      {/* MAIN CONTENT - Organized layout */}
      <Grid container spacing={4}>
        {/* LEFT COLUMN - Main meetings list */}
        <Grid item xs={12} md={8}>
          <Card elevation={4} sx={{ borderRadius: 3, height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Today color="primary" sx={{ mr: 2 }} />
                <Typography variant="h5" fontWeight="bold">
                  Današnji meetingi
                </Typography>
              </Box>

              {todayMeetings.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 6 }}>
                  <EventIcon
                    sx={{ fontSize: 80, color: "text.disabled", mb: 2 }}
                  />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Nema meetinga danas
                  </Typography>
                  <Typography variant="body2" color="text.disabled">
                    Savršen dan za fokusiran rad! 🎯
                  </Typography>
                </Box>
              ) : (
                <List sx={{ maxHeight: 400, overflow: "auto" }}>
                  {todayMeetings.map((meeting, index) => {
                    const isCurrent = currentMeeting?.id === meeting.id;
                    const isPast = new Date(meeting.endTime) < currentTime;

                    return (
                      <React.Fragment key={meeting.id}>
                        <ListItem
                          sx={{
                            borderRadius: 2,
                            mb: 1,
                            bgcolor: isCurrent
                              ? "error.light"
                              : isPast
                                ? "grey.100"
                                : "primary.light",
                            "&:hover": {
                              bgcolor: isCurrent
                                ? "error.main"
                                : isPast
                                  ? "grey.200"
                                  : "primary.main",
                            },
                          }}
                        >
                          <ListItemIcon>
                            <Avatar
                              sx={{
                                bgcolor: isCurrent
                                  ? "error.main"
                                  : isPast
                                    ? "grey.400"
                                    : "primary.main",
                              }}
                            >
                              <AccessTime />
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Typography variant="h6" fontWeight="bold">
                                  {meeting.title}
                                </Typography>
                                {isCurrent && (
                                  <Chip
                                    label="AKTIVNO"
                                    size="small"
                                    color="error"
                                  />
                                )}
                                {isPast && (
                                  <Chip
                                    label="ZAVRŠENO"
                                    size="small"
                                    variant="outlined"
                                  />
                                )}
                              </Box>
                            }
                            secondary={
                              <Stack spacing={0.5}>
                                <Typography variant="body2">
                                  {formatTime(meeting.startTime)} -{" "}
                                  {formatTime(meeting.endTime)}
                                </Typography>
                                {meeting.description && (
                                  <Typography variant="body2">
                                    {meeting.description}
                                  </Typography>
                                )}
                              </Stack>
                            }
                          />
                          {canDeleteMeeting(meeting) && (
                            <IconButton
                              onClick={() => handleDeleteEvent(meeting)}
                              color="error"
                              size="small"
                            >
                              <Delete />
                            </IconButton>
                          )}
                        </ListItem>
                        {index < todayMeetings.length - 1 && <Divider />}
                      </React.Fragment>
                    );
                  })}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* RIGHT COLUMN - Sidebar with organized sections */}
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            {/* Upcoming Meetings */}
            <Card elevation={4} sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Nadolazeći meetingi
                </Typography>
                <Divider sx={{ mb: 2 }} />

                {upcomingMeetings.length === 0 ? (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="center"
                    sx={{ py: 2 }}
                  >
                    Nema nadolazećih meetinga
                  </Typography>
                ) : (
                  <List dense>
                    {upcomingMeetings.slice(0, 3).map((meeting) => (
                      <ListItem key={meeting.id} sx={{ px: 0 }}>
                        <ListItemText
                          primary={meeting.title}
                          secondary={`${formatDate(meeting.startTime)} • ${formatTime(meeting.startTime)}`}
                        />
                      </ListItem>
                    ))}
                    {upcomingMeetings.length > 3 && (
                      <ListItem sx={{ px: 0 }}>
                        <ListItemText
                          primary={
                            <Typography variant="body2" color="primary">
                              + još {upcomingMeetings.length - 3} meetinga
                            </Typography>
                          }
                        />
                      </ListItem>
                    )}
                  </List>
                )}
              </CardContent>
            </Card>

            {/* Available Rooms */}
            <Card elevation={4} sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Dostupne sobe
                </Typography>
                <Divider sx={{ mb: 2 }} />

                {availableRooms.length === 0 ? (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="center"
                    sx={{ py: 2 }}
                  >
                    Nema dostupnih soba
                  </Typography>
                ) : (
                  <List dense>
                    {availableRooms.slice(0, 4).map((room) => (
                      <ListItem key={room.id} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <RoomIcon fontSize="small" color="success" />
                        </ListItemIcon>
                        <ListItemText
                          primary={room.name}
                          secondary={room.location}
                        />
                      </ListItem>
                    ))}
                    {availableRooms.length > 4 && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        textAlign="center"
                      >
                        + još {availableRooms.length - 4} soba
                      </Typography>
                    )}
                  </List>
                )}
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      {/* Modals */}
      <AddEventForm
        open={open}
        onClose={() => setOpen(false)}
        onEventAdded={handleEventAdded}
      />

      <DeleteConfirmationModal
        deleteOpen={deleteOpen}
        type="meeting"
        selectedData={selectedEvent}
        setDeleteOpen={setDeleteOpen}
        handleConfirm={handleConfirmDelete}
      />
    </Container>
  );
};
