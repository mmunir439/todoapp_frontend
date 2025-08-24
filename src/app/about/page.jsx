"use client";
import React from "react";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 p-6">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
          About TodoApp
        </h1>
        <p className="text-lg text-gray-700 text-center mb-6">
          TodoApp is a modern task management application designed to help users
          organize their daily activities efficiently. Whether you're managing
          personal tasks or collaborating with a team, TodoApp provides the
          tools you need to stay productive and on track.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Features
            </h2>
            <ul className="list-disc list-inside text-gray-700">
              <li>Create, update, and delete tasks</li>
              <li>Set start and end dates for tasks</li>
              <li>Collaborate with team members</li>
              <li>Track progress and productivity</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Why Choose TodoApp?
            </h2>
            <p className="text-gray-700">
              TodoApp is built with simplicity and efficiency in mind. Our
              intuitive interface and powerful features make it easy for anyone
              to manage their tasks and achieve their goals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}