"use client";

import { useState } from "react";
import { Wrench, Plus, Search, Filter, Clock, DollarSign, Tag, Calendar, AlertCircle, Pencil, Trash2, X, Loader2, CheckCircle2, Eye, ExternalLink } from "lucide-react";
import { updateTechnicianServiceAction, deleteTechnicianServiceAction } from "@/src/actions/service.actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Pagination from "@/src/components/share/Pagination";

interface MyServicesListProps {
  initialServices: any[];
  allCategories?: any[];
}

export default function MyServicesList({ initialServices, allCategories = [] }: MyServicesListProps) {
  const router = useRouter();
  const [services, setServices] = useState<any[]>(initialServices);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [editService, setEditService] = useState<any | null>(null);
  const [viewService, setViewService] = useState<any | null>(null);
  const [deleteServiceId, setDeleteServiceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Sync state if props change
  if (JSON.stringify(services) !== JSON.stringify(initialServices)) {
    setServices(initialServices);
  }

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
    };

    const res = await updateTechnicianServiceAction(editService.id, payload);
    setLoading(false);

    if (res.success) {
      setMessage({ type: "success", text: res.message || "Service updated successfully!" });
      setTimeout(() => {
        setEditService(null);
        setMessage(null);
        router.refresh();
      }, 1500);
    } else {
      setMessage({ type: "error", text: res.message || "Failed to update service" });
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    setMessage(null);

    const res = await deleteTechnicianServiceAction(id);
    setLoading(false);

    if (res.success) {
      setMessage({ type: "success", text: res.message || "Service deleted successfully!" });
      setDeleteServiceId(null);
      setTimeout(() => {
        setMessage(null);
        router.refresh();
      }, 1500);
    } else {
      setMessage({ type: "error", text: res.message || "Failed to delete service" });
    }
  };

  // Filter logic
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (service.description && service.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory ? service.categoryId === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Extract unique categories from technician's services
  const userCategories = Array.from(
    new Map(
      services
        .filter((s) => s.category)
        .map((s) => [s.category.id, s.category])
    ).values()
  );

  const availableCategories = allCategories.length > 0 ? allCategories : userCategories;

  return (
    <div className="space-y-6">
      {/* Header Banner & Add Button */}
      <div className="flex flex-col gap-4 rounded-3xl border border-[#E5E0D8] bg-gradient-to-r from-[#171B21] via-[#2A303B] to-[#171B21] p-6 text-white shadow-xl sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#E8912B]/20 text-[#E8912B]">
              <Wrench className="h-4.5 w-4.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-[#E8912B]">
              Technician Portal
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl" style={{ fontFamily: "'Space Grotesk', ui-sans-serif, system-ui" }}>
            My Individual Services
          </h1>
          <p className="mt-1 text-sm text-[#9CA3AF]">
            View details, add, edit, or delete your custom service offerings in table format.
          </p>
        </div>

        <Link
          href="/dashboard/services/add"
          className="flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-[#E8912B] px-5 py-3 text-xs font-bold text-white shadow-lg transition-all hover:bg-[#d47f1e] active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          Add New Service
        </Link>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#E5E0D8] bg-white p-5 shadow-xs flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-[#D97706] border border-amber-100">
            <Wrench className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#6B7280]">Total Offered Services</p>
            <p className="text-2xl font-extrabold text-[#1E2026] mt-0.5">{services.length}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-[#E5E0D8] bg-white p-5 shadow-xs flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#6B7280]">Average Rate</p>
            <p className="text-2xl font-extrabold text-[#1E2026] mt-0.5">
              ${services.length > 0 ? (services.reduce((acc, s) => acc + Number(s.price || 0), 0) / services.length).toFixed(0) : 0}/svc
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-[#E5E0D8] bg-white p-5 shadow-xs flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <Tag className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#6B7280]">Categories Covered</p>
            <p className="text-2xl font-extrabold text-[#1E2026] mt-0.5">{userCategories.length}</p>
          </div>
        </div>
      </div>

      {/* Alert Message for global actions */}
      {message && !editService && !deleteServiceId && !viewService && (
        <div
          className={`flex items-center gap-3 rounded-2xl p-4 text-sm font-semibold ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Search & Filter controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#E5E0D8] pb-5">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Search my services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-[#E5E0D8] bg-white pl-10 pr-4 py-2 text-sm text-[#1E2026] outline-none transition-all focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706]"
          />
        </div>

        {userCategories.length > 0 && (
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-[#6B7280]" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-xl border border-[#E5E0D8] bg-white px-3.5 py-2 text-sm text-[#1E2026] outline-none transition-all focus:border-[#D97706]"
            >
              <option value="">All My Categories</option>
              {userCategories.map((cat: any) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Services Table View */}
      <div className="overflow-hidden rounded-3xl border border-[#E5E0D8] bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-[#1E2026]">
            <thead className="bg-[#FAF8F5] text-xs font-bold uppercase tracking-wider text-[#6B7280]">
              <tr>
                <th scope="col" className="px-6 py-4">Service Details</th>
                <th scope="col" className="px-6 py-4">Category</th>
                <th scope="col" className="px-6 py-4">Price</th>
                <th scope="col" className="px-6 py-4">Duration</th>
                <th scope="col" className="px-6 py-4">Created Date</th>
                <th scope="col" className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E0D8]/60">
              {paginatedServices.map((service) => (
                <tr key={service.id} className="transition-colors hover:bg-[#FAF8F5]/60">
                  {/* Service Title & Description */}
                  <td className="px-6 py-4 max-w-sm">
                    <Link
                      href={`/dashboard/my-services/${service.id}`}
                      className="font-bold text-[#1E2026] text-sm hover:text-[#D97706] transition-colors flex items-center gap-1.5 group"
                    >
                      {service.title}
                      <ExternalLink className="h-3.5 w-3.5 text-[#9CA3AF] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                    <div className="text-xs text-[#6B7280] line-clamp-1 mt-0.5">
                      {service.description || "No description provided"}
                    </div>
                  </td>

                  {/* Category Badge */}
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#E8912B]/10 px-3 py-1 text-xs font-bold text-[#D97706] border border-[#E8912B]/20">
                      <Tag className="h-3 w-3" />
                      {service.category?.name || "Uncategorized"}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="whitespace-nowrap px-6 py-4 font-extrabold text-[#1E2026] text-base">
                    ${service.price}
                  </td>

                  {/* Duration */}
                  <td className="whitespace-nowrap px-6 py-4 text-xs font-medium text-[#4B5563]">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-[#D97706]" />
                      <span>{service.durationMins ? `${service.durationMins} Mins` : "Flexible"}</span>
                    </div>
                  </td>

                  {/* Created Date */}
                  <td className="whitespace-nowrap px-6 py-4 text-xs text-[#9CA3AF]">
                    {new Date(service.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>

                  {/* Action Buttons */}
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setViewService(service)}
                        className="flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition-all hover:bg-blue-100"
                        title="Quick View Details"
                      >
                        <Eye className="h-3.5 w-3.5 text-blue-600" /> Details
                      </button>
                      <button
                        onClick={() => {
                          setEditService(service);
                          setMessage(null);
                        }}
                        className="flex items-center gap-1.5 rounded-xl border border-[#E5E0D8] bg-white px-3 py-1.5 text-xs font-semibold text-[#4B5563] transition-all hover:bg-[#FAF8F5] hover:text-[#171B21]"
                        title="Edit Service"
                      >
                        <Pencil className="h-3.5 w-3.5 text-[#D97706]" /> Edit
                      </button>
                      <button
                        onClick={() => {
                          setDeleteServiceId(service.id);
                          setMessage(null);
                        }}
                        className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition-all hover:bg-red-100"
                        title="Delete Service"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-red-600" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredServices.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#6B7280]">
                    <div className="flex flex-col items-center justify-center">
                      <Wrench className="h-8 w-8 text-[#9CA3AF]" />
                      <p className="mt-2 text-sm font-bold text-[#1E2026]">No services found</p>
                      <p className="mt-0.5 text-xs text-[#6B7280]">
                        {services.length === 0
                          ? "You haven't created any service packages yet."
                          : "No services match your search filter."}
                      </p>
                      <Link
                        href="/dashboard/services/add"
                        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#171B21] px-4 py-2 text-xs font-bold text-white hover:bg-[#2A303B]"
                      >
                        <Plus className="h-3.5 w-3.5 text-[#E8912B]" />
                        Add New Service
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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

      {/* View Details Quick Modal */}
      {viewService && (
        <div
          onClick={() => setViewService(null)}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative my-auto w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-[#E5E0D8] bg-[#FBFAF7] p-6 shadow-2xl sm:p-8 animate-in zoom-in-95 duration-150 space-y-5"
          >
            <button
              onClick={() => setViewService(null)}
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-[#EFECE6] text-[#5B6472] transition-colors hover:bg-[#E2DDD3] hover:text-[#171B21]"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-[#E5E0D8] pb-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <Eye className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-[#1E2026]">Service Details</h3>
                <p className="text-xs text-[#6B7280]">Full information for this package</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#E8912B]/10 px-3 py-1 text-xs font-bold text-[#D97706] border border-[#E8912B]/20">
                    <Tag className="h-3 w-3" />
                    {viewService.category?.name || "Uncategorized"}
                  </span>
                  <h4 className="mt-2 text-xl font-bold text-[#1E2026]">{viewService.title}</h4>
                </div>
                <div className="rounded-2xl border border-[#E5E0D8] bg-[#FAF8F5] px-4 py-2 text-right">
                  <p className="text-[10px] font-semibold text-[#6B7280]">Rate</p>
                  <p className="text-2xl font-extrabold text-[#1E2026]">${viewService.price}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="rounded-2xl border border-[#E5E0D8] bg-white p-3.5 flex items-center gap-2.5">
                  <Clock className="h-4 w-4 text-[#D97706]" />
                  <div>
                    <p className="text-[10px] text-[#6B7280]">Duration</p>
                    <p className="text-xs font-bold text-[#1E2026]">
                      {viewService.durationMins ? `${viewService.durationMins} Mins` : "Flexible"}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#E5E0D8] bg-white p-3.5 flex items-center gap-2.5">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-[10px] text-[#6B7280]">Created</p>
                    <p className="text-xs font-bold text-[#1E2026]">
                      {new Date(viewService.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#5B6472] mb-1.5">Description</p>
                <div className="rounded-2xl border border-[#E5E0D8] bg-white p-4 text-xs text-[#4B5563] leading-relaxed">
                  {viewService.description || "No description provided."}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#E5E0D8]">
              <Link
                href={`/dashboard/my-services/${viewService.id}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D97706] hover:underline"
              >
                Open Full Details Page <ExternalLink className="h-3.5 w-3.5" />
              </Link>

              <button
                onClick={() => setViewService(null)}
                className="rounded-xl bg-[#171B21] px-4 py-2 text-xs font-bold text-white hover:bg-[#2A303B]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Service Modal */}
      {editService && (
        <div
          onClick={() => setEditService(null)}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative my-auto w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl border border-[#E5E0D8] bg-[#FBFAF7] p-6 shadow-2xl sm:p-8 animate-in zoom-in-95 duration-150"
          >
            <button
              onClick={() => {
                setEditService(null);
                setMessage(null);
              }}
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-[#EFECE6] text-[#5B6472] transition-colors hover:bg-[#E2DDD3] hover:text-[#171B21]"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-[#E5E0D8] pb-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#D97706]/10 text-[#D97706]">
                <Pencil className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-[#1E2026]">Edit Service</h3>
                <p className="text-xs text-[#6B7280]">Update details of your service package</p>
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
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
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
                  placeholder="e.g. AC Repair"
                  className="mt-1.5 w-full rounded-2xl border border-[#E5E0D8] bg-white px-3.5 py-2.5 text-sm text-[#1E2026] outline-none transition-all focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4B5563]">
                  Category *
                </label>
                <select
                  name="categoryId"
                  required
                  defaultValue={editService.categoryId}
                  className="mt-1.5 w-full rounded-2xl border border-[#E5E0D8] bg-white px-3.5 py-2.5 text-sm font-semibold text-[#1E2026] outline-none transition-all focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706]"
                >
                  {availableCategories.map((cat: any) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
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
                    className="mt-1.5 w-full rounded-2xl border border-[#E5E0D8] bg-white px-3.5 py-2.5 text-sm text-[#1E2026] outline-none transition-all focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706]"
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
                    className="mt-1.5 w-full rounded-2xl border border-[#E5E0D8] bg-white px-3.5 py-2.5 text-sm text-[#1E2026] outline-none transition-all focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4B5563]">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={editService.description || ""}
                  placeholder="Service description..."
                  className="mt-1.5 w-full rounded-2xl border border-[#E5E0D8] bg-white px-3.5 py-2.5 text-sm text-[#1E2026] outline-none transition-all focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5E0D8]">
                <button
                  type="button"
                  onClick={() => {
                    setEditService(null);
                    setMessage(null);
                  }}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-[#6B7280] hover:bg-[#FAF8F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 rounded-xl bg-[#D97706] px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-[#B45309] disabled:opacity-50"
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

      {/* Delete Service Confirmation Dialog */}
      {deleteServiceId && (
        <div
          onClick={() => setDeleteServiceId(null)}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative my-auto w-full max-w-md rounded-3xl border border-[#E5E0D8] bg-[#FBFAF7] p-6 shadow-2xl animate-in zoom-in-95 duration-150"
          >
            <button
              onClick={() => {
                setDeleteServiceId(null);
                setMessage(null);
              }}
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-[#EFECE6] text-[#5B6472] transition-colors hover:bg-[#E2DDD3] hover:text-[#171B21]"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-[#E5E0D8] pb-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                <Trash2 className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-[#1E2026]">Delete Service</h3>
                <p className="text-xs text-[#6B7280]">This action cannot be undone</p>
              </div>
            </div>

            {message && (
              <div className="mt-4 flex items-center gap-2 rounded-xl p-3 text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                <span>{message.text}</span>
              </div>
            )}

            <p className="mt-4 text-sm text-[#4B5563]">
              Are you sure you want to delete this service? It will be removed from customer listings and search.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-[#E5E0D8]">
              <button
                type="button"
                onClick={() => {
                  setDeleteServiceId(null);
                  setMessage(null);
                }}
                className="rounded-xl px-4 py-2 text-xs font-bold text-[#6B7280] hover:bg-[#FAF8F5]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteServiceId)}
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-red-700 disabled:opacity-50"
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
    </div>
  );
}
