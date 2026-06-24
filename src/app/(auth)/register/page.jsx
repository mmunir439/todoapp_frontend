"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useLanguage } from "@/app/context/LanguageContext";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";
import Alert from "@/app/components/Alert";
import { getErrorMessage } from "@/app/utils/api";
import { DEFAULT_SHOP_NAME } from "@/app/utils/shopHelpers";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    shopName: DEFAULT_SHOP_NAME,
    email: "",
    password: "",
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      await register(formData);
      setSuccess(t("auth.registerSuccess"));
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-100 via-sky-50 to-blue-100 p-6">
      <div className="absolute end-4 top-4">
        <LanguageSwitcher className="border-sky-300 bg-white/90 text-sky-800 [&_button]:text-sky-700" />
      </div>
      <div className="animate-fade-in w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-slate-800">{t("auth.registerTitle")}</h1>
          <p className="mt-2 text-slate-600">{t("auth.registerSubtitle")}</p>
        </div>
        <div className="rounded-2xl border border-sky-100 bg-white p-8 shadow-xl">
          <Alert type="success" message={success} />
          <Alert type="error" message={error} />
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">{t("auth.yourName")} *</label>
              <input required value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className="input-field" placeholder={t("auth.namePlaceholder")} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">{t("auth.shopName")}</label>
              <input value={formData.shopName} onChange={(e) => setFormData({ ...formData, shopName: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">{t("auth.email")} *</label>
              <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">{t("auth.password")} *</label>
              <input type="password" required minLength={6} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="input-field" />
            </div>
            <button type="submit" disabled={isSubmitting} className="btn-primary w-full">{isSubmitting ? t("auth.creating") : t("auth.register")}</button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-600">
            {t("auth.hasAccount")}{" "}
            <Link href="/login" className="font-semibold text-sky-600 hover:underline">{t("auth.signInLink")}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
