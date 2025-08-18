import { ReactRouterAppProvider } from "@toolpad/core/react-router";
import { DashboardLayout, PageContainer } from "@toolpad/core";
import { Outlet } from "react-router-dom";

// Icons
import PeopleIcon from "@mui/icons-material/People";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import { useAuth } from "../AuthContext";
import { DashboardOutlined } from "@mui/icons-material";

export const getNavigation = (userRole) => {
  const baseNavigation = [
    {
      segment: "dashboard",
      title: "Dashboard",
      icon: <DashboardOutlined />,
    },
  ];

  // Dodajte admin-only navigaciju
  // if (userRole === "admin") {
  baseNavigation.push(
    {
      segment: "users",
      title: "Korisnici",
      icon: <PeopleIcon />,
    },
    {
      segment: "rooms",
      title: "Sobe",
      icon: <MeetingRoomIcon />,
    }
  );
  // }

  return baseNavigation;
};

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
  const navigation = getNavigation(user?.role);

  return (
    <ReactRouterAppProvider
      session={session}
      authentication={authentication}
      navigation={navigation}
    >
      <DashboardLayout branding={{ title: "Meeting Scheduler", logo: "" }}>
        <PageContainer breadcrumbs={[]}>
          <Outlet />
        </PageContainer>
      </DashboardLayout>
    </ReactRouterAppProvider>
  );
}
