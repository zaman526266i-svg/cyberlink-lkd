"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, Users, MapPin, Gift, Globe, UserCog, Package, LogOut, Menu, X, CreditCard } from "lucide-react";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuItems = [
    { name: "Overview", href: "/admin/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Applications", href: "/admin/dashboard/applications", icon: <Users size={20} /> },
    { name: "Packages", href: "/admin/dashboard/packages", icon: <Package size={20} /> },
    { name: "Managers", href: "/admin/dashboard/managers", icon: <UserCog size={20} /> },
    { name: "Coverage", href: "/admin/dashboard/coverage", icon: <MapPin size={20} /> },
    { name: "Offers", href: "/admin/dashboard/offers", icon: <Gift size={20} /> },
    { name: "Payments", href: "/admin/dashboard/payments", icon: <CreditCard size={20} /> },
    { name: "Site Content", href: "/admin/dashboard/settings", icon: <Globe size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/5 bg-slate-950/95 px-4 py-4 backdrop-blur lg:hidden">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-orange-400">Admin Panel</p>
          <h1 className="text-lg font-black">Dashboard</h1>
        </div>
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="rounded-xl border border-white/10 bg-slate-900 p-3"
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      <div className="flex min-h-screen">
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-white/5 bg-slate-900 p-6 transition-transform duration-200 lg:translate-x-0 ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          } lg:sticky lg:top-0 lg:h-screen`}
        >
          <div className="mb-8 lg:mb-10">
            <p className="text-xs uppercase tracking-[0.3em] text-orange-400">Admin Panel</p>
            <h2 className="mt-2 text-2xl font-black">Control Room</h2>
          </div>

          <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-4 rounded-xl border px-4 py-3 text-sm font-bold transition-all ${
                pathname === item.href
                  ? "border-orange-500/40 bg-orange-600/10 text-orange-400"
                  : "border-transparent hover:border-orange-600/20 hover:bg-orange-600/10 hover:text-orange-500"
              }`}
            >
              {item.icon} {item.name}
            </Link>
          ))}
          </nav>
          <div className="mt-8 lg:absolute lg:bottom-10 lg:left-6 lg:right-6">
            <form action="/api/admin/logout" method="POST">
              <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/10 p-3 font-bold text-red-500 transition-all hover:bg-red-500 hover:text-white">
                <LogOut size={18} /> Logout
              </button>
            </form>
          </div>
        </aside>

        {menuOpen ? (
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 z-40 bg-slate-950/60 lg:hidden"
            aria-label="Close navigation"
          />
        ) : null}

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
