import { useEffect, useState } from "react";
import { useAuth } from "../../AuthContext";
import { deleteEvent, getAvailableRooms, getUserMeetings } from "../../api";

export const useData = () => {
  const [userMeetings, setUserMeetings] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { user } = useAuth();

  // Dohvati korisničke podatke
  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user?.id]);

  const loadDashboardData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const [meetingsResponse, roomsResponse] = await Promise.all([
        getUserMeetings(user.id),
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

  useEffect(() => {
    const handleAvailableRooms = async () => {
      await getAvailableRooms();
    };

    handleAvailableRooms();
  }, [userMeetings]);

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

  return {
    loading,
    setLoading,
    error,
    setError,
    userMeetings,
    setUserMeetings,
    availableRooms,
    setAvailableRooms,
    handleConfirmDelete,
    selectedEvent,
    setSelectedEvent,
    deleteOpen,
    setDeleteOpen,
  };
};
