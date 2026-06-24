"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLanguage } from "@/app/context/LanguageContext";
import { DEFAULT_SHOP_NAME } from "@/app/utils/shopHelpers";

export default function About() {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-sky-50 via-white to-sky-50">
      <Navbar />
      <main className="container mx-auto flex-1 px-4 py-12">
        <div className="mx-auto max-w-2xl rounded-2xl border border-sky-100 bg-white p-8 shadow-lg">
          <h1 className="text-3xl font-extrabold text-slate-800">{t("about.title", { shop: DEFAULT_SHOP_NAME })}</h1>
          <div className="mt-6 space-y-4 text-slate-600">
            <p>{t("about.p1")}</p>
            <p>{t("about.p2")}</p>
            <p>{t("about.p3")}</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
