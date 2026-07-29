"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Wrench, ArrowUpRight } from "lucide-react";
import { ICategory } from "@/src/types/category";

export default function CategorySlider({ categories }: { categories: ICategory[] }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -220 : 220;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (!categories || categories.length === 0) return null;

  return (
    <div className="relative group">
      {/* Left/Right Scroll Control Overlay Buttons */}
      <button
        onClick={() => scroll("left")}
        aria-label="Scroll Left"
        className="absolute -left-4 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#D97706]/20 bg-white/95 text-[#1E2026] shadow-md backdrop-blur-sm transition-all hover:scale-110 hover:border-[#D97706] active:scale-95"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        onClick={() => scroll("right")}
        aria-label="Scroll Right"
        className="absolute -right-4 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#D97706]/20 bg-white/95 text-[#1E2026] shadow-md backdrop-blur-sm transition-all hover:scale-110 hover:border-[#D97706] active:scale-95"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Small Compact Cards Horizontal Container */}
      <div
        ref={scrollContainerRef}
        className="no-scrollbar flex items-center gap-3.5 overflow-x-auto scroll-smooth py-2 px-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/services?category=${encodeURIComponent(cat.name)}`}
            className="group flex min-w-[170px] max-w-[200px] shrink-0 items-center justify-between rounded-xl border border-[#D97706]/15 bg-white p-3.5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D97706]/50 hover:shadow-md hover:shadow-[#D97706]/10"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              {/* Small Icon */}
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#D97706]/20 bg-[#FAF8F5] text-[#B45309] transition-colors group-hover:bg-[#D97706] group-hover:text-white">
                <Wrench className="h-5 w-5" strokeWidth={2} />
              </span>

              {/* Title Only */}
              <h3 className="truncate text-sm font-bold text-[#1E2026] group-hover:text-[#B45309] transition-colors">
                {cat.name}
              </h3>
            </div>

            {/* Small Arrow Indicator */}
            <ArrowUpRight className="h-4 w-4 shrink-0 text-[#9CA3AF] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#B45309]" />
          </Link>
        ))}
      </div>
    </div>
  );
}