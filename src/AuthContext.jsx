import { createContext, useState, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(localStorage.getItem("token") || null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  console.log(user, token);

  // Login with API
  const login = async ({ email, password }) => {
    try {
      const res = await axios.post(
        "https://enter-backend.onrender.com/api/auth/login",
        {
          email,
          password,
        }
      );

      const { access_token, user } = res.data;

      setToken(access_token);
      setUser(user);

      // Store in localStorage for persistence
      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(user));

      return true;
    } catch (error) {
      throw error;
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
