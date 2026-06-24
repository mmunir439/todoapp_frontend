"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Pencil, Trash2, Phone, BookOpen } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import CustomerModal from "@/app/components/CustomerModal";
import PaymentModal from "@/app/components/PaymentModal";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import Alert from "@/app/components/Alert";
import { useLanguage } from "@/app/context/LanguageContext";
import { customersApi, salesApi, getErrorMessage } from "@/app/utils/api";
import { formatCurrency, getId } from "@/app/utils/shopHelpers";

function CustomersContent() {
  const { t } = useLanguage();
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [payCustomer, setPayCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.q = search.trim();
      setCustomers(await customersApi.list(params));
    } catch (err) {
      setAlert({ type: "error", message: getErrorMessage(err) });
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(load, 300);
    return () => clearTimeout(timer);
  }, [load]);

  const handleSave = async (data) => {
    setSubmitting(true);
    try {
      if (editing) {
        await customersApi.update(getId(editing), data);
        setAlert({ type: "success", message: t("customers.updated") });
      } else {
        await customersApi.create(data);
        setAlert({ type: "success", message: t("customers.added") });
      }
      setModalOpen(false);
      setEditing(null);
      await load();
    } catch (err) {
      setAlert({ type: "error", message: getErrorMessage(err) });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePayment = async (data) => {
    setSubmitting(true);
    try {
      await salesApi.payment({ customerId: data.customerId, amount: data.amount, note: data.notes || "" });
      setAlert({ type: "success", message: t("customers.wasoolRecorded") });
      setPaymentOpen(false);
      setPayCustomer(null);
      await load();
    } catch (err) {
      setAlert({ type: "error", message: getErrorMessage(err) });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (c) => {
    if (!window.confirm(t("customers.deleteConfirm", { name: c.name }))) return;
    try {
      await customersApi.remove(getId(c));
      setAlert({ type: "success", message: t("customers.deleted") });
      await load();
    } catch (err) {
      setAlert({ type: "error", message: getErrorMessage(err) });
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-sky-50 via-white to-sky-50">
      <Navbar />
      <main className="container mx-auto flex-1 px-4 py-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800">{t("customers.title")}</h1>
            <p className="text-slate-600">{t("customers.subtitle")}</p>
          </div>
          <button type="button" onClick={() => { setEditing(null); setModalOpen(true); }} className="btn-primary inline-flex items-center gap-2 self-start">
            <Plus size={18} /> {t("customers.addCustomer")}
          </button>
        </div>
        <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: "", message: "" })} />
        <div className="relative mb-6">
          <Search size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("customers.searchPlaceholder")} className="input-field ps-9" />
        </div>
        {loading ? (
          <div className="flex justify-center py-20"><div className="h-10 w-10 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600" /></div>
        ) : customers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-sky-200 py-16 text-center">
            <p className="font-semibold text-slate-700">{t("customers.noCustomers")}</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {customers.map((c) => (
              <article key={c._id} className="card">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{c.name}</h3>
                    <p className="mt-1 flex items-center gap-1 text-sm text-slate-500"><Phone size={12} /> {c.phone}</p>
                    {c.address && <p className="mt-1 text-xs text-slate-400">{c.address}</p>}
                  </div>
                  <div className="flex gap-1">
                    <button type="button" onClick={() => { setEditing(c); setModalOpen(true); }} className="rounded-lg p-2 text-sky-600 hover:bg-sky-50"><Pencil size={16} /></button>
                    <button type="button" onClick={() => handleDelete(c)} className="rounded-lg p-2 text-red-500 hover:bg-red-50"><Trash2 size={16} /></button>
                  </div>
                </div>
                <div className={`mt-4 rounded-lg px-4 py-3 ${c.balance > 0 ? "bg-amber-50" : "bg-emerald-50"}`}>
                  <p className="text-xs font-medium text-slate-500">{t("customers.baqaya")}</p>
                  <p className={`text-xl font-bold ${c.balance > 0 ? "text-amber-700" : "text-emerald-700"}`}>
                    {c.balance > 0 ? formatCurrency(c.balance) : t("common.clear")}
                  </p>
                </div>
                <div className="mt-3 flex gap-2">
                  {c.balance > 0 && (
                    <button type="button" onClick={() => { setPayCustomer(c); setPaymentOpen(true); }} className="btn-primary flex-1 py-2 text-sm">{t("customers.recordWasool")}</button>
                  )}
                  <Link href={`/udhaar?customer=${c._id}`} className="btn-secondary flex flex-1 items-center justify-center gap-1 py-2 text-sm">
                    <BookOpen size={14} /> {t("customers.khata")}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
      <Footer />
      <CustomerModal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); }} onSubmit={handleSave} customer={editing} loading={submitting} />
      <PaymentModal open={paymentOpen} onClose={() => { setPaymentOpen(false); setPayCustomer(null); }} onSubmit={handlePayment} customer={payCustomer} balance={payCustomer?.balance || 0} loading={submitting} />
    </div>
  );
}

export default function CustomersPage() {
  return <ProtectedRoute><CustomersContent /></ProtectedRoute>;
}
