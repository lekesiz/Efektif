"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/lib/i18n/routing";
import { useAuthStore } from "@/stores/auth";
import {
  LayoutDashboard,
  FileText,
  Brain,
  Briefcase,
  Star,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Users,
  BarChart3,
  Shield,
  GraduationCap,
  Globe,
  User,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

function getNavItems(role: string): NavItem[] {
  const studentItems: NavItem[] = [
    { href: "/dashboard", label: "nav.dashboard", icon: <LayoutDashboard size={20} /> },
    { href: "/profile", label: "nav.profile", icon: <User size={20} /> },
    { href: "/tests", label: "nav.tests", icon: <Brain size={20} /> },
    { href: "/results", label: "nav.results", icon: <BarChart3 size={20} /> },
    { href: "/careers", label: "nav.careers", icon: <Briefcase size={20} /> },
    { href: "/admission", label: "nav.admission", icon: <GraduationCap size={20} /> },
    { href: "/messaging", label: "nav.messaging", icon: <MessageSquare size={20} /> },
  ];

  const counselorItems: NavItem[] = [
    { href: "/dashboard", label: "nav.dashboard", icon: <LayoutDashboard size={20} /> },
    { href: "/students", label: "nav.students", icon: <Users size={20} /> },
    { href: "/messaging", label: "nav.messaging", icon: <MessageSquare size={20} /> },
    { href: "/results", label: "nav.results", icon: <BarChart3 size={20} /> },
  ];

  const adminItems: NavItem[] = [
    { href: "/dashboard", label: "nav.dashboard", icon: <LayoutDashboard size={20} /> },
    { href: "/users", label: "nav.users", icon: <Users size={20} /> },
    { href: "/analytics", label: "nav.analytics", icon: <BarChart3 size={20} /> },
    { href: "/settings", label: "nav.settings", icon: <Shield size={20} /> },
  ];

  if (role === "admin") return adminItems;
  if (role === "counselor") return counselorItems;
  return studentItems;
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const role = user?.role ?? "student";
  const navItems = getNavItems(role);

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col bg-white shadow-lg
          transition-all duration-300 dark:bg-gray-800
          lg:relative lg:z-auto
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${collapsed ? "w-16" : "w-64"}
        `}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b px-4 dark:border-gray-700">
          {!collapsed && (
            <Link href="/dashboard" className="text-xl font-bold text-blue-600">
              Efektif
            </Link>
          )}
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-md p-1 hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
          >
            <X size={20} />
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden rounded-md p-1 hover:bg-gray-100 dark:hover:bg-gray-700 lg:block"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium
                    transition-colors
                    ${
                      isActive(item.href)
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                    }
                  `}
                  title={collapsed ? t(item.label) : undefined}
                >
                  <span className="shrink-0">{item.icon}</span>
                  {!collapsed && <span>{t(item.label)}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar footer */}
        <div className="border-t p-3 dark:border-gray-700">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            title={collapsed ? t("nav.logout") : undefined}
          >
            <LogOut size={20} />
            {!collapsed && <span>{t("nav.logout")}</span>}
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top header */}
        <header className="flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-3 ml-auto">
            {/* Language switcher */}
            <div className="flex items-center gap-1 rounded-md border px-2 py-1 text-sm dark:border-gray-600">
              <Globe size={14} />
              <select
                className="appearance-none bg-transparent text-sm outline-none"
                defaultValue="fr"
                onChange={(e) => {
                  const locale = e.target.value;
                  const newPath = pathname.replace(/^\/(fr|tr|en)/, `/${locale}`);
                  window.location.href = newPath || `/${locale}`;
                }}
              >
                <option value="fr">FR</option>
                <option value="tr">TR</option>
                <option value="en">EN</option>
              </select>
            </div>

            {/* Notifications */}
            <Link
              href="/notifications"
              className="relative rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Bell size={20} />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
            </Link>

            {/* User avatar */}
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                {user?.name?.charAt(0)?.toUpperCase() ?? "?"}
              </div>
              {user?.name && (
                <span className="hidden text-sm font-medium md:block dark:text-gray-200">
                  {user.name}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
