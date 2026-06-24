"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useLanguage } from "@/app/context/LanguageContext";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";
import Alert from "@/app/components/Alert";
import { getErrorMessage } from "@/app/utils/api";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      await login(formData);
      setSuccess(t("auth.loginSuccess"));
      setTimeout(() => router.push("/dashboard"), 800);
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
          <h1 className="text-3xl font-extrabold text-slate-800">{t("auth.loginTitle")}</h1>
          <p className="mt-2 text-slate-600">{t("auth.loginSubtitle")}</p>
        </div>
        <div className="rounded-2xl border border-sky-100 bg-white p-8 shadow-xl">
          <Alert type="success" message={success} />
          <Alert type="error" message={error} />
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">{t("auth.email")}</label>
              <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="input-field" placeholder={t("auth.emailPlaceholder")} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">{t("auth.password")}</label>
              <input type="password" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="input-field" placeholder={t("auth.passwordPlaceholder")} />
            </div>
            <button type="submit" disabled={isSubmitting} className="btn-primary w-full">{isSubmitting ? t("auth.signingIn") : t("auth.signIn")}</button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-600">
            {t("auth.noAccount")}{" "}
            <Link href="/register" className="font-semibold text-sky-600 hover:underline">{t("auth.registerHere")}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
