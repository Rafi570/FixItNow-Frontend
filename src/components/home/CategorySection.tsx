import Link from "next/link";
import CategorySlider from "./CategorySlider";
import { getCategories } from "@/src/actions/category.actions";

export default async function CategorySection() {
  const response = await getCategories();
  const categories = response?.data || [];

  return (
    <section className="bg-[#FAF8F5] py-8 border-y border-[#E7E2D8]/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Compact Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2
              className="text-lg font-bold text-[#1E2026]"
              style={{ fontFamily: "'Space Grotesk', ui-sans-serif, system-ui" }}
            >
              Popular Categories
            </h2>
            <span className="rounded-full bg-[#D97706]/15 px-2.5 py-0.5 text-xs font-bold text-[#B45309]">
              {categories.length}
            </span>
          </div>

          <Link
            href="/categories"
            className="text-xs font-bold text-[#B45309] hover:underline"
          >
            See All
          </Link>
        </div>

        {/* Compact Slider Component */}
        <CategorySlider categories={categories} />
      </div>
    </section>
  );
}