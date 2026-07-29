"use client";

import { useState } from "react";
import { Plus, FolderKanban, Loader2, CheckCircle2, AlertCircle, X } from "lucide-react";
import { createCategoryAction } from "@/src/actions/admin.actions";

export default function CreateCategoryModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const res = await createCategoryAction(formData);

    setLoading(false);

    if (res.success) {
      setMessage({ type: "success", text: res.message });
      (e.target as HTMLFormElement).reset();
      
      // সফল হলে ১.৫ সেকেন্ড পর পপআপ বন্ধ হয়ে যাবে
      setTimeout(() => {
        setIsOpen(false);
        setMessage(null);
      }, 1500);
    } else {
      setMessage({ type: "error", text: res.message });
    }
  };

  return (
    <>
      {/* Add Category Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-xl bg-[#D97706] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#B45309] active:scale-95"
      >
        <Plus className="h-4 w-4" /> Add Category
      </button>

      {/* Modal Backdrop & Form */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl border border-[#E5E0D8] bg-white p-6 shadow-2xl animate-in fade-in-50 zoom-in-95">
            
            {/* Close Cross Icon */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 text-[#9CA3AF] hover:text-[#1E2026]"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 border-b border-[#E5E0D8] pb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D97706]/10 text-[#D97706]">
                <FolderKanban className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-[#1E2026]">Add New Category</h3>
                <p className="text-xs text-[#6B7280]">Create a new service category for platform</p>
              </div>
            </div>

            {/* Alert Message */}
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

            {/* Category Form */}
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4B5563]">
                  Category Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Plumbing, Electrical, Cleaning"
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
                  placeholder="Short description about this service category..."
                  className="mt-1.5 w-full rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#1E2026] outline-none transition-all focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706]"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
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
                      Creating...
                    </>
                  ) : (
                    "Save Category"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}