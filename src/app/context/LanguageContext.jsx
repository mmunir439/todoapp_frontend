"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import en from "../locales/en";
import ur from "../locales/ur";

const STORAGE_KEY = "taneer_locale";

const dictionaries = { en, ur };

function getNested(obj, path) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

function interpolate(str, vars = {}) {
  if (typeof str !== "string") return str;
  return str.replace(/\{(\w+)\}/g, (_, key) => (vars[key] != null ? String(vars[key]) : `{${key}}`));
}

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [locale, setLocaleState] = useState("en");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "ur") setLocaleState(saved);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ur" ? "rtl" : "ltr";
    localStorage.setItem(STORAGE_KEY, locale);
  }, [locale, ready]);

  const setLocale = useCallback((next) => {
    if (next === "en" || next === "ur") setLocaleState(next);
  }, []);

  const toggleLocale = useCallback(() => {
    setLocaleState((prev) => (prev === "en" ? "ur" : "en"));
  }, []);

  const dict = dictionaries[locale] || en;

  const t = useCallback(
    (key, vars) => {
      const value = getNested(dict, key) ?? getNested(en, key) ?? key;
      return interpolate(value, vars);
    },
    [dict]
  );

  const categoryLabel = useCallback((key) => t(`categories.${key}`) || key, [t]);
  const unitLabel = useCallback((key) => t(`units.${key}`) || key, [t]);
  const txTypeLabel = useCallback((key) => t(`txTypes.${key}`) || key, [t]);

  const formatDateLocalized = useCallback(
    (dateStr) => {
      if (!dateStr) return "—";
      return new Date(dateStr).toLocaleDateString(locale === "ur" ? "ur-PK" : "en-PK", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    },
    [locale]
  );

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      toggleLocale,
      t,
      categoryLabel,
      unitLabel,
      txTypeLabel,
      formatDateLocalized,
      isRtl: locale === "ur",
    }),
    [locale, setLocale, toggleLocale, t, categoryLabel, unitLabel, txTypeLabel, formatDateLocalized]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
