import { getCategories } from "@/src/actions/category.actions";
import CreateCategoryModal from "@/src/components/modules/admin/CreateCategoryModal";


export default async function AdminCategoriesPage() {
  const response = await getCategories();
  const categories = response?.data || [];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1E2026]">
            Categories
          </h1>
          <p className="text-sm text-[#6B7280]">
            Manage all existing categories or create a new one
          </p>
        </div>

        {/* Modal Trigger Component */}
        <CreateCategoryModal />
      </div>

      {/* Category List Table / Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="rounded-2xl border border-[#E5E0D8] bg-white p-5 shadow-xs transition-all hover:shadow-md"
          >
            <h3 className="text-lg font-bold text-[#1E2026]">{cat.name}</h3>
            <p className="mt-1 line-clamp-2 text-xs text-[#6B7280]">
              {cat.description || "No description available"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}