import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";

export const Navbar = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
      <Link to="/users" style={{ marginRight: 15 }}>
        Users
      </Link>
      <Link to="/rooms" style={{ marginRight: 15 }}>
        Rooms
      </Link>
      <Link to="/events" style={{ marginRight: 15 }}>
        Events
      </Link>

      <button onClick={() => handleLogout}>Logout</button>
    </nav>
  );
};
