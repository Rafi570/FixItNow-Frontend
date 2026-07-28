"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Menu, X, Wrench, User } from "lucide-react";

const categories = [
  "All categories",
  "Plumbing",
  "Electrical",
  "Cleaning",
  "Painting",
  "Carpentry",
  "AC Repair",
];

const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Technicians", href: "/technicians" },
  { label: "Categories", href: "/categories" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [category, setCategory] = useState(categories[0]);
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // wire this up to your search/services route, e.g.:
    // router.push(`/services?searchTerm=${query}&type=${category}`)
    console.log({ category, query });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#E7E2D8] bg-[#FBFAF7]/95 backdrop-blur supports-[backdrop-filter]:bg-[#FBFAF7]/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#171B21]">
            <Wrench className="h-5 w-5 text-[#E8912B]" strokeWidth={2.25} />
          </span>
          <span
            className="hidden text-lg font-semibold tracking-tight text-[#171B21] sm:block"
            style={{ fontFamily: "'Space Grotesk', ui-sans-serif, system-ui" }}
          >
            FixIt<span className="text-[#E8912B]">Now</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden items-center gap-6 pl-4 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[#5B6472] transition-colors hover:text-[#171B21]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Search bar — signature "socket" shape */}
        <form
          onSubmit={handleSearch}
          className="hidden flex-1 items-center md:flex"
        >
          <div className="flex w-full max-w-xl items-center overflow-hidden rounded-full border border-[#E7E2D8] bg-white shadow-sm transition-shadow focus-within:shadow-md focus-within:ring-2 focus-within:ring-[#E8912B]/30">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="Service category"
              className="hidden shrink-0 border-r border-[#E7E2D8] bg-transparent py-2.5 pl-4 pr-2 text-sm text-[#171B21] outline-none sm:block"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search plumbers, electricians, cleaners…"
              aria-label="Search services"
              className="w-full bg-transparent px-4 py-2.5 text-sm text-[#171B21] placeholder:text-[#9AA0AA] outline-none"
            />
            <button
              type="submit"
              aria-label="Search"
              className="m-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E8912B] text-white transition-transform hover:scale-105 active:scale-95"
            >
              <Search className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </div>
        </form>

        {/* Right side auth actions */}
        <div className="ml-auto hidden items-center gap-3 lg:flex">
          <Link
            href="/login"
            className="text-sm font-medium text-[#5B6472] hover:text-[#171B21]"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="flex items-center gap-1.5 rounded-full bg-[#171B21] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2A303B]"
          >
            <User className="h-4 w-4" />
            Get started
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="ml-auto flex h-9 w-9 items-center justify-center rounded-lg text-[#171B21] lg:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="border-t border-[#E7E2D8] bg-[#FBFAF7] px-4 py-4 md:px-6 lg:hidden">
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

          <div className="mt-4 flex gap-2 border-t border-[#E7E2D8] pt-4">
            <Link
              href="/login"
              className="flex-1 rounded-full border border-[#E7E2D8] py-2 text-center text-sm font-medium text-[#171B21]"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="flex-1 rounded-full bg-[#171B21] py-2 text-center text-sm font-medium text-white"
            >
              Get started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}