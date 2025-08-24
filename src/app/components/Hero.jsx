"use client";
import axios from "@/app/utils/axios";
import React, { useState, useEffect } from "react";

export default function Alltask() {
  const initialTasks = [
    {
      tasktitle: "Complete Backend",
      taskdescription: "Finish the backend for the Todo app",
      startdate: "2025-08-22T09:00:00.000Z",
      enddate: "2025-08-25T18:00:00.000Z",
      userId: "68aac0c3fa6fec8ec0bd0e52",
      _id: "68aaf4fed6989d9a3b0a727e",
    },
    {
      tasktitle: "Design Frontend",
      taskdescription: "Create a responsive UI for the Todo app",
      startdate: "2025-08-20T09:00:00.000Z",
      enddate: "2025-08-23T18:00:00.000Z",
      userId: "68aac0c3fa6fec8ec0bd0e52",
      _id: "68aaf4fed6989d9a3b0a727f",
    },
    {
      tasktitle: "Setup Database",
      taskdescription: "Configure MongoDB for the Todo app",
      startdate: "2025-08-18T09:00:00.000Z",
      enddate: "2025-08-21T18:00:00.000Z",
      userId: "68aac0c3fa6fec8ec0bd0e52",
      _id: "68aaf4fed6989d9a3b0a7280",
    },
    {
      tasktitle: "Write Documentation",
      taskdescription: "Document the API endpoints",
      startdate: "2025-08-15T09:00:00.000Z",
      enddate: "2025-08-18T18:00:00.000Z",
      userId: "68aac0c3fa6fec8ec0bd0e52",
      _id: "68aaf4fed6989d9a3b0a7281",
    },
  ];

  const [tasks, setTasks] = useState(initialTasks);

  async function fetchData() {
    try {
      const response = await axios.get("/task/getallTasks");
      setTasks((prevTasks) => [...prevTasks, ...response.data]);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-100 via-red-200 to-white p-6">
      <h1 className="text-4xl font-extrabold text-center text-orange-800 mb-6 animate-bounce">
        All Tasks
      </h1>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-orange-300"
          >
            <h2 className="text-2xl font-bold text-red-700 mb-2">
              {task.tasktitle}
            </h2>
            <p className="text-gray-600 mb-1">
              <strong>Description:</strong> {task.taskdescription}
            </p>
            <p className="text-gray-600 mb-1">
              <strong>Start Date:</strong>{" "}
              {new Date(task.startdate).toLocaleDateString()}
            </p>
            <p className="text-gray-600">
              <strong>End Date:</strong>{" "}
              {new Date(task.enddate).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}