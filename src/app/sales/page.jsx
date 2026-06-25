"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Trash2, ShoppingCart } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import Alert from "@/app/components/Alert";
import { useLanguage } from "@/app/context/LanguageContext";
import { customersApi, productsApi, salesApi, getErrorMessage } from "@/app/utils/api";
import { formatCurrency } from "@/app/utils/shopHelpers";

const emptyItem = { productId: "", qty: 1 };

function SalesContent() {
  const router = useRouter();
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [saleType, setSaleType] = useState("cash");
  const [customerId, setCustomerId] = useState("");
  const [items, setItems] = useState([{ ...emptyItem }]);
  const [note, setNote] = useState("");
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([productsApi.list(), customersApi.list()])
      .then(([p, c]) => { setProducts(p); setCustomers(c); })
      .catch((err) => setAlert({ type: "error", message: getErrorMessage(err) }))
      .finally(() => setLoading(false));
  }, []);

  const lineTotals = useMemo(() => items.map((item) => {
    const product = products.find((p) => p._id === item.productId);
    return product ? product.sellPrice * (Number(item.qty) || 0) : 0;
  }), [items, products]);

  const total = lineTotals.reduce((s, v) => s + v, 0);

  const updateItem = (idx, field, value) => {
    const updated = [...items];
    updated[idx] = { ...updated[idx], [field]: value };
    setItems(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setAlert({ type: "", message: "" });

    const validItems = items.filter((i) => i.productId && i.qty > 0).map((i) => ({ productId: i.productId, qty: Number(i.qty) }));

    if (validItems.length === 0) {
      setAlert({ type: "error", message: t("sales.selectProductError") });
      setSubmitting(false);
      return;
    }

    if (saleType === "credit" && !customerId) {
      setAlert({ type: "error", message: t("sales.selectCustomerError") });
      setSubmitting(false);
      return;
    }

    try {
      if (saleType === "cash") {
        await salesApi.cashSale({ items: validItems, note });
        setAlert({ type: "success", message: t("sales.cashSaved", { amount: formatCurrency(total) }) });
      } else {
        await salesApi.creditSale({ customerId, items: validItems, note });
        setAlert({ type: "success", message: t("sales.creditSaved", { amount: formatCurrency(total) }) });
      }
      setItems([{ ...emptyItem }]);
      setNote("");
      setTimeout(() => router.push("/udhaar"), 1500);
    } catch (err) {
      setAlert({ type: "error", message: getErrorMessage(err) });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600" /></div>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-sky-50 via-white to-sky-50">
      <Navbar />
      <main className="container mx-auto flex-1 px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-slate-800">{t("sales.title")}</h1>
          <p className="text-slate-600">{t("sales.subtitle")}</p>
        </div>
        <Alert type={alert.type} message={alert.message} />
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-6">
          <section className="card">
            <h2 className="mb-4 font-bold text-slate-800">{t("sales.saleType")}</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                { key: "cash", label: t("sales.cash"), desc: t("sales.cashDesc") },
                { key: "credit", label: t("sales.credit"), desc: t("sales.creditDesc") },
              ].map(({ key, label, desc }) => (
                <button key={key} type="button" onClick={() => setSaleType(key)} className={`rounded-xl border-2 p-4 text-start ${saleType === key ? "border-sky-500 bg-sky-50" : "border-sky-100"}`}>
                  <p className="font-bold text-slate-800">{label}</p>
                  <p className="text-xs text-slate-500">{desc}</p>
                </button>
              ))}
            </div>
          </section>
          {saleType === "credit" && (
            <section className="card">
              <h2 className="mb-3 font-bold text-slate-800">{t("sales.customer")}</h2>
              {customers.length === 0 ? (
                <p className="text-sm text-amber-700">{t("sales.addCustomerFirst")} <Link href="/customers" className="font-semibold underline">{t("sales.customersPage")}</Link></p>
              ) : (
                <select required value={customerId} onChange={(e) => setCustomerId(e.target.value)} className="input-field">
                  <option value="">{t("sales.selectCustomer")}</option>
                  {customers.map((c) => (
                    <option key={c._id} value={c._id}>{c.name} Tanvir{c.phone}{c.balance > 0 ? ` (${formatCurrency(c.balance)})` : ""}</option>
                  ))}
                </select>
              )}
            </section>
          )}
          <section className="card">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bold text-slate-800">{t("sales.products")}</h2>
              <button type="button" onClick={() => setItems([...items, { ...emptyItem }])} className="btn-secondary flex items-center gap-1 py-2 text-sm"><Plus size={14} /> {t("common.add")}</button>
            </div>
            {products.length === 0 ? (
              <p className="text-sm text-amber-700">{t("sales.addProductsFirst")} <Link href="/products" className="font-semibold underline">{t("sales.productsPage")}</Link></p>
            ) : (
              <div className="space-y-3">
                {items.map((item, idx) => {
                  const product = products.find((p) => p._id === item.productId);
                  return (
                    <div key={idx} className="grid grid-cols-12 items-end gap-2">
                      <div className="col-span-12 sm:col-span-7">
                        <label className="mb-1 block text-xs font-semibold text-slate-500">{t("sales.products")} *</label>
                        <select required value={item.productId} onChange={(e) => updateItem(idx, "productId", e.target.value)} className="input-field py-2 text-sm">
                          <option value="">{t("sales.selectProduct")}</option>
                          {products.map((p) => (
                            <option key={p._id} value={p._id}>{p.name} Tanvir{formatCurrency(p.sellPrice)} ({t("common.stock")}: {p.stock})</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-span-8 sm:col-span-3">
                        <label className="mb-1 block text-xs font-semibold text-slate-500">{t("common.qty")}</label>
                        <input type="number" min="0.01" step="any" value={item.qty} onChange={(e) => updateItem(idx, "qty", e.target.value)} className="input-field py-2 text-sm" />
                      </div>
                      <div className="col-span-4 flex items-end justify-between gap-2 sm:col-span-2">
                        <p className="pb-2 text-sm font-bold text-slate-700">{formatCurrency(lineTotals[idx])}</p>
                        <button type="button" onClick={() => items.length > 1 && setItems(items.filter((_, i) => i !== idx))} className="rounded-lg p-2 text-red-400 hover:bg-red-50"><Trash2 size={16} /></button>
                      </div>
                      {product && Number(item.qty) > product.stock && (
                        <p className="col-span-12 text-xs text-red-600">{t("sales.lowStockError", { name: product.name, stock: product.stock })}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
          <section className="card">
            <label className="mb-1 block text-sm font-semibold text-slate-700">{t("sales.noteOptional")}</label>
            <input value={note} onChange={(e) => setNote(e.target.value)} placeholder={t("sales.notePlaceholder")} className="input-field" />
          </section>
          <div className="rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 p-6 text-white shadow-lg">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm text-sky-100">{t("sales.totalBill")}</p>
                <p className="text-3xl font-bold">{formatCurrency(total)}</p>
                {saleType === "credit" && <p className="mt-1 text-sm text-amber-200">{t("sales.fullUdhaar")}</p>}
              </div>
              <button type="submit" disabled={submitting || total <= 0 || products.length === 0} className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-bold text-sky-700 disabled:opacity-60">
                <ShoppingCart size={18} /> {submitting ? t("common.saving") : t("sales.saveSale")}
              </button>
            </div>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}

export default function SalesPage() {
  return <ProtectedRoute><SalesContent /></ProtectedRoute>;
}
