import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

// A simple layout component that renders Navbar + Outlet
export function NavbarLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
