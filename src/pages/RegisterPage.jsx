// RegisterPage.jsx
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { AppProvider, SignInPage } from "@toolpad/core";
import { register } from "../api";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = React.useState(null);

  const handleRegister = async (provider, formData) => {
    setError(null);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirm = formData.get("confirm");
    if (password !== confirm) {
      setError("Passwords do not match");
      throw new Error("Passwords do not match");
    }

    try {
      const response = await register({
        name,
        email,
        password,
        password_confirmation: confirm,
      });

      navigate("/login");
    } catch (err) {
      setError("Failed to register");
      throw err;
    }
  };

  return (
    <AppProvider>
      <SignInPage
        providers={[
          {
            id: "credentials",
            name: "Register",
            credentials: [
              { label: "Name", name: "name", type: "text" },
              { label: "Email", name: "email", type: "email" },
              { label: "Password", name: "password", type: "password" },
              { label: "Confirm Password", name: "confirm", type: "password" },
            ],
          },
        ]}
        onSignIn={handleRegister}
        error={error}
      />
    </AppProvider>
  );
}
