"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, Phone, ShoppingCart, Plus } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import PaymentModal from "@/app/components/PaymentModal";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import Alert from "@/app/components/Alert";
import { useLanguage } from "@/app/context/LanguageContext";
import { customersApi, reportsApi, salesApi, getErrorMessage } from "@/app/utils/api";
import { formatCurrency } from "@/app/utils/shopHelpers";

const TYPE_FILTERS = ["all", "credit_sale", "payment"];

function addRunningBalances(transactions, currentBalance) {
  const sorted = [...transactions].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  let balance = currentBalance;
  return sorted.map((tx) => {
    const entry = { ...tx, runningBalance: balance };
    if (tx.type === "credit_sale") balance -= tx.totalAmount;
    else if (tx.type === "payment") balance += tx.paidAmount;
    return entry;
  });
}

function UdhaarContent() {
  const searchParams = useSearchParams();
  const initialCustomer = searchParams.get("customer") || "";
  const { t, txTypeLabel, formatDateLocalized } = useLanguage();

  const [debtors, setDebtors] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(initialCustomer);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [todayOnly, setTodayOnly] = useState(false);
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
    return list;
  }, [search]);

  const loadSummary = useCallback(async () => {
    try {
      const data = await reportsApi.dashboard();
      setTotalUdhar(data?.shopSummary?.totalUdharPending ?? 0);
    } catch {
      const list = await customersApi.list({ hasBalance: true });
      setTotalUdhar(list.reduce((s, c) => s + (c.balance || 0), 0));
    }
  }, []);

  const loadTransactions = useCallback(
    async (customerId) => {
      const params = {};
      if (typeFilter !== "all") params.type = typeFilter;
      if (todayOnly) params.date = "today";

      if (customerId) {
        let txs = await customersApi.getTransactions(customerId);
        if (typeFilter !== "all") txs = txs.filter((tx) => tx.type === typeFilter);
        if (todayOnly) {
          const today = new Date().toDateString();
          txs = txs.filter((tx) => new Date(tx.createdAt).toDateString() === today);
        }
        setTransactions(txs);
      } else {
        const txs = await salesApi.list(params);
        const udhaarTxs =
          typeFilter === "all"
            ? txs.filter((tx) => tx.type === "credit_sale" || tx.type === "payment")
            : txs;
        setTransactions(
          udhaarTxs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        );
      }
    },
    [typeFilter, todayOnly]
  );

  const loadCustomerDetails = useCallback(async (customerId) => {
    if (!customerId) {
      setCustomerDetails(null);
      return;
    }
    try {
      setCustomerDetails(await customersApi.getOne(customerId));
    } catch (err) {
      setCustomerDetails(null);
      setAlert({ type: "error", message: getErrorMessage(err) });
    }
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([loadDebtors(), loadSummary(), loadTransactions(selectedCustomer)]);
      if (selectedCustomer) await loadCustomerDetails(selectedCustomer);
    } catch (err) {
      setAlert({ type: "error", message: getErrorMessage(err) });
    } finally {
      setLoading(false);
    }
  }, [loadDebtors, loadSummary, loadTransactions, loadCustomerDetails, selectedCustomer]);

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
      await salesApi.payment({
        customerId: data.customerId,
        amount: data.amount,
        note: data.notes || "",
      });
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

  const activeCustomer =
    customerDetails ||
    debtors.find((c) => c._id === selectedCustomer) ||
    (selectedCustomer
      ? {
          _id: selectedCustomer,
          name: transactions[0]?.customerName || t("nav.customers"),
          balance: 0,
        }
      : null);

  const displayTransactions = useMemo(() => {
    if (!selectedCustomer || !activeCustomer) return transactions;
    return addRunningBalances(transactions, activeCustomer.balance || 0);
  }, [transactions, selectedCustomer, activeCustomer]);

  const customerSummary = useMemo(() => {
    if (!selectedCustomer) return null;
    const creditTotal = transactions
      .filter((tx) => tx.type === "credit_sale")
      .reduce((s, tx) => s + (tx.totalAmount || 0), 0);
    const paidTotal = transactions
      .filter((tx) => tx.type === "payment")
      .reduce((s, tx) => s + (tx.paidAmount || 0), 0);
    return { creditTotal, paidTotal, balance: activeCustomer?.balance || 0 };
  }, [selectedCustomer, transactions, activeCustomer]);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-sky-50 via-white to-sky-50">
      <Navbar />
      <main className="container mx-auto flex-1 px-4 py-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800">{t("udhaar.title")}</h1>
            <p className="text-slate-600">{t("udhaar.subtitle")}</p>
          </div>
          <Link
            href={selectedCustomer ? `/sales?type=credit&customer=${selectedCustomer}` : "/sales?type=credit"}
            className="btn-primary inline-flex items-center gap-2 self-start"
          >
            <Plus size={18} />
            {t("udhaar.newUdhaarSale")}
          </Link>
        </div>

        <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: "", message: "" })} />

        <div className="mb-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 p-6 text-white shadow-md">
          <p className="text-sm text-white/85">{t("udhaar.totalPending")}</p>
          <p className="text-4xl font-bold">{formatCurrency(totalUdhar)}</p>
          <p className="text-sm text-white/80">
            {debtors.length} {t("udhaar.customersWithBalance")}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="card lg:col-span-1">
            <h2 className="mb-3 font-bold text-slate-800">{t("udhaar.udhaarWale")}</h2>
            <div className="relative mb-3">
              <Search size={14} className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("common.search")}
                className="input-field py-2 ps-8 text-sm"
              />
            </div>
            <ul className="max-h-80 space-y-2 overflow-y-auto">
              <li>
                <button
                  type="button"
                  onClick={() => setSelectedCustomer("")}
                  className={`w-full rounded-lg px-3 py-2 text-start text-sm font-medium ${!selectedCustomer ? "bg-sky-100 text-sky-800" : "hover:bg-sky-50"}`}
                >
                  {t("udhaar.allRecords")}
                </button>
              </li>
              {debtors.map((c) => (
                <li key={c._id}>
                  <button
                    type="button"
                    onClick={() => setSelectedCustomer(c._id)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-start text-sm ${selectedCustomer === c._id ? "bg-sky-100" : "hover:bg-sky-50"}`}
                  >
                    <span className="font-medium">{c.name}</span>
                    <span className="font-bold text-amber-700">{formatCurrency(c.balance)}</span>
                  </button>
                </li>
              ))}
              {!loading && debtors.length === 0 && (
                <p className="py-4 text-center text-sm text-slate-500">{t("udhaar.allClear")}</p>
              )}
            </ul>
          </section>

          <section className="card lg:col-span-2">
            {selectedCustomer && activeCustomer && (
              <div className="mb-4 rounded-xl border border-amber-100 bg-amber-50/60 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">{activeCustomer.name}</h2>
                    {activeCustomer.phone && (
                      <p className="mt-1 flex items-center gap-1 text-sm text-slate-600">
                        <Phone size={14} />
                        {activeCustomer.phone}
                      </p>
                    )}
                    {activeCustomer.address && (
                      <p className="mt-0.5 text-xs text-slate-500">{activeCustomer.address}</p>
                    )}
                  </div>
                  <div className="text-end">
                    <p className="text-xs font-medium text-slate-500">{t("udhaar.currentBalance")}</p>
                    <p className="text-2xl font-bold text-amber-700">
                      {formatCurrency(activeCustomer.balance || 0)}
                    </p>
                  </div>
                </div>
                {customerSummary && (
                  <div className="mt-3 grid grid-cols-3 gap-2 border-t border-amber-100 pt-3 text-center text-sm">
                    <div>
                      <p className="text-slate-500">{t("udhaar.totalCredit")}</p>
                      <p className="font-bold text-amber-800">{formatCurrency(customerSummary.creditTotal)}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">{t("udhaar.totalPaid")}</p>
                      <p className="font-bold text-emerald-700">{formatCurrency(customerSummary.paidTotal)}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">{t("udhaar.remaining")}</p>
                      <p className="font-bold text-slate-800">{formatCurrency(customerSummary.balance)}</p>
                    </div>
                  </div>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  {(activeCustomer.balance || 0) > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setPayCustomer(activeCustomer);
                        setPaymentOpen(true);
                      }}
                      className="btn-primary py-2 text-sm"
                    >
                      {t("udhaar.recordWasool")}
                    </button>
                  )}
                  <Link
                    href={`/sales?type=credit&customer=${activeCustomer._id}`}
                    className="btn-secondary inline-flex items-center gap-1 py-2 text-sm"
                  >
                    <ShoppingCart size={14} />
                    {t("udhaar.addUdhaarSale")}
                  </Link>
                </div>
              </div>
            )}

            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-bold text-slate-800">
                {selectedCustomer && activeCustomer
                  ? t("udhaar.customerKhata", { name: activeCustomer.name })
                  : t("udhaar.allTransactions")}
              </h2>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex rounded-lg border border-sky-200 bg-white p-0.5 text-xs">
                  {TYPE_FILTERS.map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setTypeFilter(key)}
                      className={`rounded-md px-2.5 py-1.5 font-medium transition ${typeFilter === key ? "bg-sky-100 text-sky-800" : "text-slate-600 hover:bg-sky-50"}`}
                    >
                      {t(`udhaar.filter.${key}`)}
                    </button>
                  ))}
                </div>
                <label className="flex cursor-pointer items-center gap-1.5 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={todayOnly}
                    onChange={(e) => setTodayOnly(e.target.checked)}
                    className="rounded border-sky-300 text-sky-600"
                  />
                  {t("udhaar.todayOnly")}
                </label>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600" />
              </div>
            ) : displayTransactions.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-500">{t("udhaar.noEntries")}</p>
            ) : (
              <div className="max-h-[32rem] space-y-3 overflow-y-auto">
                {displayTransactions.map((tx) => (
                  <div
                    key={tx._id}
                    className={`rounded-xl border p-4 ${
                      tx.type === "payment"
                        ? "border-emerald-100 bg-emerald-50/50"
                        : tx.type === "credit_sale"
                          ? "border-amber-100 bg-amber-50/50"
                          : "border-sky-100 bg-sky-50/30"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-bold uppercase ${
                              tx.type === "payment"
                                ? "bg-emerald-200 text-emerald-800"
                                : tx.type === "credit_sale"
                                  ? "bg-amber-200 text-amber-800"
                                  : "bg-sky-200 text-sky-800"
                            }`}
                          >
                            {txTypeLabel(tx.type)}
                          </span>
                          <span className="text-sm text-slate-500">
                            {formatDateLocalized(tx.createdAt)}
                          </span>
                        </div>
                        {!selectedCustomer && (
                          <p className="mt-1 font-semibold text-slate-800">
                            {tx.customerName || t("common.walkIn")}
                          </p>
                        )}
                        {tx.items?.length > 0 && (
                          <ul className="mt-2 space-y-1 text-sm text-slate-600">
                            {tx.items.map((item, i) => (
                              <li key={i}>
                                {item.name} × {item.qty} @ {formatCurrency(item.unitPrice)} ={" "}
                                {formatCurrency(item.total)}
                              </li>
                            ))}
                          </ul>
                        )}
                        {tx.note && <p className="mt-1 text-xs text-slate-500">{tx.note}</p>}
                      </div>
                      <div className="shrink-0 text-end">
                        <p
                          className={`text-lg font-bold ${
                            tx.type === "payment" ? "text-emerald-700" : "text-slate-800"
                          }`}
                        >
                          {tx.type === "payment"
                            ? `- ${formatCurrency(tx.paidAmount)}`
                            : `+ ${formatCurrency(tx.totalAmount)}`}
                        </p>
                        {selectedCustomer && tx.runningBalance != null && (
                          <p className="mt-1 text-xs text-slate-500">
                            {t("udhaar.balanceAfter")}: {formatCurrency(tx.runningBalance)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
      <PaymentModal
        open={paymentOpen}
        onClose={() => {
          setPaymentOpen(false);
          setPayCustomer(null);
        }}
        onSubmit={handlePayment}
        customer={payCustomer}
        balance={payCustomer?.balance || 0}
        loading={submitting}
      />
    </div>
  );
}

export default function UdhaarPage() {
  return (
    <ProtectedRoute>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600" />
          </div>
        }
      >
        <UdhaarContent />
      </Suspense>
    </ProtectedRoute>
  );
}
