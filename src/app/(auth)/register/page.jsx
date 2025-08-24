"use client";
import React, { useState } from "react";
import axios from "../../utils/axios";
import { useRouter } from "next/navigation";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    cnic: "",
    password: "",
  });
  const [successful, setSuccessful] = useState("");
  const [errormessage, setErrormessagae] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/user/registeruser", formData);
      setSuccessful("Registration successful! Redirecting to login...");
      setErrormessagae("");
      setFormData({ username: "", email: "", cnic: "", password: "" });
      setTimeout(() => {
        router.push("/login");
      }, 2000); // 2 seconds delay for user to see the message
    } catch (error) {
      setErrormessagae("Registration error. Please try again.");
      setSuccessful("");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-r from-green-200 via-blue-200 to-purple-200 p-6 animate-fade-in">
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
      <h1 className="text-3xl font-bold text-gray-800 mb-6 drop-shadow-lg">
        User Registration
      </h1>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white p-8 rounded-xl shadow-lg"
      >
        <label
          htmlFor="username"
          className="block mb-2 font-semibold text-gray-700"
        >
          Username
        </label>
        <input
          type="text"
          name="username"
          placeholder="Enter username"
          value={formData.username}
          onChange={handleChange}
          className="w-full p-4 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
        />
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
          className="w-full p-4 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
        />
        <label
          htmlFor="cnic"
          className="block mb-2 font-semibold text-gray-700"
        >
          CNIC
        </label>
        <input
          type="text"
          name="cnic"
          placeholder="Enter CNIC"
          value={formData.cnic}
          onChange={handleChange}
          className="w-full p-4 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
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
          className="w-full p-4 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
        />
        <button
          type="submit"
          className="w-full p-4 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 text-white rounded-lg hover:from-green-500 hover:via-blue-600 hover:to-purple-600 transition-all duration-300 font-bold shadow-lg"
        >
          Register
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