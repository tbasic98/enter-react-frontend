import { useAuth } from "../AuthContext";
import { useState } from "react";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
      // Redirect or do something on success
    } catch (error) {
      if (error?.status === 400) {
        setError(
          error?.response?.data?.message || "Neispravan email ili password"
        );
      }
    }
  };

  return (
    <div style={{ padding: "25px" }}>
      <div className="auth-container">
        <h2>Login</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            style={{ borderColor: error && "red" }}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setError(null);
              setEmail(e.target.value);
            }}
            required
          />
          <input
            style={{ borderColor: error && "red" }}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setError(null);
              setPassword(e.target.value);
            }}
            required
          />
          <button type="submit">Log In</button>
        </form>
      </div>
    </div>
  );
}
