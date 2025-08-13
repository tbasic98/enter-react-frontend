import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../AuthContext";

export const PublicRoutes = () => {
  const { user, token } = useAuth();

  const isAuth = user && token;

  return !isAuth ? <Outlet /> : <Navigate to="/dashboard" replace />;
};
