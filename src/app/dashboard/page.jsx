"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AlertTriangle, RefreshCw, ShoppingCart } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { useAuth } from "@/app/context/AuthContext";
import { useLanguage } from "@/app/context/LanguageContext";
import { reportsApi, getErrorMessage } from "@/app/utils/api";
import { formatCurrency, OWNER_NAME } from "@/app/utils/shopHelpers";

function DashboardContent() {
  const { user } = useAuth();
  const { t, categoryLabel, unitLabel, txTypeLabel, formatDateLocalized } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setData(await reportsApi.dashboard());
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading && !data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600" />
      </div>
    );
  }

  const summary = data?.shopSummary || {};
  const today = data?.today || {};

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-sky-50 via-white to-sky-50">
      <Navbar />
      <main className="container mx-auto flex-1 px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800">
              {t("dashboard.greeting", { name: user?.username || OWNER_NAME })}
            </h1>
            <p className="mt-1 text-slate-600">{t("dashboard.subtitle", { shop: user?.shopName || "" })}</p>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={load} className="btn-secondary flex items-center gap-2">
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> {t("common.refresh")}
            </button>
            <Link href="/sales" className="btn-primary flex items-center gap-2">
              <ShoppingCart size={18} /> {t("dashboard.newSale")}
            </Link>
          </div>
        </div>

        {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: t("dashboard.totalUdhaar"), value: formatCurrency(summary.totalUdharPending), color: "from-amber-500 to-orange-600" },
            { label: t("dashboard.products"), value: summary.totalProducts ?? 0, color: "from-sky-500 to-blue-600" },
            { label: t("dashboard.customers"), value: summary.totalCustomers ?? 0, color: "from-sky-400 to-sky-600" },
            { label: t("dashboard.udhaarWale"), value: summary.customersWithBalance ?? 0, color: "from-blue-500 to-indigo-600" },
          ].map((s) => (
            <div key={s.label} className={`rounded-xl bg-gradient-to-r ${s.color} p-5 text-white shadow-md`}>
              <p className="text-sm text-white/85">{s.label}</p>
              <p className="mt-1 text-2xl font-bold">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {[
            { label: t("dashboard.todayCash"), value: formatCurrency(today.cashSales) },
            { label: t("dashboard.todayCredit"), value: formatCurrency(today.creditSales) },
            { label: t("dashboard.todayWasool"), value: formatCurrency(today.paymentsReceived) },
          ].map((s) => (
            <div key={s.label} className="card border-sky-100">
              <p className="text-sm text-slate-500">{s.label}</p>
              <p className="mt-1 text-xl font-bold text-slate-800">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="card">
            <div className="mb-4 flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-500" />
              <h2 className="font-bold text-slate-800">{t("dashboard.lowStock")}</h2>
              <Link href="/products" className="ms-auto text-sm font-semibold text-sky-600 hover:underline">{t("common.manage")}</Link>
            </div>
            {!data?.lowStockProducts?.length ? (
              <p className="text-sm text-slate-500">{t("dashboard.stockOk")}</p>
            ) : (
              <ul className="space-y-2">
                {data.lowStockProducts.map((p) => (
                  <li key={p._id} className="flex justify-between rounded-lg bg-red-50 px-4 py-2 text-sm">
                    <span>{p.name} <span className="text-slate-400">({categoryLabel(p.category)})</span></span>
                    <span className="font-bold text-red-600">{p.stock} {unitLabel(p.unit)}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="card">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bold text-slate-800">{t("dashboard.recentActivity")}</h2>
              <Link href="/udhaar" className="text-sm font-semibold text-sky-600 hover:underline">{t("dashboard.viewKhata")}</Link>
            </div>
            {!data?.recentTransactions?.length ? (
              <p className="text-sm text-slate-500">{t("dashboard.noSales")}</p>
            ) : (
              <ul className="space-y-2">
                {data.recentTransactions.map((tx) => (
                  <li key={tx._id} className="flex items-center justify-between rounded-lg bg-sky-50 px-4 py-2 text-sm">
                    <div>
                      <p className="font-medium text-slate-800">{tx.customerName || t("common.walkIn")}</p>
                      <p className="text-xs text-slate-500">{txTypeLabel(tx.type)} · {formatDateLocalized(tx.createdAt)}</p>
                    </div>
                    <span className="font-bold text-slate-700">{formatCurrency(tx.totalAmount)}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function DashboardPage() {
  return <ProtectedRoute><DashboardContent /></ProtectedRoute>;
}
