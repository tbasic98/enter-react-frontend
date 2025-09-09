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
import { PublicRoutes } from "./auth/PublicRoutes";
import { ProtectedRoutes } from "./auth/ProtectedRoutes";
import { DashboardLayoutWrapper } from "./components/DashboardLayoutWrapper";
import { AppProvider } from "@toolpad/core";
import { DashboardPage } from "./pages/DashboardPage";
import AdminRoute from "./auth/AdmingRoutes";
import UnauthorizedPage from "./pages/UnauthorizedPage";

function App() {
  return (
    <Router>
      <CssBaseline />
      <Routes>
        <Route
          path="/conf-room/:id"
          element={
              <RoomView />
          }
        />
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
            {/* Admin-only rute */}
            <Route
              path="/users"
              element={
                <AdminRoute>
                  <UsersPage />
                </AdminRoute>
              }
            />
            <Route
              path="/rooms"
              element={
                <AdminRoute>
                  <RoomsPage />
                </AdminRoute>
              }
            />

            {/* Dostupno svim autentificiranim korisnicima */}
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* Unauthorized page - sada unutar layout-a */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            <Route index element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
