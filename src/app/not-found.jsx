"use client";

import Link from "next/link";
import { useLanguage } from "@/app/context/LanguageContext";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-sky-100 to-blue-100 px-4 text-slate-800">
      <h1 className="text-7xl font-extrabold text-sky-700">404</h1>
      <h2 className="mt-2 text-2xl font-semibold">{t("notFound.title")}</h2>
      <p className="mt-2 text-slate-600">{t("notFound.desc")}</p>
      <Link href="/" className="btn-primary mt-8">{t("notFound.goHome")}</Link>
    </div>
  );
}
