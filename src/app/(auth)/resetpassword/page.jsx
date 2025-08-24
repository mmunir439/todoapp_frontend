"use client";
import React, { useState } from "react";
import axios from "../../utils/axios";
import { useRouter } from "next/navigation";

export default function ResetPassword() {
  const [formData, setFormData] = useState({
    token: "",
    newPassword: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/user/reset-password", formData);
      setMessage(response.data.message);
      setError("");
      setTimeout(() => {
        router.push("/login");
      }, 2000); // Redirect to login after 2 seconds
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred.");
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 via-green-200 to-green-300 p-6 flex flex-col justify-center items-center">
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
        Reset Password
      </h1>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white p-8 rounded-xl shadow-lg"
      >
        <label
          htmlFor="token"
          className="block mb-2 font-semibold text-gray-700"
        >
          Reset Token
        </label>
        <input
          type="text"
          name="token"
          placeholder="Enter your reset token"
          value={formData.token}
          onChange={handleChange}
          className="w-full p-4 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
        />
        <label
          htmlFor="newPassword"
          className="block mb-2 font-semibold text-gray-700"
        >
          New Password
        </label>
        <input
          type="password"
          name="newPassword"
          placeholder="Enter your new password"
          value={formData.newPassword}
          onChange={handleChange}
          className="w-full p-4 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
        />
        <button
          type="submit"
          className="w-full p-4 bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white rounded-lg hover:from-green-500 hover:via-green-600 hover:to-green-700 transition-all duration-300 font-bold shadow-lg"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
}