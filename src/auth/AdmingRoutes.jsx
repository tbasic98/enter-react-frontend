// components/routes/AdminRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function AdminRoute({ children }) {
  const location = useLocation();

  const getUserFromStorage = () => {
    try {
      const userString = localStorage.getItem("user");
      return userString ? JSON.parse(userString) : null;
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return null;
    }
  };

  const user = getUserFromStorage();

  // Provjeri da li je korisnik admin
  //   if (!user || user.role !== "admin") {
  //     // Preusmjeri na unauthorized page
  //     return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  //   }

  return children;
}
