import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Container from "../components/layout/Container";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { LogIn } from "lucide-react";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (errors[e.target.name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [e.target.name]: undefined,
      });
    }
  };

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await axios.post("https://vp-garments-production.up.railway.app/api/v1/login", formData);
      const { token } = response.data; // Only store the token
      localStorage.setItem("token", token); // Save token to localStorage

      // Fetch user details (including role) from the backend
      const userResponse = await axios.get("https://vp-garments-production.up.railway.app/api/v1/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { role } = userResponse.data;
      
      
      // Get the role from the backend

      // Redirect based on role
      if (role === "admin") {
        navigate("/"); 
        window.location.reload();// Redirect to admin dashboard
      } else {
        console.log("Navigating to /");
        navigate("/"); // Redirect to home for regular users
        window.location.reload();
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.msg || "Login failed. Please check your credentials.";
      if (errorMessage.toLowerCase().includes("email")) {
        setErrors({ email: errorMessage });
      } else if (errorMessage.toLowerCase().includes("password")) {
        setErrors({ password: errorMessage });
      } else {
        alert(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-off-white py-16">
      <Container>
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-display font-bold text-neutral-900 mb-2">Welcome Back</h1>
            <p className="text-neutral-600">Sign in to continue shopping</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              name="email"
              id="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              autoComplete="email"
            />

            <Input
              label="Password"
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              autoComplete="current-password"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-brand-600 border-neutral-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-700">
                  Remember me
                </label>
              </div>

              <Link to="#" className="text-sm text-brand-600 hover:text-brand-700">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isLoading}
              icon={<LogIn size={18} />}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-600">
              Don't have an account?{" "}
              <Link to="/signup" className="font-medium text-brand-600 hover:text-brand-700">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </main>
  );
};

export default Login;
