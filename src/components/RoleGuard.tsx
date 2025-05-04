import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const RoleGuard: React.FC<{ allowedRoles: string[] }> = ({ allowedRoles }) => {
  const role = localStorage.getItem("role"); // Get the user's role from localStorage

  // Check if the user's role is allowed
  if (!allowedRoles.includes(role || "")) {
    // Redirect admins to /admin if they try to access unauthorized routes
    if (role === "admin") {
      return <Navigate to="/admin" />;
    }
    // Redirect unauthorized users to login
    return <Navigate to="/login" />;
  }

  return <Outlet />; // Render the child routes if the role is allowed
};

export default RoleGuard;