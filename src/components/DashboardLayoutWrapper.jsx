import { ReactRouterAppProvider } from "@toolpad/core/react-router";
import { DashboardLayout, PageContainer } from "@toolpad/core";
import { Outlet } from "react-router-dom";

// Icons
import PeopleIcon from "@mui/icons-material/People";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import EventIcon from "@mui/icons-material/Event";
import { useAuth } from "../AuthContext";

// Sidebar navigation
const NAVIGATION = [
  { segment: "users", title: "Users", icon: <PeopleIcon /> },
  { segment: "rooms", title: "Rooms", icon: <MeetingRoomIcon /> },
  { segment: "events", title: "Events", icon: <EventIcon /> },
];

export function DashboardLayoutWrapper() {
  const { user, logout } = useAuth();

  const session = {
    user: {
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      image: null,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
    },
  };

  const authentication = {
    signIn: () => {}, // već ste ulogirani
    signOut: async () => {
      logout();
    },
  };

  return (
    <ReactRouterAppProvider
      session={session}
      authentication={authentication}
      navigation={NAVIGATION}
    >
      <DashboardLayout branding={{ title: "Meeting Scheduler", logo: "" }}>
        <PageContainer>
          <Outlet />
        </PageContainer>
      </DashboardLayout>
    </ReactRouterAppProvider>
  );
}
