"use client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import React from "react";

export default function Terms() {
  return (
    <div>
        <Navbar />
    <div className="min-h-screen bg-gradient-to-r from-orange-100 via-red-200 to-white p-6">
      <div className="container mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-extrabold text-center text-orange-800 mb-6 animate-bounce">
          Terms and Conditions
        </h1>
        <p className="text-gray-700 mb-4">
          Welcome to our Todo App! By using our application, you agree to the
          following terms and conditions. Please read them carefully.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">
          1. Acceptance of Terms
        </h2>
        <p className="text-gray-700 mb-4">
          By accessing and using our Todo App, you accept and agree to be bound
          by the terms and provisions of this agreement. If you do not agree to
          abide by the above, please do not use this service.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">
          2. User Responsibilities
        </h2>
        <p className="text-gray-700 mb-4">
          You are responsible for maintaining the confidentiality of your account
          and password and for restricting access to your computer. You agree to
          accept responsibility for all activities that occur under your account
          or password.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">
          3. Prohibited Activities
        </h2>
        <p className="text-gray-700 mb-4">
          You agree not to use the Todo App for any unlawful or prohibited
          purpose. You may not use the app in a way that could damage, disable,
          overburden, or impair the application or interfere with any other
          party's use and enjoyment of the app.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">
          4. Modifications to Terms
        </h2>
        <p className="text-gray-700 mb-4">
          We reserve the right to modify these terms at any time. It is your
          responsibility to review these terms periodically for changes. Your
          continued use of the app following the posting of changes will mean
          that you accept and agree to the changes.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">
          5. Limitation of Liability
        </h2>
        <p className="text-gray-700 mb-4">
          In no event shall the Todo App or its developers be liable for any
          damages arising out of the use or inability to use the app. This
          includes, but is not limited to, damages for loss of data or profit,
          or due to business interruption.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">
          6. Governing Law
        </h2>
        <p className="text-gray-700 mb-4">
          These terms shall be governed in accordance with the laws of your
          jurisdiction, without regard to its conflict of law provisions.
        </p>

        <p className="text-gray-700 mt-6">
          If you have any questions about these Terms and Conditions, please
          contact us.
        </p>
      </div>
    </div>
    <Footer />
    </div>
  );
}
