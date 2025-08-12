import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { CssBaseline } from "@mui/material";

// Pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UsersPage from "./pages/UsersPage";
import RoomsPage from "./pages/RoomsPage";
import RoomView from "./pages/RoomView";
import EventsPage from "./pages/EventsPage";
import { PublicRoutes } from "./auth/PublicRoutes";
import { ProtectedRoutes } from "./auth/ProtectedRoutes";
import { DashboardLayoutWrapper } from "./components/DashboardLayoutWrapper";
import { AppProvider } from "@toolpad/core";

function App() {
  return (
    <Router>
      <CssBaseline />
      <Routes>
        <Route element={<PublicRoutes />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        <Route element={<ProtectedRoutes />}>
          <Route
            element={
              <AppProvider>
                <DashboardLayoutWrapper />
              </AppProvider>
            }
          >
            <Route path="/users" element={<UsersPage />} />
            <Route path="/rooms" element={<RoomsPage />} />
            <Route path="/rooms/:id" element={<RoomView />} />
            <Route path="/events" element={<EventsPage />} />
            <Route index element={<Navigate to="/users" replace />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
