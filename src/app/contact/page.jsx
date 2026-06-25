"use client";

import { FaPhone, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLanguage } from "@/app/context/LanguageContext";
import { DEFAULT_SHOP_NAME, OWNER_NAME } from "@/app/utils/shopHelpers";

export default function Contact() {
  const { t } = useLanguage();
  const items = [
    { icon: FaUser, label: `${t("contact.shopOwner")}: ${OWNER_NAME}` },
    { icon: FaPhone, label: "+92 448229529" },
    { icon: FaMapMarkerAlt, label: t("contact.localShop") },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-sky-50 via-white to-sky-50">
      <Navbar />
      <main className="container mx-auto flex-1 px-4 py-12">
        <div className="mx-auto max-w-lg rounded-2xl border border-sky-100 bg-white p-8 shadow-lg">
          <h1 className="text-center text-3xl font-extrabold text-slate-800">{t("contact.title")}</h1>
          <p className="mt-2 text-center text-slate-600">{DEFAULT_SHOP_NAME} Tanvir{t("contact.subtitle")}</p>
          <div className="mt-8 space-y-4">
            {items.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-4 rounded-xl bg-sky-50 p-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100 text-sky-600"><Icon size={18} /></span>
                <p className="font-medium text-slate-700">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
