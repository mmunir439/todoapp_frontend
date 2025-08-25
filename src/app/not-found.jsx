"use client";
import React from "react";
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center bg-orange-200
    min-h-screen  text-gray-800">
      <h1 className="text-6xl text-orange-900 font-bold mb-4">404</h1>
      <h2 className="text-2xl mb-2 text-orange-900">Page Not Found</h2>
      <p className="mb-6 text-orange-900">Sorry, the page you are looking for does not exist.</p>
      <a href="/" className="px-4 py-2 bg-orange-800 text-white rounded hover:bg-gray-700">Go Home</a>
    </div>
  );
}