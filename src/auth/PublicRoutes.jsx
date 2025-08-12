import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export const PublicRoutes = ({ children }) => {
  const navigate = useNavigate();

  const { user, token } = useAuth();

  if (user && token) {
    navigate("/rooms");
    return;
  }

  return children;
};
