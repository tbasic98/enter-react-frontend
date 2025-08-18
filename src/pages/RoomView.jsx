// pages/RoomView.jsx
import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { fetchEvents, fetchRooms, createEvent } from "../api";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  CircularProgress,
  Alert,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Fab,
  Slider,
  Stack,
} from "@mui/material";
import {
  Schedule,
  Room as RoomIcon,
  Person,
  AccessTime,
  Warning,
  Add,
  Remove,
  Check,
  Close,
} from "@mui/icons-material";

// Calendar constants
const VISIBLE_SLOTS = 6;
const SLOTS_BEFORE = 2;

export default function RoomView() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [quickBookOpen, setQuickBookOpen] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(30);

  // Admin provjera
  const getUserFromStorage = () => {
    try {
      const userString = localStorage.getItem("user");
      return userString ? JSON.parse(userString) : null;
    } catch (error) {
      return null;
    }
  };

  const user = getUserFromStorage();

  if (!user || user.role !== "admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  // Update trenutnog vremena svakih 10 sekundi
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  // Dohvati podatke o sobi i eventovima
  useEffect(() => {
    loadRoomData();
    const refreshTimer = setInterval(loadRoomData, 60000);

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

      const rooms = roomsResponse.data?.rooms || roomsResponse.data || [];
      const foundRoom = rooms.find((r) => r.id === parseInt(id));

      if (!foundRoom) {
        throw new Error("Soba nije pronađena");
      }

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
      const date = new Date(dateString);
      return date.toLocaleTimeString("hr-HR", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Europe/Zagreb",
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

  // Kalkulacija progresa animacije
  const getAnimationProgress = () => {
    const roomStatus = getRoomStatus();

    if (roomStatus.status === "occupied" && roomStatus.meeting) {
      const meeting = roomStatus.meeting;
      const startTime = new Date(meeting.startTime);
      const endTime = new Date(meeting.endTime);
      const now = currentTime;

      // Kalkuliraj progress (0-1, gdje je 1 = meeting završen)
      const totalDuration = endTime - startTime;
      const elapsed = now - startTime;
      const progress = Math.min(Math.max(elapsed / totalDuration, 0), 1);

      return {
        progress,
        timeRemaining: Math.max(0, Math.floor((endTime - now) / (1000 * 60))),
        totalMinutes: Math.floor(totalDuration / (1000 * 60)),
      };
    }

    if (roomStatus.status === "soon" && roomStatus.meeting) {
      const meeting = roomStatus.meeting;
      const startTime = new Date(meeting.startTime);
      const now = currentTime;

      // Kalkuliraj koliko je blizu početak (15 min = 0, 0 min = 1)
      const timeUntil = Math.max(0, startTime - now);
      const minutesUntil = Math.floor(timeUntil / (1000 * 60));
      const progress = Math.min(Math.max(1 - minutesUntil / 15, 0), 1);

      return {
        progress,
        minutesUntil,
        isStartingSoon: true,
      };
    }

    return { progress: 0 };
  };

  const canQuickBook = () => {
    const roomStatus = getRoomStatus();
    if (roomStatus.status === "occupied") return false;

    if (roomStatus.status === "soon" && roomStatus.minutesUntil < 15) {
      return false;
    }

    return true;
  };

  const handleQuickBook = async () => {
    try {
      const now = new Date();
      const startTime = new Date(now);
      const endTime = new Date(now.getTime() + selectedDuration * 60 * 1000);

      const randomTitles = [
        "Improvizovani Meeting",
        "Kratka Diskusija",
        "Brzi Sync",
        "Ad-hoc Sastanak",
        "Spontani Meeting",
        "Quick Discussion",
      ];
      const randomTitle =
        randomTitles[Math.floor(Math.random() * randomTitles.length)];

      const eventData = {
        userId: user.id,
        roomId: parseInt(id),
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        title: randomTitle,
        description: `Brzo kreiran event (${selectedDuration} min)`,
      };

      console.log("🎯 Creating quick event:", eventData);

      await createEvent(eventData);
      setQuickBookOpen(false);
      loadRoomData();
    } catch (error) {
      console.error("Error creating quick event:", error);
    }
  };

  // ✅ ISPRAVLJENA funkcija za dobijanje tema s animacijom (desna na levu)
  const getStatusTheme = () => {
    const roomStatus = getRoomStatus();
    const animationData = getAnimationProgress();

    switch (roomStatus.status) {
      case "occupied":
        return {
          primary: "#f44336",
          bg: "linear-gradient(135deg, #f44336 0%, #d32f2f 100%)",
          ledColor: "#f44336",
          overlayWidth: `${(1 - animationData.progress) * 100}%`, // ✅ 100% na početku, 0% na kraju
          animationData,
        };
      case "soon":
        return {
          primary: "#ff9800",
          bg: "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)",
          ledColor: "#ff9800",
          overlayWidth: `${(1 - animationData.progress) * 100}%`, // ✅ 100% na početku, 0% na kraju
          animationData,
        };
      default:
        return {
          primary: "#4caf50",
          bg: "linear-gradient(135deg, #4caf50 0%, #388e3c 100%)",
          ledColor: "#4caf50",
          overlayWidth: "0%",
          animationData,
        };
    }
  };

  // Loading state
  if (loading) {
    return (
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
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

  // Error state
  if (error || !room) {
    return (
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f44336 0%, #d32f2f 100%)",
          p: 4,
        }}
      >
        <Card
          sx={{ p: 6, textAlign: "center", maxWidth: 500, borderRadius: 4 }}
        >
          <Warning sx={{ fontSize: 80, color: "error.main", mb: 2 }} />
          <Typography variant="h4" gutterBottom color="error">
            Greška
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {error || "Soba nije pronađena"}
          </Typography>
        </Card>
      </Box>
    );
  }

  const roomStatus = getRoomStatus();
  const todayEvents = getTodayEvents();
  const currentMeeting = getCurrentMeeting();
  const nextMeeting = getNextMeeting();
  const statusTheme = getStatusTheme();

  // Timeline kalkulacija
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();

  const slotHours = Array.from({ length: VISIBLE_SLOTS }, (_, i) =>
    Math.max(0, Math.min(23, currentHour - SLOTS_BEFORE + i))
  );

  const rangeStart = new Date(currentTime);
  rangeStart.setHours(slotHours[0], 0, 0, 0);

  const rangeEnd = new Date(currentTime);
  rangeEnd.setHours(slotHours + VISIBLE_SLOTS, 0, 0, 0);

  const rangeTotalMinutes = (rangeEnd - rangeStart) / (1000 * 60);
  const rangeHours = VISIBLE_SLOTS;

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        background: "#fafafa",
        position: "relative",
        overflow: "hidden",
        // LED frame effect
        boxShadow: `0 0 20px ${statusTheme.ledColor}60`,
      }}
    >
      {/* ✅ Left Side - Main Room Info with Background Image + Animated Overlay */}
      <Box
        sx={{
          flex: 1,
          position: "relative",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          p: { xs: 4, md: 6 },
          // Background image
          backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.3)", // Tamni overlay za bolju čitljivost teksta
            zIndex: 1,
          },
        }}
      >
        {/* ✅ Animated Color Overlay - pomera se sa DESNA NA LEVO kako vreme ističe */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0, // ✅ Desna strana
            bottom: 0,
            width: statusTheme.overlayWidth, // 100% → 0% kako vreme prolazi
            background: statusTheme.bg,
            opacity: 0.85, // Transparentni overlay
            zIndex: 2,
            transition: "width 10s ease-out", // Smooth animacija
            borderLeft: `4px solid ${statusTheme.primary}`, // ✅ Levi border
            boxShadow: `inset 10px 0 20px -10px ${statusTheme.primary}40`, // ✅ Shadow sa leve strane
          }}
        />

        {/* Content - above overlay */}
        <Box sx={{ position: "relative", zIndex: 3 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 300,
              letterSpacing: "2px",
              mb: 4,
              opacity: 0.9,
            }}
          >
            🏢 DASH
          </Typography>

          <Typography
            variant="h1"
            sx={{
              fontWeight: "bold",
              mb: 2,
              fontSize: { xs: "2.5rem", md: "4rem" },
              lineHeight: 1.2,
              textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
            }}
          >
            {room.name}
          </Typography>

          {roomStatus.status === "occupied" && currentMeeting && (
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 500,
                  mb: 2,
                  opacity: 0.95,
                  textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                }}
              >
                {currentMeeting.title}
              </Typography>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 3, mb: 2 }}
              >
                <Typography variant="h4" sx={{ fontWeight: 400 }}>
                  {formatTime(currentMeeting.startTime)} -{" "}
                  {formatTime(currentMeeting.endTime)}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Person sx={{ fontSize: 40, mr: 1 }} />
                  <Typography variant="h4">
                    {currentMeeting.attendees || "?"}
                  </Typography>
                </Box>
              </Box>
              {/* Progress indicator */}
              <Typography variant="h5" sx={{ fontWeight: 300, opacity: 0.9 }}>
                Preostalo: {statusTheme.animationData?.timeRemaining || 0} min
              </Typography>
            </Box>
          )}

          {roomStatus.status === "available" && (
            <Typography
              variant="h3"
              sx={{
                fontWeight: 400,
                mb: 4,
                opacity: 0.95,
                textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
              }}
            >
              {nextMeeting
                ? `Slobodno do ${formatTime(nextMeeting.startTime)}`
                : "Slobodno cijeli dan"}
            </Typography>
          )}

          {roomStatus.status === "soon" && nextMeeting && (
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 500,
                  mb: 2,
                  opacity: 0.95,
                  textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                }}
              >
                {nextMeeting.title}
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 400,
                  opacity: 0.9,
                }}
              >
                Počinje za {statusTheme.animationData?.minutesUntil || 0} minuta
              </Typography>
            </Box>
          )}
        </Box>

        {/* Clock - above overlay */}
        <Box sx={{ position: "relative", zIndex: 3 }}>
          <Typography
            variant="h1"
            sx={{
              fontWeight: 300,
              fontSize: { xs: "4rem", md: "7rem" },
              letterSpacing: "4px",
              mb: 2,
              textShadow: "3px 3px 6px rgba(0,0,0,0.5)",
            }}
          >
            {currentTime.toLocaleTimeString("hr-HR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 400,
              opacity: 0.8,
              letterSpacing: "1px",
              textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
            }}
          >
            {currentTime.toLocaleDateString("hr-HR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </Typography>
        </Box>
      </Box>

      {/* Right Side - Timeline Calendar */}
      <Box
        sx={{
          width: { xs: "420px", md: "480px" },
          background: "white",
          borderLeft: "1px solid #e0e0e0",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Calendar Header */}
        <Box
          sx={{
            p: { xs: 3, md: 4 },
            borderBottom: "1px solid #e0e0e0",
            background: "linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)",
            flexShrink: 0,
          }}
        >
          <Typography variant="h4" fontWeight="bold" color="text.primary">
            Danas •{" "}
            {currentTime.toLocaleDateString("hr-HR", {
              day: "numeric",
              month: "long",
            })}
          </Typography>
        </Box>

        {/* Timeline Container */}
        <Box
          sx={{
            flex: 1,
            position: "relative",
            overflow: "hidden",
            background: "white",
          }}
        >
          {/* Hour Grid Lines and Labels */}
          {slotHours.map((hour, i) => {
            const isCurrentHour = hour === currentTime.getHours();

            return (
              <Box
                key={hour}
                sx={{
                  position: "absolute",
                  top: `${(i / slotHours.length) * 100}%`,
                  left: 0,
                  right: 0,
                  height: `${100 / slotHours.length}%`,
                  borderBottom: "1px solid #f0f0f0",
                  background: isCurrentHour ? "#e3f2fd" : "transparent",
                  display: "flex",
                  alignItems: "flex-start",
                  zIndex: 1,
                }}
              >
                {/* Time label */}
                <Box
                  sx={{
                    width: "100px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRight: "1px solid #f0f0f0",
                    background: "#fafafa",
                    height: "100%",
                    minHeight: "60px",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: isCurrentHour ? "bold" : 500,
                      color: isCurrentHour ? "primary.main" : "text.secondary",
                      fontSize: { xs: "1.1rem", md: "1.3rem" },
                    }}
                  >
                    {hour.toString().padStart(2, "0")}:00
                  </Typography>
                </Box>
              </Box>
            );
          })}

          {/* Events Overlay */}
          <Box
            sx={{
              position: "absolute",
              left: 100,
              top: 0,
              right: 0,
              bottom: 0,
              zIndex: 2,
            }}
          >
            {todayEvents.map((event) => {
              const eventStart = new Date(event.startTime);
              const eventEnd = new Date(event.endTime);

              if (eventEnd <= rangeStart || eventStart >= rangeEnd) {
                return null;
              }

              const eventStartHour =
                eventStart.getHours() + eventStart.getMinutes() / 60;
              const eventEndHour =
                eventEnd.getHours() + eventEnd.getMinutes() / 60;

              const firstSlotHour = slotHours[0];
              const totalRangeHours = rangeHours;

              const topPercent =
                ((eventStartHour - firstSlotHour) / totalRangeHours) * 100;
              const heightPercent =
                ((eventEndHour - eventStartHour) / totalRangeHours) * 100;

              if (topPercent < 0 || topPercent > 100 || heightPercent <= 0) {
                return null;
              }

              const isCurrentEvent = getCurrentMeeting()?.id === event.id;

              return (
                <Card
                  key={event.id}
                  sx={{
                    position: "absolute",
                    left: "12px",
                    right: "12px",
                    top: `${Math.max(0, topPercent)}%`,
                    height: `${Math.min(100 - Math.max(0, topPercent), heightPercent)}%`,
                    minHeight: "30px",
                    background: isCurrentEvent
                      ? "linear-gradient(135deg, #f44336 0%, #d32f2f 100%)"
                      : "linear-gradient(135deg, #2196f3 0%, #1976d2 100%)",
                    color: "white",
                    borderRadius: 3,
                    boxShadow: 4,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  <CardContent
                    sx={{
                      p: { xs: 1.5, md: 2 },
                      "&:last-child": { pb: { xs: 1.5, md: 2 } },
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: "bold",
                        mb: 0.5,
                        fontSize: { xs: "0.9rem", md: "1.1rem" },
                        lineHeight: 1.2,
                      }}
                    >
                      {event.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        opacity: 0.9,
                        fontSize: { xs: "0.8rem", md: "0.9rem" },
                      }}
                    >
                      {formatTime(event.startTime)} -{" "}
                      {formatTime(event.endTime)}
                    </Typography>
                  </CardContent>
                </Card>
              );
            })}
          </Box>

          {/* Now Line */}
          {(() => {
            const nowHour =
              currentTime.getHours() + currentTime.getMinutes() / 60;
            const firstSlotHour = slotHours[0];
            const totalRangeHours = rangeHours;

            const nowTopPercent =
              ((nowHour - firstSlotHour) / totalRangeHours) * 100;

            if (nowTopPercent < 0 || nowTopPercent > 100) {
              return null;
            }

            return (
              <Box
                sx={{
                  position: "absolute",
                  left: "100px",
                  right: 0,
                  top: `${nowTopPercent}%`,
                  height: "4px",
                  background: "#f44336",
                  boxShadow: "0 0 15px #f44336",
                  zIndex: 10,
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    left: "-10px",
                    top: "-7px",
                    width: "18px",
                    height: "18px",
                    background: "#f44336",
                    borderRadius: "50%",
                    border: "3px solid white",
                  },
                  "&::after": {
                    content: `"${currentTime.toLocaleTimeString("hr-HR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}"`,
                    position: "absolute",
                    right: "15px",
                    top: "-16px",
                    background: "#f44336",
                    color: "white",
                    padding: "4px 12px",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: "bold",
                  },
                }}
              />
            );
          })()}
        </Box>
      </Box>

      {/* Quick Book FAB */}
      {canQuickBook() && (
        <Fab
          color="primary"
          size="large"
          onClick={() => setQuickBookOpen(true)}
          sx={{
            position: "absolute",
            bottom: 40,
            left: "50%",
            transform: "translateX(-50%)",
            width: 80,
            height: 80,
            background: "linear-gradient(135deg, #4caf50 0%, #388e3c 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #45a049 0%, #2e7d32 100%)",
            },
            zIndex: 10,
          }}
        >
          <Add sx={{ fontSize: 40 }} />
        </Fab>
      )}

      {/* Quick Book Dialog */}
      <Dialog
        open={quickBookOpen}
        onClose={() => setQuickBookOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
          },
        }}
      >
        <DialogTitle sx={{ textAlign: "center", color: "white" }}>
          <Typography variant="h4" fontWeight="bold">
            Brzo rezerviraj
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, mt: 1 }}>
            Koliko dugo trebate sobu?
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Stack spacing={4} sx={{ py: 2 }}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h2" fontWeight="bold" sx={{ mb: 2 }}>
                {selectedDuration} min
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                }}
              >
                <IconButton
                  onClick={() =>
                    setSelectedDuration(Math.max(15, selectedDuration - 15))
                  }
                  sx={{
                    color: "white",
                    background: "rgba(255,255,255,0.2)",
                    "&:hover": { background: "rgba(255,255,255,0.3)" },
                  }}
                >
                  <Remove />
                </IconButton>

                <Box sx={{ width: 200 }}>
                  <Slider
                    value={selectedDuration}
                    onChange={(e, value) => setSelectedDuration(value)}
                    min={15}
                    max={60}
                    step={15}
                    marks={[
                      { value: 15, label: "15m" },
                      { value: 30, label: "30m" },
                      { value: 45, label: "45m" },
                      { value: 60, label: "60m" },
                    ]}
                    sx={{
                      color: "white",
                      "& .MuiSlider-mark": { color: "white" },
                      "& .MuiSlider-markLabel": { color: "white" },
                    }}
                  />
                </Box>

                <IconButton
                  onClick={() =>
                    setSelectedDuration(Math.min(60, selectedDuration + 15))
                  }
                  sx={{
                    color: "white",
                    background: "rgba(255,255,255,0.2)",
                    "&:hover": { background: "rgba(255,255,255,0.3)" },
                  }}
                >
                  <Add />
                </IconButton>
              </Box>
            </Box>

            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Rezervacija će početi odmah i trajati do
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {new Date(
                  new Date().getTime() + selectedDuration * 60 * 1000
                ).toLocaleTimeString("hr-HR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            onClick={() => setQuickBookOpen(false)}
            startIcon={<Close />}
            sx={{
              color: "white",
              borderColor: "white",
              "&:hover": {
                borderColor: "white",
                background: "rgba(255,255,255,0.1)",
              },
            }}
            variant="outlined"
            size="large"
          >
            Odustani
          </Button>

          <Button
            onClick={handleQuickBook}
            startIcon={<Check />}
            variant="contained"
            size="large"
            sx={{
              background: "linear-gradient(135deg, #4caf50 0%, #388e3c 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #45a049 0%, #2e7d32 100%)",
              },
            }}
          >
            Rezerviraj
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
