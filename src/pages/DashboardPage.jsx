// pages/DashboardPage.jsx
import { useState } from "react";
import { AddEventForm } from "../form/AddEventForm";
import { DeleteConfirmationModal } from "../modal/DeleteConfirmationModal";
import {
  Container,
  Grid,
  Stack,
  CircularProgress,
  Typography,
} from "@mui/material";
import DashboardStats from "../components/Dashboard/DashboardStats";
import DashboardHeader from "../components/Dashboard/DashboardHeader";
import TodaysMeetingsList from "../components/dashboard/TodaysMeetingsList";
import UpcomingMeetingsList from "../components/Dashboard/UpcomingMeetingsList";
import AvailableRoomsList from "../components/Dashboard/AvailableRoomsList";

import { DashboardError } from "../components/dashboard/DashboardError";
import { useData } from "../components/dashboard/useData";
import { useCurrentMeetings } from "../hooks/useCurrentMeetings";
import { useUpcomingMeetings } from "../hooks/useUpcomingMeetings";
import { useTodayMeetings } from "../hooks/useTodayMeetings";

// Import naših novih komponenti

export const DashboardPage = () => {
  // State management

  const [open, setOpen] = useState(false);

  const {
    loading,
    error,
    userMeetings,
    setUserMeetings,
    availableRooms,
    handleConfirmDelete,
    selectedEvent,
    setSelectedEvent,
    deleteOpen,
    setDeleteOpen,
  } = useData();

  // Computed values
  const { todayMeetings } = useTodayMeetings(userMeetings);
  const { upcomingMeetings } = useUpcomingMeetings(userMeetings);
  const { currentMeeting } = useCurrentMeetings(userMeetings);
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
    <DashboardError />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header */}
      <DashboardHeader />

      {/* Stats Cards */}
      <DashboardStats
        currentMeeting={currentMeeting}
        todayMeetingsCount={todayMeetings.length}
        totalMeetingsCount={userMeetings.length}
        availableRoomsCount={availableRooms.length}
        setOpen={setOpen}
      />

      {/* Main Content */}
      <Grid container spacing={4}>
        {/* LEFT COLUMN */}
        <Grid item xs={12} md={8} minWidth={"fit-content"} flex={"1 1 40%"}>
          <TodaysMeetingsList
            todayMeetings={todayMeetings}
            currentMeeting={currentMeeting}
            setSelectedEvent={setSelectedEvent}
            setDeleteOpen={setDeleteOpen}
          />
        </Grid>

        {/* RIGHT COLUMN */}
        <Grid
          item
          xs={12}
          md={4}
          minWidth={"fit-content"}
          flex={"1 1 calc(60% - 32px)"}
        >
          <Stack spacing={3} height={"fit-content"}>
            <UpcomingMeetingsList meetings={upcomingMeetings} />
            <AvailableRoomsList rooms={availableRooms} />
          </Stack>
        </Grid>
      </Grid>

      {/* Modals */}
      <AddEventForm
        open={open}
        setOpen={setOpen}
        onClose={() => setOpen(false)}
        setUserMeetings={setUserMeetings}
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
