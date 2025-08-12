import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../AuthContext";

export const ProtectedRoutes = () => {
  const { user, token } = useAuth();

  const isAuth = user && token;

  return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
};
