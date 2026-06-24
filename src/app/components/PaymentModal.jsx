"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";
import { formatCurrency } from "@/app/utils/shopHelpers";

export default function PaymentModal({ open, onClose, onSubmit, customer, balance, loading }) {
  const { t } = useLanguage();
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (open) { setAmount(""); setNotes(""); }
  }, [open]);

  if (!open || !customer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="animate-fade-in w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-sky-100 px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">{t("payment.title")}</h2>
            <p className="text-sm text-slate-500">{customer.name}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-sky-50"><X size={20} /></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit({ customerId: customer._id, amount: Number(amount), notes }); }} className="space-y-4 p-6">
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
            <p className="text-sm text-amber-800">{t("payment.currentBalance")}</p>
            <p className="text-2xl font-bold text-amber-900">{formatCurrency(balance)}</p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">{t("payment.amountReceived")}</label>
            <input required type="number" min="1" max={balance} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={t("payment.amountPlaceholder")} className="input-field" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">{t("common.note")}</label>
            <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t("payment.notePlaceholder")} className="input-field" />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="btn-secondary">{t("common.cancel")}</button>
            <button type="submit" disabled={loading} className="btn-primary">{loading ? t("common.saving") : t("payment.savePayment")}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
