"use client";
import React ,{useState} from "react";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function SignupFormDemo() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/signup", 
        {
          name: formData.name,
          email: formData.email,
          address: formData.address,
          password: formData.password,
          confirmPassword: formData.confirmPassword, 
        },
        { withCredentials: true } // allow cookies if needed
      );

      setSuccess(res.data.message || "Signup successful!");
      setFormData({
        name: "",
        email: "",
        address: "",
        password: "",
        confirmPassword: "",
      });

      localStorage.setItem("user", JSON.stringify(form));
    alert("Signup successful, please login");
    navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
        Welcome to Softmate
      </h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
        SignUp to Softmate Systems 
      </p>
      <form className="my-8" onSubmit={handleSubmit}>
        <div
          className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
          <LabelInputContainer>
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Name" type="text" value={formData.name}
              onChange={handleChange}
              required/>
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" placeholder="test@gmail.com" type="email" value={formData.email}
              onChange={handleChange}
              required/>
        </LabelInputContainer>
        </div>
        <LabelInputContainer>
            <Label htmlFor="lastname">Address</Label>
            <Input id="address" placeholder="Address" type="text" value={formData.address}
            onChange={handleChange}
            required/>
          </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input id="password" placeholder="••••••••" type="password" value={formData.password}
            onChange={handleChange}
            required/>
        </LabelInputContainer>
        <LabelInputContainer className="mb-8">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input id="confirmPassword" placeholder="••••••••" type="password" value={formData.confirmPassword}
            onChange={handleChange}
            required/>
        </LabelInputContainer>

     <button
          className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-md dark:bg-zinc-800"
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign up →"}
          <BottomGradient />
        </button>
         {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
        {success && <p className="mt-4 text-green-500 text-sm">{success}</p>}
        
        <div
          className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

        {/* Login Link */}
        <div className="text-center">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:text-blue-500 font-medium underline transition-colors"
            >
              Login here
            </button>
          </p>
        </div>

        
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span
        className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span
        className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};
