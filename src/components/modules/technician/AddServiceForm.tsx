"use client";

import { useState, useEffect } from "react";
import { Wrench, Plus, Loader2, CheckCircle2, AlertCircle, ArrowLeft, Grid, DollarSign, Clock, FileText } from "lucide-react";
import { createTechnicianServiceAction } from "@/src/actions/service.actions";
import { createServiceAction, getTechniciansAction } from "@/src/actions/admin.actions";
import { ICategory } from "@/src/types/category";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface AddServiceFormProps {
  categories: ICategory[];
  currentUser?: any;
}

export default function AddServiceForm({ categories, currentUser }: AddServiceFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [loadingTechnicians, setLoadingTechnicians] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const isAdmin = currentUser?.role === "ADMIN";
  const isTechnician = currentUser?.role === "TECHNICIAN";

  useEffect(() => {
    if (isAdmin) {
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
  }, [isAdmin]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));
    const durationMins = formData.get("durationMins") ? Number(formData.get("durationMins")) : undefined;
    const categoryId = formData.get("categoryId") as string;

    let res;
    if (isTechnician) {
      res = await createTechnicianServiceAction({
        title,
        description,
        price,
        durationMins,
        categoryId,
      });
    } else {
      const technicianId = formData.get("technicianId") as string;
      if (!technicianId) {
        setLoading(false);
        setMessage({ type: "error", text: "Please select a technician for this service" });
        return;
      }
      res = await createServiceAction({
        title,
        description,
        price,
        durationMins,
        categoryId,
        technicianId,
      });
    }

    setLoading(false);

    if (res.success) {
      setMessage({ type: "success", text: res.message || "Service published successfully!" });
      setTimeout(() => {
        router.push("/dashboard/services");
        router.refresh();
      }, 1500);
    } else {
      setMessage({ type: "error", text: res.message || "Failed to publish service" });
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Back & Page Title Header */}
      <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/services"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E5E0D8] bg-white text-[#5B6472] transition-colors hover:bg-[#FAF8F5] hover:text-[#171B21]"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#1E2026]" style={{ fontFamily: "'Space Grotesk', ui-sans-serif, system-ui" }}>
              Add New Service
            </h1>
            <p className="text-xs text-[#6B7280]">
              Create a new service offering under Admin-defined categories
            </p>
          </div>
        </div>

        <span className="hidden sm:flex items-center gap-1.5 rounded-full border border-[#E8912B]/30 bg-[#E8912B]/10 px-3 py-1 text-xs font-bold text-[#D97706]">
          <Grid className="h-3.5 w-3.5" /> Service Publishing Portal
        </span>
      </div>

      {/* Alert Message */}
      {message && (
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

      {/* Main Form Card */}
      <div className="rounded-3xl border border-[#E5E0D8] bg-white p-6 shadow-sm sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Category Dropdown */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#5B6472] mb-1.5">
              Admin Category *
            </label>
            <select
              name="categoryId"
              required
              defaultValue=""
              className="w-full rounded-2xl border border-[#E5E0D8] bg-[#FAF8F5] px-4 py-3 text-sm font-semibold text-[#171B21] outline-none transition-all focus:border-[#E8912B] focus:ring-1 focus:ring-[#E8912B]"
            >
              <option value="" disabled>
                -- Select Category --
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-[11px] text-[#9CA3AF]">
              Choose from the existing categories created by Admin
            </p>
          </div>

          {/* Service Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#5B6472] mb-1.5">
              Service Title *
            </label>
            <input
              type="text"
              name="title"
              required
              placeholder="e.g. Professional AC Repair & Gas Refill"
              className="w-full rounded-2xl border border-[#E5E0D8] bg-[#FAF8F5] px-4 py-3 text-sm font-medium text-[#171B21] outline-none transition-all focus:border-[#E8912B] focus:ring-1 focus:ring-[#E8912B]"
            />
          </div>

          {/* Price & Duration */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5B6472] mb-1.5">
                Service Price ($) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
                <input
                  type="number"
                  name="price"
                  required
                  min="1"
                  step="1"
                  placeholder="e.g. 50"
                  className="w-full rounded-2xl border border-[#E5E0D8] bg-[#FAF8F5] pl-10 pr-4 py-3 text-sm font-semibold text-[#171B21] outline-none transition-all focus:border-[#E8912B] focus:ring-1 focus:ring-[#E8912B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5B6472] mb-1.5">
                Estimated Duration (Minutes)
              </label>
              <div className="relative">
                <Clock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
                <input
                  type="number"
                  name="durationMins"
                  min="1"
                  placeholder="e.g. 60"
                  className="w-full rounded-2xl border border-[#E5E0D8] bg-[#FAF8F5] pl-10 pr-4 py-3 text-sm font-semibold text-[#171B21] outline-none transition-all focus:border-[#E8912B] focus:ring-1 focus:ring-[#E8912B]"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#5B6472] mb-1.5">
              Service Description & Scope
            </label>
            <textarea
              name="description"
              rows={4}
              placeholder="Describe what is included in this service, tools used, terms, etc..."
              className="w-full rounded-2xl border border-[#E5E0D8] bg-[#FAF8F5] px-4 py-3 text-sm font-medium text-[#171B21] outline-none transition-all focus:border-[#E8912B] focus:ring-1 focus:ring-[#E8912B]"
            />
          </div>

          {/* Technician Assignment for Admin */}
          {isAdmin && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5B6472] mb-1.5">
                Assign Technician *
              </label>
              {loadingTechnicians ? (
                <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                  <Loader2 className="h-4 w-4 animate-spin text-[#D97706]" /> Loading technician list...
                </div>
              ) : (
                <select
                  name="technicianId"
                  required
                  defaultValue=""
                  className="w-full rounded-2xl border border-[#E5E0D8] bg-[#FAF8F5] px-4 py-3 text-sm font-semibold text-[#171B21] outline-none transition-all focus:border-[#E8912B] focus:ring-1 focus:ring-[#E8912B]"
                >
                  <option value="" disabled>
                    -- Select Technician --
                  </option>
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
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E0D8]">
            <Link
              href="/dashboard/services"
              className="rounded-xl px-5 py-2.5 text-xs font-bold text-[#6B7280] hover:bg-[#FAF8F5] hover:text-[#171B21]"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#171B21] px-6 py-3 text-xs font-bold text-white shadow-lg transition-all hover:bg-[#2A303B] active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Publishing Service...
                </>
              ) : (
                <>
                  <Wrench className="h-4 w-4 text-[#E8912B]" />
                  Publish Service Live
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
