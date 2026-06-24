"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Terms() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      body: "By accessing and using TaskFlow, you accept and agree to be bound by these terms. If you do not agree, please do not use this service.",
    },
    {
      title: "2. User Responsibilities",
      body: "You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.",
    },
    {
      title: "3. Prohibited Activities",
      body: "You agree not to use TaskFlow for any unlawful purpose or in a way that could damage, disable, or impair the application.",
    },
    {
      title: "4. Modifications to Terms",
      body: "We reserve the right to modify these terms at any time. Continued use of the app constitutes acceptance of any changes.",
    },
    {
      title: "5. Limitation of Liability",
      body: "TaskFlow shall not be liable for any damages arising from the use or inability to use the application.",
    },
    {
      title: "6. Governing Law",
      body: "These terms shall be governed in accordance with applicable local laws.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-sky-50 via-white to-sky-50">
      <Navbar />
      <main className="container mx-auto flex-1 px-4 py-12">
        <div className="mx-auto max-w-2xl rounded-2xl border border-sky-100 bg-white p-8 shadow-lg shadow-sky-100/50">
          <h1 className="text-3xl font-extrabold text-slate-800">Terms & Conditions</h1>
          <p className="mt-4 text-slate-600">
            Welcome to TaskFlow. By using our application, you agree to the following terms.
          </p>
          <div className="mt-8 space-y-6">
            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="text-lg font-semibold text-slate-800">{section.title}</h2>
                <p className="mt-2 text-slate-600">{section.body}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
