"use client";

import Link from "next/link";
import { ArrowLeft, Wrench, Tag, DollarSign, Clock, Calendar, Pencil, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteTechnicianServiceAction } from "@/src/actions/service.actions";

interface TechnicianServiceDetailProps {
  service: any;
}

export default function TechnicianServiceDetail({ service }: TechnicianServiceDetailProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);
    const res = await deleteTechnicianServiceAction(service.id);
    setDeleting(false);

    if (res.success) {
      router.push("/dashboard/my-services");
      router.refresh();
    } else {
      setError(res.message || "Failed to delete service");
    }
  };

  if (!service) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center text-center">
        <AlertCircle className="h-12 w-12 text-[#9CA3AF]" />
        <h2 className="mt-4 text-lg font-bold text-[#1E2026]">Service Not Found</h2>
        <p className="mt-1 text-xs text-[#6B7280]">The requested service could not be retrieved.</p>
        <Link
          href="/dashboard/my-services"
          className="mt-4 rounded-xl bg-[#171B21] px-4 py-2 text-xs font-bold text-white"
        >
          Back to My Services
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Back & Title Header */}
      <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/my-services"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E5E0D8] bg-white text-[#5B6472] transition-colors hover:bg-[#FAF8F5] hover:text-[#171B21]"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#1E2026]" style={{ fontFamily: "'Space Grotesk', ui-sans-serif, system-ui" }}>
              Service Details
            </h1>
            <p className="text-xs text-[#6B7280]">
              Full breakdown of your individual service package
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-bold text-red-700 transition-all hover:bg-red-100"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
            Delete Service
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
          <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Details Card */}
      <div className="rounded-3xl border border-[#E5E0D8] bg-white p-6 shadow-sm sm:p-8 space-y-6">
        {/* Title & Category Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-[#E5E0D8] pb-6">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8912B]/10 px-3 py-1 text-xs font-bold text-[#D97706] border border-[#E8912B]/20">
              <Tag className="h-3.5 w-3.5" />
              {service.category?.name || "Uncategorized"}
            </span>
            <h2 className="mt-3 text-2xl font-bold text-[#1E2026] leading-snug">
              {service.title}
            </h2>
            <p className="mt-1 text-xs text-[#9CA3AF]">
              Service ID: <code className="rounded bg-[#FAF8F5] px-2 py-0.5 text-[#4B5563]">{service.id}</code>
            </p>
          </div>

          <div className="rounded-2xl border border-[#E5E0D8] bg-[#FAF8F5] p-4 text-right min-w-[140px]">
            <p className="text-xs font-semibold text-[#6B7280]">Service Rate</p>
            <p className="text-3xl font-extrabold text-[#1E2026] mt-0.5">${service.price}</p>
          </div>
        </div>

        {/* Stats Quick Bar */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#E5E0D8] bg-[#FAF8F5] p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-[#D97706]">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-[#6B7280]">Duration</p>
              <p className="text-sm font-bold text-[#1E2026]">
                {service.durationMins ? `${service.durationMins} Minutes` : "Flexible Duration"}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E5E0D8] bg-[#FAF8F5] p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-[#6B7280]">Created On</p>
              <p className="text-sm font-bold text-[#1E2026]">
                {new Date(service.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E5E0D8] bg-[#FAF8F5] p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-[#6B7280]">Status</p>
              <p className="text-sm font-bold text-emerald-600">Active & Published</p>
            </div>
          </div>
        </div>

        {/* Full Description Section */}
        <div className="border-t border-[#E5E0D8] pt-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#5B6472]">
            Service Description & Features
          </h3>
          <div className="mt-3 rounded-2xl border border-[#E5E0D8] bg-[#FAF8F5] p-5 text-sm text-[#4B5563] leading-relaxed whitespace-pre-line">
            {service.description || "No detailed description has been provided for this service package."}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          onClick={() => setShowDeleteConfirm(false)}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-3xl border border-[#E5E0D8] bg-[#FBFAF7] p-6 shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-[#E5E0D8] pb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                <Trash2 className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-[#1E2026]">Delete Service</h3>
                <p className="text-xs text-[#6B7280]">This action cannot be undone</p>
              </div>
            </div>

            <p className="mt-4 text-sm text-[#4B5563]">
              Are you sure you want to delete <strong>"{service.title}"</strong>?
            </p>

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#E5E0D8] pt-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="rounded-xl px-4 py-2 text-xs font-bold text-[#6B7280] hover:bg-[#FAF8F5]"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-xl bg-red-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
