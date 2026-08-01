"use client";

import { useState, useEffect } from "react";
import { Pencil, Trash2, X, Loader2, CheckCircle2, AlertCircle, Plus, FolderKanban } from "lucide-react";
import { deleteCategoryAction, updateCategoryAction, getTechniciansAction, createServiceAction } from "@/src/actions/admin.actions";
import { ICategory } from "@/src/types/category";
import Pagination from "@/src/components/share/Pagination";

interface CategoryListProps {
  initialCategories: ICategory[];
}

export default function CategoryList({ initialCategories }: CategoryListProps) {
  const [categories, setCategories] = useState<ICategory[]>(initialCategories);
  const [editCategory, setEditCategory] = useState<ICategory | null>(null);
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);
  const [addServiceCategory, setAddServiceCategory] = useState<ICategory | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [loadingTechnicians, setLoadingTechnicians] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Sync state if initialCategories change
  if (JSON.stringify(categories) !== JSON.stringify(initialCategories)) {
    setCategories(initialCategories);
  }

  // Fetch technicians dynamically when Add Service modal is opened
  useEffect(() => {
    if (addServiceCategory) {
      const fetchTechs = async () => {
        setLoadingTechnicians(true);
        const res = await getTechniciansAction();
        if (res.success && res.data) {
          setTechnicians(res.data);
        }
        setLoadingTechnicians(false);
      };
      fetchTechs();
    }
  }, [addServiceCategory]);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editCategory) return;

    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const res = await updateCategoryAction(editCategory.id, formData);

    setLoading(false);

    if (res.success) {
      setMessage({ type: "success", text: res.message });
      setTimeout(() => {
        setEditCategory(null);
        setMessage(null);
      }, 1500);
    } else {
      setMessage({ type: "error", text: res.message });
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    setMessage(null);

    const res = await deleteCategoryAction(id);

    setLoading(false);

    if (res.success) {
      setMessage({ type: "success", text: res.message });
      setDeleteCategoryId(null);
      setTimeout(() => {
        setMessage(null);
      }, 1500);
    } else {
      setMessage({ type: "error", text: res.message });
    }
  };

  const handleCreateService = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!addServiceCategory) return;

    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      price: Number(formData.get("price")),
      durationMins: formData.get("durationMins") ? Number(formData.get("durationMins")) : undefined,
      categoryId: addServiceCategory.id,
      technicianId: formData.get("technicianId") as string,
    };

    const res = await createServiceAction(payload);
    setLoading(false);

    if (res.success) {
      setMessage({ type: "success", text: res.message });
      setTimeout(() => {
        setAddServiceCategory(null);
        setMessage(null);
      }, 1500);
    } else {
      setMessage({ type: "error", text: res.message });
    }
  };

  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const paginatedCategories = categories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      {/* Alert Message for inline operations */}
      {message && !editCategory && !deleteCategoryId && !addServiceCategory && (
        <div
          className={`mb-4 flex items-center gap-2 rounded-xl p-4 text-sm font-semibold ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Categories Table */}
      <div className="overflow-x-auto rounded-2xl border border-[#E5E0D8] bg-white shadow-xs">
        <table className="w-full border-collapse text-left text-sm text-[#1E2026]">
          <thead className="bg-[#FAF8F5] text-xs font-bold uppercase tracking-wider text-[#6B7280]">
            <tr>
              <th scope="col" className="px-6 py-4">Category Name</th>
              <th scope="col" className="px-6 py-4">Description</th>
              <th scope="col" className="px-6 py-4">Created At</th>
              <th scope="col" className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E0D8]/60">
            {paginatedCategories.map((cat) => (
              <tr key={cat.id} className="transition-colors hover:bg-[#FAF8F5]/50">
                <td className="whitespace-nowrap px-6 py-4 font-bold text-[#1E2026]">
                  {cat.name}
                </td>
                <td className="px-6 py-4 text-[#6B7280] max-w-xs truncate">
                  {cat.description || "No description available"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-[#6B7280]">
                  {new Date(cat.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setAddServiceCategory(cat)}
                      className="flex items-center gap-1 rounded-lg border border-[#D97706]/20 bg-[#D97706]/5 px-2.5 py-1.5 text-xs font-semibold text-[#D97706] transition-all hover:bg-[#D97706]/10"
                      title="Post Service"
                    >
                      <Plus className="h-3.5 w-3.5" /> Post Service
                    </button>
                    <button
                      onClick={() => setEditCategory(cat)}
                      className="flex items-center gap-1 rounded-lg border border-[#E5E0D8] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#4B5563] transition-all hover:bg-[#FAF8F5] hover:text-[#1E2026]"
                      title="Edit Category"
                    >
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => setDeleteCategoryId(cat.id)}
                      className="flex items-center gap-1 rounded-lg border border-[#FCA5A5] bg-[#FEF2F2] px-2.5 py-1.5 text-xs font-semibold text-[#EF4444] transition-all hover:bg-[#FEE2E2]"
                      title="Delete Category"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {categories.length === 0 && (
              <tr>
                <td colSpan={4} className="py-12 text-center text-[#6B7280]">
                  No categories found. Click 'Add Category' to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="p-4 border-t border-[#E5E0D8]">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
            totalItems={categories.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      </div>

      {/* Edit Category Modal */}
      {editCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl border border-[#E5E0D8] bg-white p-6 shadow-2xl animate-in fade-in-50 zoom-in-95">
            <button
              onClick={() => {
                setEditCategory(null);
                setMessage(null);
              }}
              className="absolute right-4 top-4 text-[#9CA3AF] hover:text-[#1E2026]"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-[#E5E0D8] pb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D97706]/10 text-[#D97706]">
                <Pencil className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-[#1E2026]">Edit Category</h3>
                <p className="text-xs text-[#6B7280]">Modify existing category attributes</p>
              </div>
            </div>

            {message && (
              <div
                className={`mt-4 flex items-center gap-2 rounded-xl p-3 text-xs font-semibold ${
                  message.type === "success"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 shrink-0" />
                )}
                <span>{message.text}</span>
              </div>
            )}

            <form onSubmit={handleUpdate} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4B5563]">
                  Category Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={editCategory.name}
                  placeholder="e.g. Plumbing, Electrical"
                  className="mt-1.5 w-full rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#1E2026] outline-none transition-all focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4B5563]">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={editCategory.description || ""}
                  placeholder="Short description..."
                  className="mt-1.5 w-full rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#1E2026] outline-none transition-all focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditCategory(null);
                    setMessage(null);
                  }}
                  className="rounded-xl px-4 py-2 text-sm font-semibold text-[#6B7280] hover:bg-[#FAF8F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 rounded-xl bg-[#D97706] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#B45309] disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Post Service under Category Modal */}
      {addServiceCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl border border-[#E5E0D8] bg-white p-6 shadow-2xl animate-in fade-in-50 zoom-in-95">
            <button
              onClick={() => {
                setAddServiceCategory(null);
                setMessage(null);
              }}
              className="absolute right-4 top-4 text-[#9CA3AF] hover:text-[#1E2026]"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-[#E5E0D8] pb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D97706]/10 text-[#D97706]">
                <FolderKanban className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-[#1E2026]">Post Service</h3>
                <p className="text-xs text-[#6B7280]">Add new service under <strong>{addServiceCategory.name}</strong></p>
              </div>
            </div>

            {message && (
              <div
                className={`mt-4 flex items-center gap-2 rounded-xl p-3 text-xs font-semibold ${
                  message.type === "success"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 shrink-0" />
                )}
                <span>{message.text}</span>
              </div>
            )}

            <form onSubmit={handleCreateService} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4B5563]">
                  Service Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. Deep Home Cleaning"
                  className="mt-1.5 w-full rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#1E2026] outline-none transition-all focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4B5563]">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={2}
                  placeholder="Service description..."
                  className="mt-1.5 w-full rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#1E2026] outline-none transition-all focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4B5563]">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    required
                    min="1"
                    placeholder="50"
                    className="mt-1.5 w-full rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#1E2026] outline-none transition-all focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4B5563]">
                    Duration (Mins)
                  </label>
                  <input
                    type="number"
                    name="durationMins"
                    placeholder="60"
                    className="mt-1.5 w-full rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#1E2026] outline-none transition-all focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4B5563]">
                  Assign Technician *
                </label>
                {loadingTechnicians ? (
                  <div className="mt-1.5 flex items-center gap-2 text-xs text-[#6B7280]">
                    <Loader2 className="h-4 w-4 animate-spin text-[#D97706]" /> Loading technicians...
                  </div>
                ) : (
                  <select
                    name="technicianId"
                    required
                    className="mt-1.5 w-full rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#1E2026] outline-none transition-all focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706]"
                  >
                    <option value="">Select a technician</option>
                    {technicians
                      .filter((tech) => tech.user?.status !== "BANNED")
                      .map((tech) => (
                        <option key={tech.id} value={tech.id}>
                          {tech.user?.name} ({tech.location || "No Location"})
                        </option>
                      ))}
                  </select>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setAddServiceCategory(null);
                    setMessage(null);
                  }}
                  className="rounded-xl px-4 py-2 text-sm font-semibold text-[#6B7280] hover:bg-[#FAF8F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || loadingTechnicians}
                  className="flex items-center gap-2 rounded-xl bg-[#D97706] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#B45309] disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Post"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteCategoryId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl border border-[#E5E0D8] bg-white p-6 shadow-2xl animate-in fade-in-50 zoom-in-95">
            <button
              onClick={() => {
                setDeleteCategoryId(null);
                setMessage(null);
              }}
              className="absolute right-4 top-4 text-[#9CA3AF] hover:text-[#1E2026]"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-[#E5E0D8] pb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600">
                <Trash2 className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-[#1E2026]">Delete Category</h3>
                <p className="text-xs text-[#6B7280]">This action cannot be undone.</p>
              </div>
            </div>

            {message && (
              <div
                className={`mt-4 flex items-center gap-2 rounded-xl p-3 text-xs font-semibold bg-red-50 text-red-700 border border-red-200`}
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{message.text}</span>
              </div>
            )}

            <p className="mt-4 text-sm text-[#4B5563]">
              Are you sure you want to delete this category? If there are any active services under this category, the operation will be rejected.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setDeleteCategoryId(null);
                  setMessage(null);
                }}
                className="rounded-xl px-4 py-2 text-sm font-semibold text-[#6B7280] hover:bg-[#FAF8F5]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteCategoryId)}
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Yes, Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
