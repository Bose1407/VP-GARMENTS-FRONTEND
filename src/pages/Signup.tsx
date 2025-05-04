import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Container from "../components/layout/Container";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { UserPlus } from "lucide-react";

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{name?: string; email?: string; password?: string}>({});
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
    const newErrors: {name?: string; email?: string; password?: string} = {};
    
    if (!formData.name) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      await axios.post("http://localhost:5000/api/v1/signup", formData);
      navigate("/login", { state: { message: "Account created successfully! Please log in." } });
    } catch (err: any) {
      const errorMessage = err.response?.data?.msg || "Signup failed. Please try again.";
      if (errorMessage.toLowerCase().includes("email")) {
        setErrors({ email: errorMessage });
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
            <h1 className="text-2xl font-display font-bold text-neutral-900 mb-2">Create Account</h1>
            <p className="text-neutral-600">Join us to start shopping</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              name="name"
              id="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              autoComplete="name"
            />
            
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
              helperText="Password must be at least 6 characters"
              autoComplete="new-password"
            />
            
            <div className="mt-1">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-brand-600 border-neutral-300 rounded"
                  required
                />
                <span className="ml-2 text-sm text-neutral-700">
                  I agree to the{" "}
                  <Link to="#" className="text-brand-600 hover:text-brand-700">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="#" className="text-brand-600 hover:text-brand-700">
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>
            
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isLoading}
              icon={<UserPlus size={18} />}
            >
              Create Account
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-600">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </main>
  );
};

export default Signup;