"use client";
import axios from "@/app/utils/axios";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
      tasktitle: "Complete Backend",
      taskdescription: "Finish the backend for the Todo app",
      startdate: "2025-08-22T09:00:00.000Z",
      enddate: "2025-08-25T18:00:00.000Z",
      userId: "68aac0c3fa6fec8ec0bd0e52",
      _id: "68aaf4fed6989d9a3b0a727e",
    },
    {
      tasktitle: "Complete Frontend",
      taskdescription: "Finish the frontend for the Todo app",
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
  const [current, setCurrent] = useState(0);
  const images = ["/images/unsplash3.avif", "/images/unsplash4.avif", "/images/unsplashtodo1.avif", "/images/unsplashtodo2.avif"];

  async function fetchData() {
    try {
      const response = await axios.get("/task/getallTasks");
      const apiTasks = response.data.filter(
        (apiTask) => !initialTasks.some((hardTask) => hardTask._id === apiTask._id)
      );
      setTasks([...initialTasks, ...apiTasks]);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  // Carousel controls
  const prevSlide = () => setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const nextSlide = () => setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  return (
    <div className="min-h-screen p-6">
      {/* Custom Carousel */}
      <div className="relative w-full max-w-5xl mx-auto overflow-hidden rounded-2xl shadow-lg mb-12">
        <motion.img
          key={current}
          src={images[current]}
          alt={`Slide ${current + 1}`}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full h-[400px] object-cover"
        />
        {/* Buttons */}
        <motion.button
          onClick={prevSlide}
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-gray-900/50 text-white p-2 rounded-full hover:bg-gray-900"
          whileHover={{ scale: 1.2 }}
        >
          <ChevronLeft size={24} />
        </motion.button>
        <motion.button
          onClick={nextSlide}
          className="absolute top-1/2 right-4 -translate-y-1/2 bg-gray-900/50 text-white p-2 rounded-full hover:bg-gray-900"
          whileHover={{ scale: 1.2 }}
        >
          <ChevronRight size={24} />
        </motion.button>
        {/* Dots */}
        <motion.div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-3 h-3 rounded-full ${current === i ? "bg-white" : "bg-gray-400"}`}
            />
          ))}
        </motion.div>
      </div>

      {/* Tasks Section */}
      <h1 className="text-4xl font-extrabold text-center text-yellow-800 mb-10 tracking-tight">
        All Tasks
      </h1>

      <motion.div
        className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              staggerChildren: 0.2,
            },
          },
        }}
      >
        {tasks.map((task) => (
          <motion.div
            key={task._id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-orange-300 text-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-orange-900"
          >
            <h2 className="text-xl font-semibold mb-3">{task.tasktitle}</h2>
            <p className=" mb-2">
              <span className="font-medium">Description:</span> {task.taskdescription}
            </p>
            <p className=" mb-2">
              <span className="font-medium">Start:</span> {new Date(task.startdate).toLocaleDateString()}
            </p>
            <p className="">
              <span className="font-medium">End:</span> {new Date(task.enddate).toLocaleDateString()}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
