"use client";
import axios from "./utils/axios";
import React, { useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "@/app/components/Hero";
import Footer from "./components/Footer";
export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Footer />
    </>
  );
}
