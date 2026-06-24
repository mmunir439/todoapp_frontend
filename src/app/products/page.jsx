"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import ProductModal from "@/app/components/ProductModal";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import Alert from "@/app/components/Alert";
import { useLanguage } from "@/app/context/LanguageContext";
import { productsApi, getErrorMessage } from "@/app/utils/api";
import { formatCurrency, getId } from "@/app/utils/shopHelpers";

function ProductsContent() {
  const { t, categoryLabel, unitLabel } = useLanguage();
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({ categories: [], units: [] });
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (category) params.category = category;
      if (search.trim()) params.q = search.trim();
      const [list, metaData] = await Promise.all([productsApi.list(params), productsApi.getMeta()]);
      setProducts(list);
      setMeta(metaData);
    } catch (err) {
      setAlert({ type: "error", message: getErrorMessage(err) });
    } finally {
      setLoading(false);
    }
  }, [category, search]);

  useEffect(() => {
    const timer = setTimeout(load, 300);
    return () => clearTimeout(timer);
  }, [load]);

  const handleSave = async (payload) => {
    setSubmitting(true);
    try {
      if (editing) {
        await productsApi.update(getId(editing), payload);
        setAlert({ type: "success", message: t("products.updated") });
      } else {
        await productsApi.create(payload);
        setAlert({ type: "success", message: t("products.added") });
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

  const handleDelete = async (p) => {
    if (!window.confirm(t("products.deleteConfirm", { name: p.name }))) return;
    try {
      await productsApi.remove(getId(p));
      setAlert({ type: "success", message: t("products.deleted") });
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
            <h1 className="text-3xl font-extrabold text-slate-800">{t("products.title")}</h1>
            <p className="text-slate-600">{t("products.subtitle")}</p>
          </div>
          <button type="button" onClick={() => { setEditing(null); setModalOpen(true); }} className="btn-primary inline-flex items-center gap-2 self-start">
            <Plus size={18} /> {t("products.addProduct")}
          </button>
        </div>

        <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: "", message: "" })} />

        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("products.searchPlaceholder")} className="input-field ps-9" />
          </div>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-field sm:w-52">
            <option value="">{t("products.allCategories")}</option>
            {(meta.categories.length ? meta.categories : ["lighting", "wiring", "mobile", "tv_audio", "fan", "other"]).map((c) => (
              <option key={c} value={c}>{categoryLabel(c)}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="h-10 w-10 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600" /></div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-sky-200 py-16 text-center">
            <p className="font-semibold text-slate-700">{t("products.noProducts")}</p>
            <p className="mt-1 text-sm text-slate-500">{t("products.noProductsHint")}</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <article key={p._id} className="card">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-semibold text-sky-700">{categoryLabel(p.category)}</span>
                    <h3 className="mt-2 text-lg font-bold text-slate-800">{p.name}</h3>
                  </div>
                  <div className="flex gap-1">
                    <button type="button" onClick={() => { setEditing(p); setModalOpen(true); }} className="rounded-lg p-2 text-sky-600 hover:bg-sky-50"><Pencil size={16} /></button>
                    <button type="button" onClick={() => handleDelete(p)} className="rounded-lg p-2 text-red-500 hover:bg-red-50"><Trash2 size={16} /></button>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-lg bg-sky-50 px-3 py-2">
                    <p className="text-slate-500">{t("common.price")}</p>
                    <p className="font-bold">{formatCurrency(p.sellPrice)}</p>
                  </div>
                  <div className={`rounded-lg px-3 py-2 ${p.isLowStock || p.stock <= p.lowStockAlert ? "bg-red-50" : "bg-emerald-50"}`}>
                    <p className="text-slate-500">{t("common.stock")}</p>
                    <p className={`font-bold ${p.isLowStock || p.stock <= p.lowStockAlert ? "text-red-600" : "text-emerald-700"}`}>
                      {p.stock} {unitLabel(p.unit)}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
      <Footer />
      <ProductModal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); }} onSubmit={handleSave} product={editing} loading={submitting} categories={meta.categories} units={meta.units} />
    </div>
  );
}

export default function ProductsPage() {
  return <ProtectedRoute><ProductsContent /></ProtectedRoute>;
}
