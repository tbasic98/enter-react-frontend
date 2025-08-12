// LoginPage.jsx
import * as React from "react";
import { useAuth } from "../AuthContext";
import { AppProvider, SignInPage } from "@toolpad/core";

export default function LoginPage() {
  const { login } = useAuth();
  const [error, setError] = React.useState(null);

  async function signIn(provider, formData, callbackUrl) {
    if (provider.id === "credentials") {
      const email = formData.get("email");
      const password = formData.get("password");

      if (!email || !password) {
        return { error: "Molimo popunite email i lozinku." };
      }

      try {
        await login({ email, password });
        // Prijava uspješna - možete dodati redirect ili drugo ponašanje
        setError(null);
        return {};
      } catch (error) {
        setError(true);
        return { error: "Neispravan email ili lozinka." };
      }
    }
  }
  return (
    <AppProvider>
      <SignInPage
        signIn={signIn}
        providers={[{ id: "credentials", name: "Email and password" }]}
        error={error}
        slotProps={{
          emailField: {
            error: error,
            onChange: () => {
              setError(null);
            },
          },
          passwordField: {
            error: error,
            onChange: () => {
              setError(null);
            },
          },
        }}
      />
    </AppProvider>
  );
}
