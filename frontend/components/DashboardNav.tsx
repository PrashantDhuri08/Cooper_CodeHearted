"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardNav() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    { href: "/dashboard", label: "Overview", icon: "📊" },
    { href: "/dashboard/events", label: "Events", icon: "🎉" },
    { href: "/dashboard/wallet", label: "Wallet", icon: "💰" },
    { href: "/dashboard/categories", label: "Categories", icon: "📁" },
    { href: "/dashboard/bills", label: "Bills", icon: "🧾" },
    { href: "/dashboard/settlement", label: "Settlement", icon: "⚖️" },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center">
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Cooper
            </h1>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  pathname === item.href
                    ? "bg-blue-100 text-blue-700"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-slate-200 px-4 py-2 overflow-x-auto">
        <div className="flex space-x-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                pathname === item.href
                  ? "bg-blue-100 text-blue-700"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span className="mr-1">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
