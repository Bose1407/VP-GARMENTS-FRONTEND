import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  setAuthState: (authState: { isAuthenticated: boolean; isAdmin: boolean }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchAuthState = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setIsAuthenticated(false);
          setIsAdmin(false);
          return;
        }

        // Fetch user details from the backend
        const response = await axios.get("https://vp-garments.netlify.app/api/v1/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { role } = response.data;
        setIsAuthenticated(true);
        setIsAdmin(role === "admin");
      } catch (err) {
        console.error("Error fetching auth state:", err);
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    };

    fetchAuthState();
  }, []);

  const setAuthState = (authState: { isAuthenticated: boolean; isAdmin: boolean }) => {
    setIsAuthenticated(authState.isAuthenticated);
    setIsAdmin(authState.isAdmin);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
