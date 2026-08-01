"use client";

import { useState, useEffect } from "react";
import { Pencil, Trash2, X, Loader2, CheckCircle2, AlertCircle, Search, Filter } from "lucide-react";
import { updateServiceAction, deleteServiceAction, getTechniciansAction } from "@/src/actions/admin.actions";
import { ICategory } from "@/src/types/category";
import Pagination from "@/src/components/share/Pagination";

interface ServiceListProps {
  initialServices: any[];
  categories: ICategory[];
  currentUser?: any;
}

export default function ServiceList({ initialServices, categories, currentUser }: ServiceListProps) {
  const [services, setServices] = useState<any[]>(initialServices);
  const [editService, setEditService] = useState<any | null>(null);
  const [deleteServiceId, setDeleteServiceId] = useState<string | null>(null);

  const [technicians, setTechnicians] = useState<any[]>([]);
  const [loadingTechnicians, setLoadingTechnicians] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Sync state if initialServices change
  if (JSON.stringify(services) !== JSON.stringify(initialServices)) {
    setServices(initialServices);
  }

  // Fetch technicians dynamically when Edit Service modal is opened
  useEffect(() => {
    if (editService) {
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
  }, [editService]);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editService) return;

    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      price: Number(formData.get("price")),
      durationMins: formData.get("durationMins") ? Number(formData.get("durationMins")) : undefined,
      categoryId: formData.get("categoryId") as string,
      technicianId: formData.get("technicianId") as string,
    };

    const res = await updateServiceAction(editService.id, payload);
    setLoading(false);

    if (res.success) {
      setMessage({ type: "success", text: res.message });
      setTimeout(() => {
        setEditService(null);
        setMessage(null);
      }, 1500);
    } else {
      setMessage({ type: "error", text: res.message });
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    setMessage(null);

    const res = await deleteServiceAction(id);
    setLoading(false);

    if (res.success) {
      setMessage({ type: "success", text: res.message });
      setDeleteServiceId(null);
      setTimeout(() => {
        setMessage(null);
      }, 1500);
    } else {
      setMessage({ type: "error", text: res.message });
    }
  };

  // Filtered services
  const filteredServices = services.filter((service) => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (service.description && service.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory ? service.categoryId === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      {/* Search & Filter bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#E5E0D8] pb-5">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Search services by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-[#E5E0D8] bg-white pl-10 pr-4 py-2 text-sm text-[#1E2026] outline-none transition-all focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-[#6B7280]" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-[#E5E0D8] bg-white px-3.5 py-2 text-sm text-[#1E2026] outline-none transition-all focus:border-[#D97706]"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Alert Message */}
      {message && !editService && !deleteServiceId && (
        <div
          className={`mb-4 flex items-center gap-2 rounded-xl p-4 text-sm font-semibold ${message.type === "success"
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

      {/* Services Table */}
      <div className="overflow-x-auto rounded-2xl border border-[#E5E0D8] bg-white shadow-xs">
        <table className="w-full border-collapse text-left text-sm text-[#1E2026]">
          <thead className="bg-[#FAF8F5] text-xs font-bold uppercase tracking-wider text-[#6B7280]">
            <tr>
              <th scope="col" className="px-6 py-4">Service</th>
              <th scope="col" className="px-6 py-4">Category</th>
              <th scope="col" className="px-6 py-4">Technician</th>
              <th scope="col" className="px-6 py-4">Price</th>
              <th scope="col" className="px-6 py-4">Duration</th>
              <th scope="col" className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E0D8]/60">
            {paginatedServices.map((service) => (
              <tr key={service.id} className="transition-colors hover:bg-[#FAF8F5]/50">
                <td className="px-6 py-4">
                  <div className="font-bold text-[#1E2026]">{service.title}</div>
                  <div className="text-xs text-[#6B7280] line-clamp-1 max-w-xs">{service.description || "No description"}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className="inline-flex items-center rounded-full bg-[#FAF8F5] px-2.5 py-0.5 text-xs font-semibold text-[#D97706] border border-[#E5E0D8]">
                    {service.category?.name || "Uncategorized"}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-[#4B5563]">
                  {service.technician?.user?.name || "N/A"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 font-bold text-[#1E2026]">
                  ${service.price}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-[#6B7280]">
                  {service.durationMins ? `${service.durationMins} mins` : "N/A"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setEditService(service)}
                      className="flex items-center gap-1 rounded-lg border border-[#E5E0D8] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#4B5563] transition-all hover:bg-[#FAF8F5] hover:text-[#1E2026]"
                      title="Edit Service"
                    >
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => setDeleteServiceId(service.id)}
                      className="flex items-center gap-1 rounded-lg border border-[#FCA5A5] bg-[#FEF2F2] px-2.5 py-1.5 text-xs font-semibold text-[#EF4444] transition-all hover:bg-[#FEE2E2]"
                      title="Delete Service"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredServices.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center text-[#6B7280]">
                  No services found.
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
            totalItems={filteredServices.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      </div>

      {/* Edit Service Modal */}
      {editService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl border border-[#E5E0D8] bg-white p-6 shadow-2xl animate-in fade-in-50 zoom-in-95">
            <button
              onClick={() => {
                setEditService(null);
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
                <h3 className="text-lg font-bold text-[#1E2026]">Edit Service</h3>
                <p className="text-xs text-[#6B7280]">Modify existing service details</p>
              </div>
            </div>

            {message && (
              <div
                className={`mt-4 flex items-center gap-2 rounded-xl p-3 text-xs font-semibold ${message.type === "success"
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
                  Service Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  defaultValue={editService.title}
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
                  defaultValue={editService.description || ""}
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
                    defaultValue={editService.price}
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
                    defaultValue={editService.durationMins || ""}
                    placeholder="60"
                    className="mt-1.5 w-full rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#1E2026] outline-none transition-all focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4B5563]">
                  Category *
                </label>
                <select
                  name="categoryId"
                  required
                  defaultValue={editService.categoryId}
                  className="mt-1.5 w-full rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#1E2026] outline-none transition-all focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706]"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4B5563]">
                  Technician *
                </label>
                {loadingTechnicians ? (
                  <div className="mt-1.5 flex items-center gap-2 text-xs text-[#6B7280]">
                    <Loader2 className="h-4 w-4 animate-spin text-[#D97706]" /> Loading technicians...
                  </div>
                ) : (
                  <select
                    name="technicianId"
                    required
                    defaultValue={editService.technicianId}
                    className="mt-1.5 w-full rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#1E2026] outline-none transition-all focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706]"
                  >
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
                    setEditService(null);
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
                      Saving...
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

      {/* Delete Service Confirmation */}
      {deleteServiceId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl border border-[#E5E0D8] bg-white p-6 shadow-2xl animate-in fade-in-50 zoom-in-95">
            <button
              onClick={() => {
                setDeleteServiceId(null);
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
                <h3 className="text-lg font-bold text-[#1E2026]">Delete Service</h3>
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
              Are you sure you want to delete this service? Bookings associated with this service might be affected.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setDeleteServiceId(null);
                  setMessage(null);
                }}
                className="rounded-xl px-4 py-2 text-sm font-semibold text-[#6B7280] hover:bg-[#FAF8F5]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteServiceId)}
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
