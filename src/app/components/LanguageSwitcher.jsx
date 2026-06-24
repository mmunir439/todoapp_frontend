"use client";

import { useLanguage } from "@/app/context/LanguageContext";

export default function LanguageSwitcher({ className = "" }) {
  const { locale, setLocale, t } = useLanguage();

  return (
    <div
      className={`flex items-center rounded-lg border border-white/20 bg-white/10 p-0.5 text-xs font-semibold ${className}`}
      role="group"
      aria-label={t("common.language")}
    >
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={`rounded-md px-2.5 py-1.5 transition ${
          locale === "en" ? "bg-white text-sky-700 shadow-sm" : "text-sky-100 hover:text-white"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLocale("ur")}
        className={`rounded-md px-2.5 py-1.5 transition ${
          locale === "ur" ? "bg-white text-sky-700 shadow-sm" : "text-sky-100 hover:text-white"
        }`}
      >
        اردو
      </button>
    </div>
  );
}
