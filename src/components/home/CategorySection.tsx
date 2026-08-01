import Link from "next/link";
import CategorySlider from "./CategorySlider";
import { getCategories } from "@/src/actions/category.actions";
import { LayoutGrid, ArrowRight } from "lucide-react";

export default async function CategorySection() {
  const response = await getCategories();
  const categories = response?.data || [];

  return (
    <section className="bg-[#FAF8F5] py-16 lg:py-20 border-b border-[#E7E2D8]/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Center-aligned Uniform Header */}
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D97706]/30 bg-[#D97706]/10 px-4 py-1.5 text-xs font-bold text-[#D97706] mb-3">
            <LayoutGrid className="h-3.5 w-3.5" />
            <span>Service Categories</span>
          </div>
          <h2
            className="text-3xl font-extrabold tracking-tight text-[#1E2026] sm:text-4xl"
            style={{ fontFamily: "'Space Grotesk', ui-sans-serif, system-ui" }}
          >
            Explore Our Categories
          </h2>
          <p className="mt-2 text-sm text-[#6B7280]">
            Browse verified service categories for electrical, plumbing, AC, and home maintenance needs
          </p>
          <div className="mt-4">
            <Link
              href="/categories"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B45309] hover:underline bg-white border border-[#E7E2D8] px-4 py-2 rounded-xl shadow-xs hover:bg-[#FAF8F5] transition-all"
            >
              <span>See All Categories ({categories.length})</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Category Slider Component */}
        <CategorySlider categories={categories} />
      </div>
    </section>
  );
}