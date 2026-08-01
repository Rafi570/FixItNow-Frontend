"use client";

import { useState } from "react";
import { Wrench, CheckCircle2, XCircle, Clock, MapPin, DollarSign, Briefcase, User, AlertCircle, Loader2 } from "lucide-react";
import { updateApplicationStatusAction } from "@/src/actions/technicianApplication.actions";
import { useRouter } from "next/navigation";
import Pagination from "@/src/components/share/Pagination";

interface TechnicianApplicationItem {
  id: string;
  userId: string;
  bio?: string | null;
  experience: number;
  skills: string[];
  hourlyRate: number;
  location?: string | null;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt?: string;
  };
}

export default function AdminApplicationsClient({
  initialApplications,
}: {
  initialApplications: TechnicianApplicationItem[];
}) {
  const router = useRouter();
  const [applications, setApplications] = useState<TechnicianApplicationItem[]>(initialApplications);
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "ACCEPTED" | "REJECTED">("ALL");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filtered = applications.filter((app) => {
    if (filter === "ALL") return true;
    return app.status === filter;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedApplications = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleStatusUpdate = async (id: string, newStatus: "ACCEPTED" | "REJECTED") => {
    setLoadingId(id);
    setMessage(null);

    const res = await updateApplicationStatusAction(id, newStatus);

    setLoadingId(null);

    if (res.success) {
      setMessage({
        type: "success",
        text: newStatus === "ACCEPTED" 
          ? "Application accepted! User role upgraded to TECHNICIAN & TechnicianProfile created."
          : "Application rejected.",
      });

      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
      );

      router.refresh();
    } else {
      setMessage({
        type: "error",
        text: res.message || "Failed to update status",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 rounded-3xl border border-[#E5E0D8] bg-gradient-to-r from-[#171B21] via-[#232832] to-[#171B21] p-6 text-white shadow-xl sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#E8912B]/20 text-[#E8912B]">
              <Wrench className="h-4.5 w-4.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-[#E8912B]">
              Admin Dashboard
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl" style={{ fontFamily: "'Space Grotesk', ui-sans-serif, system-ui" }}>
            Technician Applications
          </h1>
          <p className="mt-1 text-sm text-[#9CA3AF]">
            Review, approve, or reject user requests to become verified technicians.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center">
            <p className="text-2xl font-bold text-[#E8912B]">{applications.filter((a) => a.status === "PENDING").length}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">Pending Approval</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center">
            <p className="text-2xl font-bold text-emerald-400">{applications.filter((a) => a.status === "ACCEPTED").length}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">Approved Technicians</p>
          </div>
        </div>
      </div>

      {/* Alert Messages */}
      {message && (
        <div
          className={`flex items-center gap-3 rounded-2xl border p-4 text-sm font-medium ${
            message.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-700"
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

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-[#E5E0D8] bg-white p-2 shadow-sm">
        {(["ALL", "PENDING", "ACCEPTED", "REJECTED"] as const).map((tab) => {
          const count = tab === "ALL" ? applications.length : applications.filter((a) => a.status === tab).length;
          const active = filter === tab;
          return (
            <button
              key={tab}
              onClick={() => {
                setFilter(tab);
                setCurrentPage(1);
              }}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                active
                  ? "bg-[#171B21] text-white shadow-md"
                  : "text-[#5B6472] hover:bg-[#FAF8F5] hover:text-[#171B21]"
              }`}
            >
              <span>{tab === "ALL" ? "All Applications" : tab}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] ${
                  active ? "bg-[#E8912B] text-white" : "bg-[#EFECE6] text-[#5B6472]"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Applications Table View */}
      <div className="overflow-hidden rounded-3xl border border-[#E5E0D8] bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-[#1E2026]">
            <thead className="bg-[#FAF8F5] text-xs font-bold uppercase tracking-wider text-[#6B7280]">
              <tr>
                <th scope="col" className="px-6 py-4">Applicant</th>
                <th scope="col" className="px-6 py-4">Experience & Rate</th>
                <th scope="col" className="px-6 py-4">Skills & Location</th>
                <th scope="col" className="px-6 py-4">Applied Date</th>
                <th scope="col" className="px-6 py-4">Status</th>
                <th scope="col" className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E0D8]/60">
              {paginatedApplications.map((app) => (
                <tr key={app.id} className="transition-colors hover:bg-[#FAF8F5]/60">
                  {/* Applicant Details */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] font-bold text-[#5B6472]">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-bold text-[#1E2026] text-sm">{app.user.name}</div>
                        <div className="text-xs text-[#6B7280]">{app.user.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* Experience & Rate */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col text-xs space-y-1">
                      <span className="font-semibold text-[#1E2026] flex items-center gap-1">
                        <Briefcase className="h-3.5 w-3.5 text-[#D97706]" />
                        {app.experience} Years Experience
                      </span>
                      <span className="font-bold text-emerald-600 flex items-center gap-1">
                        <DollarSign className="h-3.5 w-3.5" />
                        ${app.hourlyRate} / hour
                      </span>
                    </div>
                  </td>

                  {/* Skills & Location */}
                  <td className="px-6 py-4">
                    <div className="space-y-1.5 max-w-xs">
                      {app.skills && app.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {app.skills.slice(0, 3).map((skill, idx) => (
                            <span
                              key={idx}
                              className="rounded-md bg-[#FAF8F5] border border-[#E5E0D8] px-2 py-0.5 text-[11px] font-semibold text-[#1E2026]"
                            >
                              {skill}
                            </span>
                          ))}
                          {app.skills.length > 3 && (
                            <span className="text-[10px] text-[#6B7280] font-bold self-center">
                              +{app.skills.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                      {app.location && (
                        <div className="flex items-center gap-1 text-xs text-[#6B7280]">
                          <MapPin className="h-3.5 w-3.5 text-red-500 shrink-0" />
                          <span className="truncate">{app.location}</span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Applied Date */}
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-[#9CA3AF]">
                    {new Date(app.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>

                  {/* Status Badge */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {app.status === "PENDING" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-bold text-amber-800">
                        <Clock className="h-3.5 w-3.5 text-amber-600 animate-pulse" />
                        Pending
                      </span>
                    )}
                    {app.status === "ACCEPTED" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        Approved
                      </span>
                    )}
                    {app.status === "REJECTED" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 border border-red-200 px-3 py-1 text-xs font-bold text-red-800">
                        <XCircle className="h-3.5 w-3.5 text-red-600" />
                        Rejected
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      {app.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(app.id, "REJECTED")}
                            disabled={loadingId === app.id}
                            className="flex items-center gap-1 rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            Reject
                          </button>

                          <button
                            onClick={() => handleStatusUpdate(app.id, "ACCEPTED")}
                            disabled={loadingId === app.id}
                            className="flex items-center gap-1 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-md transition-all hover:bg-emerald-700 disabled:opacity-50"
                          >
                            {loadingId === app.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            )}
                            Accept & Upgrade
                          </button>
                        </>
                      )}

                      {app.status === "ACCEPTED" && (
                        <button
                          onClick={() => handleStatusUpdate(app.id, "REJECTED")}
                          disabled={loadingId === app.id}
                          className="text-xs font-semibold text-red-600 hover:underline"
                        >
                          Revoke Approval
                        </button>
                      )}

                      {app.status === "REJECTED" && (
                        <button
                          onClick={() => handleStatusUpdate(app.id, "ACCEPTED")}
                          disabled={loadingId === app.id}
                          className="flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700"
                        >
                          Re-approve
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#6B7280]">
                    <div className="flex flex-col items-center justify-center">
                      <Wrench className="h-8 w-8 text-[#9CA3AF]" />
                      <p className="mt-2 text-sm font-bold text-[#1E2026]">No applications found</p>
                      <p className="mt-0.5 text-xs text-[#6B7280]">
                        There are currently no technician applications matching this status filter.
                      </p>
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
            totalItems={filtered.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      </div>
    </div>
  );
}
