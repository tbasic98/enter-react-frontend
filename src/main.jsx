import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./AuthContext";
import { ToastContainer } from "react-toastify";
import { AppBar, createTheme, ThemeProvider } from "@mui/material";

const theme = createTheme();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <ToastContainer />
        <App />
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);
