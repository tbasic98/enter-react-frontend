import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";

export const Navbar = () => {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav
      style={{
        padding: "10px",
        borderBottom: "1px solid #ccc",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex" }}>
        <Link to="/users" style={{ marginRight: 15 }}>
          Users
        </Link>
        <Link to="/rooms" style={{ marginRight: 15 }}>
          Rooms
        </Link>
        <Link to="/events" style={{ marginRight: 15 }}>
          Events
        </Link>
      </div>

      <div>
        <button onClick={() => handleLogout}>Logout</button>
      </div>
    </nav>
  );
};
