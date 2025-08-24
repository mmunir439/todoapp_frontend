"use client";
import React, { useState } from "react";
import axios from "@/app/utils/axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [successful, setSuccessful] = useState("");
  const [errormessage, setErrormessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Set submitting state to true
    try {
      const response = await axios.post("/user/loginuser", formData);
      console.log("Response from backend:", response.data);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        setSuccessful("Login successful! Redirecting to home...");
        setErrormessage("");
        setFormData({ email: "", password: "" });
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        setErrormessage("Login failed. Please check your credentials.");
        setSuccessful("");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrormessage("Login error. Please try again.");
      setSuccessful("");
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-200 via-orange-200 to-red-200 p-6 flex flex-col justify-center items-center">
      {successful && (
        <div className="w-full max-w-lg mb-4 p-4 rounded-lg bg-green-100 border border-green-400 text-green-800 text-center font-semibold shadow animate-bounce-in">
          {successful}
        </div>
      )}
      {errormessage && (
        <div className="w-full max-w-lg mb-4 p-4 rounded-lg bg-red-100 border border-red-400 text-red-800 text-center font-semibold shadow animate-shake">
          {errormessage}
        </div>
      )}
      <h1 className="text-4xl font-bold text-gray-800 mb-6 drop-shadow-lg text-center">
        User Login
      </h1>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white p-8 rounded-xl shadow-lg"
      >
        <label
          htmlFor="email"
          className="block mb-2 font-semibold text-gray-700"
        >
          Email
        </label>
        <input
          type="email"
          name="email"
          placeholder="Enter email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-4 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
        />
        <label
          htmlFor="password"
          className="block mb-2 font-semibold text-gray-700"
        >
          Password
        </label>
        <input
          type="password"
          name="password"
          placeholder="Enter password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-4 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
        />
        <div className="flex justify-between items-center mb-6">
          <Link
            href="/forgotpassword"
            className="text-sm text-orange-600 hover:underline"
          >
            Forgot Password?
          </Link>
          <Link
            href="/register"
            className="text-sm text-gray-600 hover:underline"
          >
            Don't have an account? Register here.
          </Link>
        </div>
        <button
          type="submit"
          className="w-full p-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white rounded-lg hover:from-yellow-500 hover:via-orange-600 hover:to-red-600 transition-all duration-300 font-bold shadow-lg"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
      <style jsx global>{`
        @keyframes fade-in {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease;
        }
        @keyframes bounce-in {
          0% {
            transform: scale(0.9);
            opacity: 0.5;
          }
          60% {
            transform: scale(1.05);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-bounce-in {
          animation: bounce-in 0.7s cubic-bezier(.68,-0.55,.27,1.55);
        }
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          20%,
          60% {
            transform: translateX(-10px);
          }
          40%,
          80% {
            transform: translateX(10px);
          }
        }
        .animate-shake {
          animation: shake 0.5s;
        }
      `}</style>
    </div>
  );
}