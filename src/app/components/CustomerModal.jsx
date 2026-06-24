"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";

const empty = { name: "", phone: "", address: "" };

export default function CustomerModal({ open, onClose, onSubmit, customer, loading }) {
  const { t } = useLanguage();
  const [form, setForm] = useState(empty);

  useEffect(() => {
    if (customer) {
      setForm({ name: customer.name || "", phone: customer.phone || "", address: customer.address || "" });
    } else {
      setForm(empty);
    }
  }, [customer, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="animate-fade-in w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-sky-100 px-6 py-4">
          <h2 className="text-xl font-bold text-slate-800">{customer ? t("customers.editCustomer") : t("customers.addCustomer")}</h2>
          <button type="button" onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-sky-50"><X size={20} /></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit({ ...form }); }} className="space-y-4 p-6">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">{t("customers.name")}</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={t("customers.namePlaceholder")} className="input-field" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">{t("customers.phone")}</label>
            <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="03XX-XXXXXXX" className="input-field" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">{t("customers.address")}</label>
            <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder={t("customers.addressPlaceholder")} className="input-field" />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="btn-secondary">{t("common.cancel")}</button>
            <button type="submit" disabled={loading} className="btn-primary">{loading ? t("common.saving") : customer ? t("common.update") : t("customers.addCustomer")}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
