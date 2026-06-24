"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Package, ShoppingCart, Users, Wallet } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { useLanguage } from "@/app/context/LanguageContext";
import { DEFAULT_SHOP_NAME } from "@/app/utils/shopHelpers";

export default function Hero() {
  const { isAuthenticated, user } = useAuth();
  const { t } = useLanguage();
  const shopName = user?.shopName || DEFAULT_SHOP_NAME;

  const features = [
    { icon: Package, titleKey: "hero.featureStock", descKey: "hero.featureStockDesc" },
    { icon: BookOpen, titleKey: "hero.featureUdhaar", descKey: "hero.featureUdhaarDesc" },
    { icon: Users, titleKey: "hero.featureCustomers", descKey: "hero.featureCustomersDesc" },
    { icon: Wallet, titleKey: "hero.featureWasool", descKey: "hero.featureWasoolDesc" },
  ];

  return (
    <section className="container mx-auto px-4 py-12 md:py-16">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="inline-block rounded-full bg-sky-100 px-4 py-1.5 text-sm font-semibold text-sky-700">
            {t("hero.badge")}
          </span>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight text-slate-900 md:text-5xl">
            {t("hero.welcome")}{" "}
            <span className="bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">{shopName}</span>
          </h1>
          <p className="mt-4 text-lg text-slate-600">{t("hero.desc")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="btn-primary inline-flex items-center gap-2">
                  <ShoppingCart size={18} /> {t("hero.openDashboard")}
                </Link>
                <Link href="/sales" className="btn-secondary">{t("nav.newSale")}</Link>
              </>
            ) : (
              <>
                <Link href="/register" className="btn-primary">{t("hero.getStarted")}</Link>
                <Link href="/login" className="btn-secondary">{t("nav.login")}</Link>
              </>
            )}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {features.map(({ icon: Icon, titleKey, descKey }) => (
            <div key={titleKey} className="card">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100 text-sky-600"><Icon size={20} /></span>
              <h3 className="mt-3 font-bold text-slate-800">{t(titleKey)}</h3>
              <p className="mt-1 text-sm text-slate-600">{t(descKey)}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
