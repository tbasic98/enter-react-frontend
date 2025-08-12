import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import UsersPage from "./components/UsersPage";
import RoomsPage from "./components/RoomsPage";
import RoomView from "./components/RoomView";
import EventsPage from "./components/EventsPage";
import { ProtectedRoutes } from "./auth/ProtectedRoutes";
import { PublicRoutes } from "./auth/PublicRoutes";
import { NavbarLayout } from "./components/NavbarLayout";

function App() {
  return (
    <Router>
      <div style={{ fontFamily: "Arial, sans-serif" }}>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoutes>
                <LoginPage />
              </PublicRoutes>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoutes>
                <RegisterPage />
              </PublicRoutes>
            }
          />
          <Route element={<ProtectedRoutes />}>
            <Route element={<NavbarLayout />}>
              <Route path="/users" element={<UsersPage />} />
              <Route path="/rooms" element={<RoomsPage />} />
              <Route path="/rooms/:id" element={<RoomView />} />
              <Route path="/events" element={<EventsPage />} />
            </Route>
          </Route>

          {/* Redirect any unknown route to /login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
