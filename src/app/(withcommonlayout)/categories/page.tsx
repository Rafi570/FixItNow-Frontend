import { getCategories } from "@/src/actions/category.actions";
import Link from "next/link";
import { Wrench, ArrowRight } from "lucide-react";

export default async function CategoriesPage() {
  const res = await getCategories();
  const categories = res?.success ? res.data : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 bg-[#FAF8F5]">
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#1E2026]">Explore Service Categories</h1>
        <p className="mt-3 text-sm text-[#6B7280]">
          Choose a category below to browse professional, high-quality, and certified services in your area.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((cat: any) => (
          <Link
            key={cat.id}
            href={`/services?category=${encodeURIComponent(cat.name)}`}
            className="group flex flex-col justify-between rounded-2xl border border-[#E7E2D8] bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#D97706]/40 hover:shadow-md"
          >
            <div>
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#D97706]/10 text-[#D97706] mb-4 group-hover:bg-[#D97706] group-hover:text-white transition-all">
                <Wrench className="h-6 w-6" />
              </span>
              <h3 className="text-lg font-bold text-[#1E2026] group-hover:text-[#B45309] transition-colors">
                {cat.name}
              </h3>
              <p className="mt-2 text-xs text-[#6B7280]">
                Explore verified service listings for {cat.name.toLowerCase()} providers.
              </p>
            </div>
            
            <div className="mt-6 flex items-center justify-between text-xs font-bold text-[#B45309]">
              <span>Browse Services</span>
              <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}

        {categories.length === 0 && (
          <div className="col-span-full py-16 text-center text-[#6B7280]">
            No service categories found.
          </div>
        )}
      </div>
    </div>
  );
}
