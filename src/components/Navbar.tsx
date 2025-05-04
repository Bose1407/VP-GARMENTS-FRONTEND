import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import Container from "./layout/Container";
import Button from "./ui/Button";
import { cn } from "../utils/cn";
import { useAuth } from "../context/AuthContext";

const Navbar: React.FC = () => {
  const { isAuthenticated, isAdmin, setAuthState } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the token from localStorage
    setAuthState({ isAuthenticated: false, isAdmin: false }); // Update global auth state
    navigate("/login"); // Redirect to the login page
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header
      className={cn(
        "sticky top-0 w-full z-50 transition-all duration-300",
        isScrolled ? "bg-white shadow-sm" : "bg-white/80 backdrop-blur-md"
      )}
    >
      <Container>
        <nav className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="font-display text-2xl font-bold tracking-tight text-neutral-900"
          >
            VP-Garments
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={cn(
                "text-sm font-medium transition-colors hover:text-brand-500",
                isActive("/") ? "text-brand-600" : "text-neutral-700"
              )}
            >
              Home
            </Link>
            <Link
              to="/products"
              className={cn(
                "text-sm font-medium transition-colors hover:text-brand-500",
                isActive("/products") ? "text-brand-600" : "text-neutral-700"
              )}
            >
              Products
            </Link>
            <Link
              to="/cart"
              className={cn(
                "text-sm font-medium transition-colors hover:text-brand-500",
                isActive("/cart") ? "text-brand-600" : "text-neutral-700"
              )}
            >
              Cart
            </Link>

            {/* Admin Dashboard Link (Visible only for Admins) */}
            {isAdmin && (
              <Link
                to="/admin"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-brand-500",
                  isActive("/admin") ? "text-brand-600" : "text-neutral-700"
                )}
              >
                Admin Dashboard
              </Link>
            )}
          </div>

          {/* Desktop Right Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* User Profile Icon */}
                <Link to="/profile" className="p-2 text-neutral-700 hover:text-neutral-900 transition-colors">
                  <User size={20} />
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<LogOut size={16} />}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </nav>
      </Container>
    </header>
  );
};

export default Navbar;