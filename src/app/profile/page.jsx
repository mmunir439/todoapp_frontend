"use client";

import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import Alert from "@/app/components/Alert";
import { useAuth } from "@/app/context/AuthContext";
import { useLanguage } from "@/app/context/LanguageContext";
import { getErrorMessage } from "@/app/utils/api";
import { DEFAULT_SHOP_NAME } from "@/app/utils/shopHelpers";

function ProfileContent() {
  const { user, updateProfile, deleteAccount, logout } = useAuth();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ username: "", shopName: "", email: "", password: "" });
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({ username: user.username || "", shopName: user.shopName || DEFAULT_SHOP_NAME, email: user.email || "", password: "" });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = { username: formData.username, shopName: formData.shopName, email: formData.email };
      if (formData.password) payload.password = formData.password;
      await updateProfile(payload);
      setAlert({ type: "success", message: t("profile.updated") });
      setFormData((prev) => ({ ...prev, password: "" }));
    } catch (err) {
      setAlert({ type: "error", message: getErrorMessage(err) });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-sky-50 via-white to-sky-50">
      <Navbar />
      <main className="container mx-auto flex-1 px-4 py-8">
        <div className="mx-auto max-w-lg">
          <h1 className="text-3xl font-extrabold text-slate-800">{t("profile.title")}</h1>
          <p className="mt-1 text-slate-600">{t("profile.subtitle")}</p>
          <div className="mt-8 rounded-2xl border border-sky-100 bg-white p-8 shadow-lg">
            <Alert type={alert.type} message={alert.message} />
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">{t("auth.yourName")}</label>
                <input required value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">{t("auth.shopName")}</label>
                <input required value={formData.shopName} onChange={(e) => setFormData({ ...formData, shopName: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">{t("auth.email")}</label>
                <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">{t("profile.newPassword")} <span className="font-normal text-slate-400">{t("profile.passwordOptional")}</span></label>
                <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="input-field" />
              </div>
              <button type="submit" disabled={isSubmitting} className="btn-primary w-full">{isSubmitting ? t("common.saving") : t("profile.saveChanges")}</button>
            </form>
            <div className="mt-8 border-t border-sky-100 pt-6">
              <h3 className="text-sm font-semibold text-slate-700">{t("profile.dangerZone")}</h3>
              <p className="mt-1 text-sm text-slate-500">{t("profile.deleteWarning")}</p>
              <div className="mt-4 flex gap-3">
                <button type="button" onClick={logout} className="btn-secondary">{t("nav.logout")}</button>
                <button type="button" onClick={async () => {
                  if (!window.confirm(t("profile.deleteConfirm"))) return;
                  setIsDeleting(true);
                  try { await deleteAccount(); } catch (err) { setAlert({ type: "error", message: getErrorMessage(err) }); setIsDeleting(false); }
                }} disabled={isDeleting} className="btn-danger">{isDeleting ? t("profile.deleting") : t("profile.deleteAccount")}</button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function ProfilePage() {
  return <ProtectedRoute><ProfileContent /></ProtectedRoute>;
}
