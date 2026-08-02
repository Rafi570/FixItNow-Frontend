"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Search } from "lucide-react";
import LogoutButton from "./LogoutButton";
import ApplyTechnicianButton from "./ApplyTechnicianButton";

interface NavLink {
  label: string;
  href: string;
}

export default function MobileMenu({ 
  navLinks, 
  isLoggedIn,
  userRole,
  userName,
  userEmail,
  applicationStatus,
}: { 
  navLinks: NavLink[]; 
  isLoggedIn: boolean;
  userRole?: string;
  userName?: string;
  userEmail?: string;
  applicationStatus?: string | null;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      window.location.href = `/services?search=${encodeURIComponent(query.trim())}`;
      setMobileOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setMobileOpen((v) => !v)}
        className="ml-auto flex h-9 w-9 items-center justify-center rounded-lg text-[#171B21] lg:hidden"
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {mobileOpen && (
        <div className="absolute left-0 top-16 w-full border-t border-[#E7E2D8] bg-[#FBFAF7] px-4 py-4 md:px-6 lg:hidden shadow-lg">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="flex items-center overflow-hidden rounded-full border border-[#E7E2D8] bg-white">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search services…"
                className="w-full bg-transparent px-4 py-2.5 text-sm outline-none placeholder:text-[#9AA0AA]"
              />
              <button
                type="submit"
                className="m-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E8912B] text-white"
              >
                <Search className="h-4 w-4" strokeWidth={2.5} />
              </button>
            </div>
          </form>

          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-2 py-2 text-sm font-medium text-[#5B6472] hover:bg-[#F1EEE6] hover:text-[#171B21]"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-4 flex flex-col gap-3 border-t border-[#E7E2D8] pt-4">
            <div className="px-1">
              <ApplyTechnicianButton
                isLoggedIn={isLoggedIn}
                userRole={userRole}
                userName={userName}
                userEmail={userEmail}
                applicationStatus={applicationStatus}
              />
            </div>
            {isLoggedIn ? (
              <div className="w-full flex justify-between items-center px-2">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium text-[#171B21]"
                >
                  Dashboard
                </Link>
                <LogoutButton />
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 rounded-full border border-[#E7E2D8] py-2 text-center text-sm font-medium text-[#171B21]"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 rounded-full bg-[#171B21] py-2 text-center text-sm font-medium text-white"
                >
                  Get started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}