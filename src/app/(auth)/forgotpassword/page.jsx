"use client";
import React, { useState } from "react";
import axios from "../../utils/axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/user/forgotPassword", { email });
      setMessage(response.data.message);
      setError("");
      setEmail("");
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred.");
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 p-6 flex flex-col justify-center items-center">
      {message && (
        <div className="w-full max-w-lg mb-4 p-4 rounded-lg bg-green-100 border border-green-400 text-green-800 text-center font-semibold shadow">
          {message}
        </div>
      )}
      {error && (
        <div className="w-full max-w-lg mb-4 p-4 rounded-lg bg-red-100 border border-red-400 text-red-800 text-center font-semibold shadow">
          {error}
        </div>
      )}
      <h1 className="text-3xl font-bold text-gray-800 mb-6 drop-shadow-lg text-center">
        Forgot Password
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
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-4 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
        />
        <button
          type="submit"
          className="w-full p-4 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-500 hover:via-blue-600 hover:to-blue-700 transition-all duration-300 font-bold shadow-lg"
        >
          Send Reset Link
        </button>
      </form>
    </div>
  );
}