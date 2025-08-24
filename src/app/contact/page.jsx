"use client";

import React from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Contact() {
  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-r from-orange-100 via-red-200 to-white p-6">
        <div className="container mx-auto bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-4xl font-extrabold text-center text-orange-800 mb-6 animate-bounce">
            Contact Information
          </h1>

          <div className="flex items-center mb-4">
            <FaUser className="text-orange-500 text-2xl mr-4" />
            <p className="text-gray-700 text-lg font-medium">Muhammad Munir</p>
          </div>

          <div className="flex items-center mb-4">
            <FaPhone className="text-red-500 text-2xl mr-4" />
            <p className="text-gray-700 text-lg font-medium">+92 319 5803212</p>
          </div>

          <div className="flex items-center mb-4">
            <FaEnvelope className="text-yellow-500 text-2xl mr-4" />
            <p className="text-gray-700 text-lg font-medium">munir.webdev@gmail.com</p>
          </div>

          <div className="flex items-center mb-4">
            <FaMapMarkerAlt className="text-green-500 text-2xl mr-4" />
            <p className="text-gray-700 text-lg font-medium">Muzaffargarh, Shahgarh</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
