import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null); // Track admin status
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token from localStorage
        if (!token) {
          setIsAdmin(false); // No token means not authenticated
          return;
        }

        // Fetch user details (including role) from the backend
        const userResponse = await axios.get("https://vp-garments-production.up.railway.app/api/v1/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { role } = userResponse.data;
        console.log("User role:", role);

        setIsAdmin(role === "admin"); // Set admin status based on role
      } catch (err) {
        console.error("Error checking admin role:", err);
        setIsAdmin(false); // Default to non-admin on error
      } finally {
        setIsLoading(false); // Loading is complete
      }
    };

    checkAdmin();
  }, []);

  if (isLoading) {
    // Show a loading indicator while checking admin status
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    // Redirect non-admin users to the home page
    return <Navigate to="/" />;
  }

  // Render children for admin users
  return <>{children}</>;
};

export default AdminRoute;
