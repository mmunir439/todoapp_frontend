"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import PaymentModal from "@/app/components/PaymentModal";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import Alert from "@/app/components/Alert";
import { useLanguage } from "@/app/context/LanguageContext";
import { customersApi, salesApi, getErrorMessage } from "@/app/utils/api";
import { formatCurrency } from "@/app/utils/shopHelpers";

function UdhaarContent() {
  const searchParams = useSearchParams();
  const initialCustomer = searchParams.get("customer") || "";
  const { t, txTypeLabel, formatDateLocalized } = useLanguage();

  const [debtors, setDebtors] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(initialCustomer);
  const [search, setSearch] = useState("");
  const [totalUdhar, setTotalUdhar] = useState(0);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [payCustomer, setPayCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  const loadDebtors = useCallback(async () => {
    const params = { hasBalance: true };
    if (search.trim()) params.q = search.trim();
    const list = await customersApi.list(params);
    setDebtors(list);
    setTotalUdhar(list.reduce((s, c) => s + (c.balance || 0), 0));
    return list;
  }, [search]);

  const loadTransactions = useCallback(async (customerId) => {
    if (customerId) setTransactions(await customersApi.getTransactions(customerId));
    else setTransactions(await salesApi.list());
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      await loadDebtors();
      await loadTransactions(selectedCustomer);
    } catch (err) {
      setAlert({ type: "error", message: getErrorMessage(err) });
    } finally {
      setLoading(false);
    }
  }, [loadDebtors, loadTransactions, selectedCustomer]);

  useEffect(() => {
    const timer = setTimeout(load, 300);
    return () => clearTimeout(timer);
  }, [load]);

  useEffect(() => {
    if (initialCustomer) setSelectedCustomer(initialCustomer);
  }, [initialCustomer]);

  const handlePayment = async (data) => {
    setSubmitting(true);
    try {
      await salesApi.payment({ customerId: data.customerId, amount: data.amount, note: data.notes || "" });
      setAlert({ type: "success", message: t("udhaar.paymentRecorded") });
      setPaymentOpen(false);
      setPayCustomer(null);
      await load();
    } catch (err) {
      setAlert({ type: "error", message: getErrorMessage(err) });
    } finally {
      setSubmitting(false);
    }
  };

  const selected = debtors.find((c) => c._id === selectedCustomer) ||
    (selectedCustomer ? { _id: selectedCustomer, name: transactions[0]?.customerName || t("nav.customers"), balance: 0 } : null);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-sky-50 via-white to-sky-50">
      <Navbar />
      <main className="container mx-auto flex-1 px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-slate-800">{t("udhaar.title")}</h1>
          <p className="text-slate-600">{t("udhaar.subtitle")}</p>
        </div>
        <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: "", message: "" })} />
        <div className="mb-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 p-6 text-white shadow-md">
          <p className="text-sm text-white/85">{t("udhaar.totalPending")}</p>
          <p className="text-4xl font-bold">{formatCurrency(totalUdhar)}</p>
          <p className="text-sm text-white/80">{debtors.length} {t("udhaar.customersWithBalance")}</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <section className="card lg:col-span-1">
            <h2 className="mb-3 font-bold text-slate-800">{t("udhaar.udhaarWale")}</h2>
            <div className="relative mb-3">
              <Search size={14} className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("common.search")} className="input-field py-2 ps-8 text-sm" />
            </div>
            <ul className="max-h-80 space-y-2 overflow-y-auto">
              <li>
                <button type="button" onClick={() => setSelectedCustomer("")} className={`w-full rounded-lg px-3 py-2 text-start text-sm font-medium ${!selectedCustomer ? "bg-sky-100 text-sky-800" : "hover:bg-sky-50"}`}>
                  {t("udhaar.allRecords")}
                </button>
              </li>
              {debtors.map((c) => (
                <li key={c._id}>
                  <button type="button" onClick={() => setSelectedCustomer(c._id)} className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-start text-sm ${selectedCustomer === c._id ? "bg-sky-100" : "hover:bg-sky-50"}`}>
                    <span className="font-medium">{c.name}</span>
                    <span className="font-bold text-amber-700">{formatCurrency(c.balance)}</span>
                  </button>
                </li>
              ))}
              {!loading && debtors.length === 0 && <p className="py-4 text-center text-sm text-slate-500">{t("udhaar.allClear")}</p>}
            </ul>
          </section>
          <section className="card lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bold text-slate-800">
                {selectedCustomer && selected ? t("udhaar.customerKhata", { name: selected.name }) : t("udhaar.allTransactions")}
              </h2>
              {selectedCustomer && selected?.balance > 0 && (
                <button type="button" onClick={() => { setPayCustomer(selected); setPaymentOpen(true); }} className="btn-primary py-2 text-sm">{t("udhaar.recordWasool")}</button>
              )}
            </div>
            {loading ? (
              <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600" /></div>
            ) : transactions.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-500">{t("udhaar.noEntries")}</p>
            ) : (
              <div className="max-h-[32rem] space-y-3 overflow-y-auto">
                {transactions.map((tx) => (
                  <div key={tx._id} className={`rounded-xl border p-4 ${tx.type === "payment" ? "border-emerald-100 bg-emerald-50/50" : tx.type === "credit_sale" ? "border-amber-100 bg-amber-50/50" : "border-sky-100 bg-sky-50/30"}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-bold uppercase ${tx.type === "payment" ? "bg-emerald-200 text-emerald-800" : tx.type === "credit_sale" ? "bg-amber-200 text-amber-800" : "bg-sky-200 text-sky-800"}`}>
                            {txTypeLabel(tx.type)}
                          </span>
                          <span className="text-sm text-slate-500">{formatDateLocalized(tx.createdAt)}</span>
                        </div>
                        <p className="mt-1 font-semibold text-slate-800">{tx.customerName || t("common.walkIn")}</p>
                        {tx.items?.length > 0 && (
                          <ul className="mt-2 space-y-1 text-sm text-slate-600">
                            {tx.items.map((item, i) => (
                              <li key={i}>{item.name} × {item.qty} @ {formatCurrency(item.unitPrice)} = {formatCurrency(item.total)}</li>
                            ))}
                          </ul>
                        )}
                        {tx.note && <p className="mt-1 text-xs text-slate-500">{tx.note}</p>}
                      </div>
                      <p className={`text-lg font-bold ${tx.type === "payment" ? "text-emerald-700" : "text-slate-800"}`}>
                        {tx.type === "payment" ? `- ${formatCurrency(tx.paidAmount)}` : formatCurrency(tx.totalAmount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
      <PaymentModal open={paymentOpen} onClose={() => { setPaymentOpen(false); setPayCustomer(null); }} onSubmit={handlePayment} customer={payCustomer} balance={payCustomer?.balance || 0} loading={submitting} />
    </div>
  );
}

export default function UdhaarPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600" /></div>}>
        <UdhaarContent />
      </Suspense>
    </ProtectedRoute>
  );
}
