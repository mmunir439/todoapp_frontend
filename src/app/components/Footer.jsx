"use client";

import Link from "next/link";
import { useLanguage } from "@/app/context/LanguageContext";
import { OWNER_NAME } from "@/app/utils/shopHelpers";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="mt-auto border-t border-sky-200 bg-gradient-to-r from-sky-800 to-blue-800 text-white">
      <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-4 py-6 md:flex-row">
        <div className="text-center md:text-start">
          <p className="font-semibold">Tanvir Shop Manager</p>
          <p className="text-sm text-sky-200">
            {t("footer.owner")}: {OWNER_NAME} Tanvir{t("footer.connected")}
          </p>
        </div>
        <nav className="flex gap-4 text-sm text-sky-200">
          <Link href="/about" className="hover:text-white hover:underline">{t("nav.about")}</Link>
          <Link href="/contact" className="hover:text-white hover:underline">{t("nav.contact")}</Link>
        </nav>
      </div>
    </footer>
  );
}
