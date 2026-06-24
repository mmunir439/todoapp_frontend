"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";

const empty = {
  name: "",
  category: "other",
  buyPrice: "",
  sellPrice: "",
  stock: "",
  unit: "piece",
  lowStockAlert: "5",
};

export default function ProductModal({ open, onClose, onSubmit, product, loading, categories = [], units = [] }) {
  const { t, categoryLabel, unitLabel } = useLanguage();
  const [form, setForm] = useState(empty);
  const catOptions = categories.length ? categories : ["lighting", "wiring", "mobile", "tv_audio", "fan", "other"];
  const unitOptions = units.length ? units : ["piece", "meter", "dozen"];

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        category: product.category || "other",
        buyPrice: product.buyPrice ?? "",
        sellPrice: product.sellPrice ?? "",
        stock: product.stock ?? "",
        unit: product.unit || "piece",
        lowStockAlert: product.lowStockAlert ?? "5",
      });
    } else {
      setForm(empty);
    }
  }, [product, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="animate-fade-in w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-sky-100 px-6 py-4">
          <h2 className="text-xl font-bold text-slate-800">{product ? t("products.editProduct") : t("products.addProduct")}</h2>
          <button type="button" onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-sky-50"><X size={20} /></button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({
              name: form.name.trim(),
              category: form.category,
              buyPrice: Number(form.buyPrice) || 0,
              sellPrice: Number(form.sellPrice),
              stock: Number(form.stock),
              unit: form.unit,
              lowStockAlert: Number(form.lowStockAlert) || 5,
            });
          }}
          className="space-y-4 p-6"
        >
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">{t("products.productName")}</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={t("products.namePlaceholder")} className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">{t("products.category")}</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
                {catOptions.map((c) => (<option key={c} value={c}>{categoryLabel(c)}</option>))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">{t("products.unit")}</label>
              <select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="input-field">
                {unitOptions.map((u) => (<option key={u} value={u}>{unitLabel(u)}</option>))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">{t("products.buyPrice")}</label>
              <input type="number" min="0" value={form.buyPrice} onChange={(e) => setForm({ ...form, buyPrice: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">{t("products.sellPrice")}</label>
              <input required type="number" min="0" value={form.sellPrice} onChange={(e) => setForm({ ...form, sellPrice: e.target.value })} className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">{t("products.stockQty")}</label>
              <input required type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">{t("products.lowStockAlert")}</label>
              <input type="number" min="0" value={form.lowStockAlert} onChange={(e) => setForm({ ...form, lowStockAlert: e.target.value })} className="input-field" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">{t("common.cancel")}</button>
            <button type="submit" disabled={loading} className="btn-primary">{loading ? t("common.saving") : product ? t("common.update") : t("products.addProduct")}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
