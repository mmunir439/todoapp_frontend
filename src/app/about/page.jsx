"use client";

import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function About() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 p-6 flex flex-col justify-center items-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6 drop-shadow-lg text-center animate-bounce">
          About Us
        </h1>
        <div className="w-full max-w-lg bg-white p-6 rounded-xl shadow-lg border border-blue-300">
          <p className="text-gray-700 text-lg mb-4">
            Welcome to TodoApp! Our mission is to help you stay organized and
            productive by providing a simple and intuitive platform for managing
            your tasks.
          </p>
          <p className="text-gray-700 text-lg mb-4">
            Whether you're planning your day, tracking your projects, or
            collaborating with your team, TodoApp is designed to make task
            management effortless and enjoyable.
          </p>
          <p className="text-gray-700 text-lg mb-4">
            We believe in the power of simplicity and aim to deliver a seamless
            experience that empowers you to achieve your goals.
          </p>
          <p className="text-gray-700 text-lg">
            Thank you for choosing TodoApp. Let's make productivity a breeze!
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}