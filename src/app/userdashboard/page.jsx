"use client";
import React, { useState, useEffect } from "react";
import axios from "@/app/utils/axios";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [userdata, setUserdata] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateTaskId, setUpdateTaskId] = useState(null);
  const [updateFormData, setUpdateFormData] = useState({
    tasktitle: "",
    taskdescription: "",
    startdate: "",
    enddate: "",
  });
  const [deleteTaskId, setDeleteTaskId] = useState(null);

  async function fetchTasks() {
    try {
      const response = await axios.get("/task/getmytask");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }

  async function fetchData() {
    try {
      const response = await axios.get("/user/getuser");
      setUserdata(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function deleteTask() {
    setIsDeleting(true);
    try {
      await axios.delete(`/task/deleteTask/${deleteTaskId}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== deleteTaskId));
      setDeleteTaskId(null);
    } catch (error) {
      console.error("Error deleting task:", error);
    } finally {
      setIsDeleting(false);
    }
  }

  async function updateTask(e) {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const response = await axios.put(
        `/task/updateTask/${updateTaskId}`,
        updateFormData
      );
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === updateTaskId ? response.data : task))
      );
      setUpdateTaskId(null);
      setUpdateFormData({ tasktitle: "", taskdescription: "", startdate: "", enddate: "" });
    } catch (error) {
      console.error("Error updating task:", error);
    } finally {
      setIsUpdating(false);
    }
  }

  function openUpdateModal(task) {
    setUpdateTaskId(task._id);
    setUpdateFormData({
      tasktitle: task.tasktitle,
      taskdescription: task.taskdescription,
      startdate: task.startdate,
      enddate: task.enddate,
    });
  }

  function openDeleteModal(taskId) {
    setDeleteTaskId(taskId);
  }

  useEffect(() => {
    fetchData();
    fetchTasks();
  }, []);

  return (
    <div>
      <Navbar />
    <div className="min-h-screen bg-gradient-to-r from-orange-100 via-red-200 to-white p-6">
      <h1 className="text-4xl font-extrabold text-center text-orange-800 mb-6 animate-bounce">
        User Dashboard
      </h1>

      <div className="container mx-auto mb-8">
        {userdata && userdata.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userdata.map((value, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-orange-300"
              >
                <h2 className="text-2xl font-bold text-red-700 mb-2">
                  {value.username}
                </h2>
                <p className="text-gray-600 mb-1">
                  <strong>Email:</strong> {value.email}
                </p>
                <p className="text-gray-600">
                  <strong>CNIC:</strong> {value.cnic}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No user data available.</p>
        )}
      </div>

      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-orange-800 mb-4">Tasks</h2>
        {tasks && tasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-orange-300"
              >
                <h3 className="text-2xl font-bold text-red-700 mb-2">
                  {task.tasktitle}
                </h3>
                <p className="text-gray-600 mb-1">
                  <strong>Description:</strong> {task.taskdescription}
                </p>
                <p className="text-gray-600 mb-1">
                  <strong>Start Date:</strong> {new Date(task.startdate).toLocaleDateString()}
                </p>
                <p className="text-gray-600 mb-1">
                  <strong>End Date:</strong> {new Date(task.enddate).toLocaleDateString()}
                </p>
                <div className="flex space-x-4 mt-4">
                  <button
                    className="flex items-center space-x-1 text-blue-500 hover:text-blue-700"
                    onClick={() => openUpdateModal(task)}
                  >
                    <FaEdit />
                    <span>
                      {isUpdating && updateTaskId === task._id
                        ? "Updating..."
                        : "Update"}
                    </span>
                  </button>
                  <button
                    className="flex items-center space-x-1 text-red-500 hover:text-red-700"
                    onClick={() => openDeleteModal(task._id)}
                  >
                    <FaTrashAlt />
                    <span>{isDeleting && deleteTaskId === task._id ? "Deleting..." : "Delete"}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No tasks available.</p>
        )}
      </div>

      {updateTaskId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <form
            onSubmit={updateTask}
            className="bg-white p-4 rounded-lg shadow-lg w-full max-w-sm"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">Update Task</h2>
            <label htmlFor="tasktitle" className="block mb-2 font-semibold text-gray-700">
              Task Title
            </label>
            <input
              type="text"
              name="tasktitle"
              value={updateFormData.tasktitle}
              onChange={(e) =>
                setUpdateFormData({ ...updateFormData, tasktitle: e.target.value })
              }
              className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="taskdescription" className="block mb-2 font-semibold text-gray-700">
              Task Description
            </label>
            <textarea
              name="taskdescription"
              value={updateFormData.taskdescription}
              onChange={(e) =>
                setUpdateFormData({ ...updateFormData, taskdescription: e.target.value })
              }
              className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
            <label htmlFor="startdate" className="block mb-2 font-semibold text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              name="startdate"
              value={updateFormData.startdate}
              onChange={(e) =>
                setUpdateFormData({ ...updateFormData, startdate: e.target.value })
              }
              className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="enddate" className="block mb-2 font-semibold text-gray-700">
              End Date
            </label>
            <input
              type="date"
              name="enddate"
              value={updateFormData.enddate}
              onChange={(e) =>
                setUpdateFormData({ ...updateFormData, enddate: e.target.value })
              }
              className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end space-x-4">
              <button
                className="p-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-all duration-300 font-bold"
                onClick={() => setUpdateTaskId(null)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 font-bold"
              >
                Update Task
              </button>
            </div>
          </form>
        </div>
      )}

      {deleteTaskId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Confirm Deletion</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this task?</p>
            <div className="flex justify-end space-x-4">
              <button
                className="p-4 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-all duration-300 font-bold"
                onClick={() => setDeleteTaskId(null)}
              >
                Cancel
              </button>
              <button
                className="p-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 font-bold"
                onClick={deleteTask}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    <Footer/>
    </div>
  );
}