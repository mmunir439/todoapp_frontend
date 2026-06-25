"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";

export default function PasswordInput({
  id,
  value,
  onChange,
  placeholder,
  required = false,
  minLength,
  className = "",
  autoComplete,
}) {
  const [visible, setVisible] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        required={required}
        minLength={minLength}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className={`input-field pe-11 ${className}`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute end-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 transition hover:text-sky-600"
        aria-label={visible ? t("auth.hidePassword") : t("auth.showPassword")}
        tabIndex={-1}
      >
        {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
  );
}
