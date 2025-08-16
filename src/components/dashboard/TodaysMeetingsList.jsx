// components/dashboard/TodaysMeetingsList.jsx
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  IconButton,
  Divider,
  Stack,
  Tooltip,
} from "@mui/material";
import {
  Today,
  Event as EventIcon,
  AccessTime,
  Delete,
} from "@mui/icons-material";
import { useAuth } from "../../AuthContext";
import { useTimer } from "../../hooks/useTimer";

const TodaysMeetingsList = ({
  todayMeetings,
  currentMeeting,
  setSelectedEvent,
  setDeleteOpen,
}) => {
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

  const { user } = useAuth();

  const { currentTime } = useTimer();

  const onDelete = (event) => {
    setSelectedEvent(event);
    setDeleteOpen(true);
  };

  const canDeleteMeeting = (meeting, ongoing, isPast) => {
    return meeting.userId === user?.id && !ongoing && !isPast;
  };

  return (
    <Card
      elevation={4}
      sx={{
        borderRadius: 3,
        height: "100%",
        minWidth: "fit-content",
        flex: "1 1 40%",
      }}
    >
      <CardContent sx={{ p: 3, height: "100%" }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Today color="primary" sx={{ mr: 2 }} />
          <Typography variant="h5" fontWeight="bold">
            Današnji meetingi
          </Typography>
        </Box>

        {todayMeetings.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 6 }}>
            <EventIcon sx={{ fontSize: 80, color: "text.disabled", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Nema meetinga danas
            </Typography>
            <Typography variant="body2" color="text.disabled">
              Savršen dan za fokusiran rad! 🎯
            </Typography>
          </Box>
        ) : (
          <List sx={{ maxHeight: 450, overflow: "auto" }}>
            {todayMeetings.map((meeting, index) => {
              const isCurrent = currentMeeting?.id === meeting.id;
              const isPast = new Date(meeting.endTime) < currentTime;

              return (
                <React.Fragment key={meeting.id}>
                  <div style={{ padding: "45px 0px 10px 0px" }}>
                    <ListItem
                      sx={{
                        borderRadius: 2,
                        borderTopLeftRadius: 0,
                        position: "relative",
                        mb: 1,
                        bgcolor: isCurrent
                          ? "rgba(238, 90, 36, 0.12)"
                          : isPast
                            ? "rgba(158, 158, 158, 0.08)"
                            : "rgba(33, 150, 243, 0.08)",
                      }}
                    >
                      <Box
                        style={{
                          position: "absolute",
                          bottom: "100%",
                          left: 0,
                          padding: "2.5px 10px",
                          borderTopLeftRadius: 6,
                          borderTopRightRadius: 6,
                          backgroundColor: isCurrent
                            ? "rgba(238, 90, 36, 0.12)"
                            : isPast
                              ? "rgba(158, 158, 158, 0.08)"
                              : "rgba(33, 150, 243, 0.08)",
                        }}
                      >
                        <Typography variant="caption">
                          {isCurrent
                            ? "Ongoing"
                            : isPast
                              ? "Ended"
                              : "Upcoming"}
                        </Typography>
                      </Box>
                      <ListItemIcon>
                        <Avatar
                          sx={{
                            bgcolor: isCurrent
                              ? "warning.main"
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
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <Typography variant="h6" fontWeight="bold">
                                {meeting.title}
                              </Typography>
                              <Typography
                                variant="body2"
                                minWidth={"fit-content"}
                              >
                                {meeting?.room?.name}
                              </Typography>
                            </Box>
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
                      {canDeleteMeeting(meeting, isCurrent, isPast) && (
                        <IconButton
                          onClick={() => onDelete(meeting)}
                          color="error"
                          size="small"
                        >
                          <Delete />
                        </IconButton>
                      )}
                    </ListItem>
                  </div>
                  {index < todayMeetings.length - 1 && <Divider />}
                </React.Fragment>
              );
            })}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default TodaysMeetingsList;
