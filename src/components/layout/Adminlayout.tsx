"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  CalendarCheck,
  Wrench,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  ChevronDown,
  ShieldAlert,
} from "lucide-react";

const navItems = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Categories", href: "/admin/categories", icon: FolderKanban },
  { label: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
  { label: "Technicians", href: "/admin/technicians", icon: Wrench },
];

function Sidebar({
  mobileOpen,
  onClose,
}: {
  mobileOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/10 bg-[#0F1115] shadow-2xl transition-transform duration-300 lg:static lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo Section */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/[0.08] px-6">
          <Link href="/admin" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#D97706]/30 bg-gradient-to-br from-[#F59E0B]/20 via-[#D97706]/10 to-transparent shadow-sm shadow-[#D97706]/10">
              <Wrench className="h-4.5 w-4.5 text-[#D97706]" strokeWidth={2.25} />
            </span>
            <span
              className="text-lg font-bold tracking-tight text-[#F9FAFB]"
              style={{ fontFamily: "'Space Grotesk', ui-sans-serif, system-ui" }}
            >
              FixIt<span className="bg-gradient-to-r from-[#F59E0B] to-[#D97706] bg-clip-text text-transparent">Now</span>
            </span>
          </Link>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#9CA3AF] hover:bg-white/10 lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Section Title */}
        <div className="px-6 pb-2 pt-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">
            Administration Panel
          </p>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 space-y-1.5 px-3.5">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  active
                    ? "bg-gradient-to-r from-[#D97706]/20 to-[#D97706]/5 text-[#F3F4F6] shadow-sm shadow-[#D97706]/10 border border-[#D97706]/20"
                    : "text-[#9CA3AF] hover:bg-white/[0.05] hover:text-[#F3F4F6]"
                }`}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-[#D97706] shadow-sm shadow-[#D97706]" />
                )}
                <Icon
                  className={`h-4.5 w-4.5 transition-colors ${
                    active
                      ? "text-[#F59E0B]"
                      : "text-[#6B7280] group-hover:text-[#D1D5DB]"
                  }`}
                  strokeWidth={2}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Menu */}
        <div className="space-y-1.5 border-t border-white/[0.08] px-3.5 py-4">
          <Link
            href="/admin/settings"
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-[#9CA3AF] transition-colors hover:bg-white/[0.05] hover:text-[#F3F4F6]"
          >
            <Settings className="h-4.5 w-4.5 text-[#6B7280]" strokeWidth={2} />
            Settings
          </Link>
          <button className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-[#EF4444]/80 transition-colors hover:bg-[#EF4444]/10 hover:text-[#EF4444]">
            <LogOut className="h-4.5 w-4.5 text-[#EF4444]/80" strokeWidth={2} />
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}

function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#E5E0D8] bg-[#FAF8F5]/90 px-4 backdrop-blur-md sm:px-8">
      {/* Mobile Menu Button & Breadcrumb Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E5E0D8] bg-white text-[#1E2026] shadow-sm transition-colors hover:bg-[#F4EFE6] lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h1 className="text-sm font-bold tracking-tight text-[#1E2026] sm:text-base">
            Admin Dashboard
          </h1>
          <p className="hidden text-xs text-[#6B7280] sm:block">
            Manage your platform services & users
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* System Badge */}
        <span className="hidden items-center gap-1.5 rounded-full border border-[#D97706]/20 bg-[#D97706]/10 px-3 py-1 text-xs font-bold text-[#B45309] sm:flex">
          <ShieldAlert className="h-3.5 w-3.5" /> System Live
        </span>

        {/* Notifications Button */}
        <button
          className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E0D8] bg-white text-[#5C616E] shadow-sm transition-all hover:bg-[#F4EFE6] hover:text-[#1E2026]"
          aria-label="Notifications"
        >
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[#D97706] ring-2 ring-white" />
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-2.5 rounded-full border border-[#E5E0D8] bg-white p-1 pr-3 shadow-sm transition-all hover:border-[#D97706]/30"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-[#D97706] to-[#B45309] text-xs font-bold text-white shadow-sm">
              A
            </span>
            <span className="hidden text-sm font-bold text-[#1E2026] sm:block">
              Super Admin
            </span>
            <ChevronDown
              className={`h-4 w-4 text-[#9CA3AF] transition-transform duration-200 ${
                profileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-[calc(100%+8px)] w-52 overflow-hidden rounded-2xl border border-[#E5E0D8] bg-white p-2 shadow-xl shadow-black/5 animate-in fade-in-50 zoom-in-95">
              <div className="border-b border-[#E5E0D8] px-3 py-2">
                <p className="text-xs font-bold text-[#1E2026]">Logged in as</p>
                <p className="truncate text-xs text-[#6B7280]">admin@fixitnow.com</p>
              </div>
              <div className="pt-1">
                <Link
                  href="/admin/settings"
                  className="block rounded-xl px-3 py-2 text-sm font-medium text-[#4B5563] transition-colors hover:bg-[#FAF8F5] hover:text-[#1E2026]"
                >
                  Account Settings
                </Link>
                <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-[#EF4444] transition-colors hover:bg-[#FEF2F2]">
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-screen bg-[#F4EFE6]">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}