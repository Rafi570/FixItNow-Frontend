import { getCategories } from "@/src/actions/category.actions";
import CreateCategoryModal from "@/src/components/modules/admin/CreateCategoryModal";
import CategoryList from "@/src/components/modules/admin/CategoryList";


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
      <CategoryList initialCategories={categories} />
    </div>
  );
}