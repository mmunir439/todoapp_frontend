"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Users,
  BookOpen,
  ShoppingCart,
  Zap,
  LogOut,
  User,
  LogIn,
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { useLanguage } from "@/app/context/LanguageContext";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";
import { DEFAULT_SHOP_NAME } from "@/app/utils/shopHelpers";

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout, loading } = useAuth();
  const { t } = useLanguage();
  const shopName = user?.shopName || DEFAULT_SHOP_NAME;

  const links = [
    { href: "/dashboard", labelKey: "nav.dashboard", icon: LayoutDashboard },
    { href: "/products", labelKey: "nav.products", icon: Package },
    { href: "/customers", labelKey: "nav.customers", icon: Users },
    { href: "/udhaar", labelKey: "nav.udhaar", icon: BookOpen },
    { href: "/sales", labelKey: "nav.newSale", icon: ShoppingCart },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-gradient-to-r from-sky-700 via-sky-600 to-blue-700 text-white shadow-lg">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20">
            <Zap size={20} />
          </span>
          <div>
            <p className="text-lg font-bold leading-tight">{shopName}</p>
            <p className="text-xs text-sky-100">{t("nav.shopSystem")}</p>
          </div>
        </Link>

        <div className="flex flex-wrap items-center gap-1">
          <LanguageSwitcher className="me-1" />

          {isAuthenticated ? (
            <>
              {links.map(({ href, labelKey, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    pathname === href
                      ? "bg-white/25 text-white"
                      : "text-sky-100 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon size={16} />
                  <span className="hidden sm:inline">{t(labelKey)}</span>
                </Link>
              ))}
              <Link
                href="/profile"
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  pathname === "/profile"
                    ? "bg-white/25 text-white"
                    : "text-sky-100 hover:bg-white/10 hover:text-white"
                }`}
              >
                <User size={16} />
                <span className="hidden sm:inline">{user?.username || t("nav.profile")}</span>
              </Link>
              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-sky-100 hover:bg-white/10"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">{t("nav.logout")}</span>
              </button>
            </>
          ) : (
            !loading && (
              <>
                <Link href="/login" className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-sky-100 hover:bg-white/10">
                  <LogIn size={16} /> {t("nav.login")}
                </Link>
                <Link href="/register" className="rounded-lg bg-white/20 px-3 py-2 text-sm font-semibold hover:bg-white/30">
                  {t("nav.register")}
                </Link>
              </>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
