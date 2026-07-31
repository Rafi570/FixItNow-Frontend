"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface NavSearchProps {
  categories: Category[];
}

export default function NavSearch({ categories = [] }: NavSearchProps) {
  const [category, setCategory] = useState("All categories");
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) {
      params.set("searchTerm", query.trim());
    }
    if (category !== "All categories") {
      params.set("category", category);
    }
    router.push(`/services${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <form onSubmit={handleSearch} className="hidden flex-1 items-center md:flex">
      <div className="flex w-full max-w-xl items-center overflow-hidden rounded-full border border-[#E7E2D8] bg-white shadow-sm transition-shadow focus-within:shadow-md focus-within:ring-2 focus-within:ring-[#E8912B]/30">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Service category"
          className="hidden shrink-0 border-r border-[#E7E2D8] bg-transparent py-2.5 pl-4 pr-2 text-sm text-[#171B21] outline-none sm:block max-w-[150px] truncate"
        >
          <option value="All categories">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
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
  );
}