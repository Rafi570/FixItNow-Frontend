"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { getBookingsAction } from "@/src/actions/booking.actions";
import { getCategories } from "@/src/actions/category.actions";
import { createTechnicianServiceAction } from "@/src/actions/service.actions";
import { Calendar, CheckCircle2, Clock, DollarSign, Loader2, ArrowRight, Plus, Wrench, X, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface TechnicianOverviewProps {
  user: any;
}

export default function TechnicianOverview({ user }: TechnicianOverviewProps) {
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [bookingsRes, categoriesRes] = await Promise.all([
        getBookingsAction(),
        getCategories(),
      ]);

      if (bookingsRes.success && bookingsRes.data) {
        setBookings(bookingsRes.data);
      }

      if (categoriesRes.success && categoriesRes.data) {
        setCategories(categoriesRes.data);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const handleCreateService = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));
    const durationMins = formData.get("durationMins") ? Number(formData.get("durationMins")) : undefined;
    const categoryId = formData.get("categoryId") as string;

    const res = await createTechnicianServiceAction({
      title,
      description,
      price,
      durationMins,
      categoryId,
    });

    setSubmitting(false);

    if (res.success) {
      setMessage({ type: "success", text: res.message || "Service added successfully!" });
      setTimeout(() => {
        setIsAddServiceOpen(false);
        setMessage(null);
        router.refresh();
      }, 1500);
    } else {
      setMessage({ type: "error", text: res.message || "Failed to add service" });
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#D97706]" />
      </div>
    );
  }

  // Calculate statistics
  const totalJobs = bookings.length;
  const pendingJobs = bookings.filter((b) => b.status === "REQUESTED").length;
  const completedJobs = bookings.filter((b) => b.status === "COMPLETED").length;
  const totalEarnings = bookings
    .filter((b) => b.status === "PAID" || b.status === "COMPLETED")
    .reduce((sum, b) => sum + Number(b.price || 0), 0);

  const recentJobs = bookings.slice(0, 5);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      REQUESTED: "bg-blue-50 text-blue-700 border-blue-200",
      ACCEPTED: "bg-amber-50 text-amber-700 border-amber-200",
      PAID: "bg-emerald-50 text-emerald-700 border-emerald-200",
      COMPLETED: "bg-green-50 text-green-700 border-green-200",
      DECLINED: "bg-red-50 text-red-700 border-red-200",
      CANCELLED: "bg-gray-50 text-gray-700 border-gray-200",
    };
    return (
      <span
        className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-semibold ${
          styles[status] || "bg-gray-50 text-gray-700 border-gray-200"
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#171B21] to-[#2A303B] p-6 sm:p-8 text-white shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Verified Technician Active
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-2">Welcome back, Expert {user.name}!</h1>
          <p className="mt-1 text-xs sm:text-sm text-gray-300">
            Monitor assigned bookings, accept requested appointments, or add new services under Admin categories.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
          <Link
            href="/dashboard/my-services"
            className="flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 sm:py-3 text-xs font-bold text-white shadow-lg backdrop-blur-xs transition-all hover:bg-white/20 active:scale-[0.98]"
          >
            <Wrench className="h-4 w-4 text-[#E8912B]" />
            My Services
          </Link>
          <button
            onClick={() => setIsAddServiceOpen(true)}
            className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#E8912B] px-5 py-2.5 sm:py-3 text-xs font-bold text-white shadow-lg transition-all hover:bg-[#d47f1e] active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            Add Service
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Earnings */}
        <div className="rounded-2xl border border-[#E7E2D8] bg-white p-6 shadow-xs flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs text-[#6B7280]">Total Earnings</div>
            <div className="text-2xl font-extrabold text-[#1E2026] mt-0.5">${totalEarnings.toFixed(2)}</div>
          </div>
        </div>

        {/* Total Jobs Assigned */}
        <div className="rounded-2xl border border-[#E7E2D8] bg-white p-6 shadow-xs flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs text-[#6B7280]">Total Jobs</div>
            <div className="text-2xl font-extrabold text-[#1E2026] mt-0.5">{totalJobs}</div>
          </div>
        </div>

        {/* Pending Jobs */}
        <div className="rounded-2xl border border-[#E7E2D8] bg-white p-6 shadow-xs flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs text-[#6B7280]">Pending Requests</div>
            <div className="text-2xl font-extrabold text-[#1E2026] mt-0.5">{pendingJobs}</div>
          </div>
        </div>

        {/* Completed Jobs */}
        <div className="rounded-2xl border border-[#E7E2D8] bg-white p-6 shadow-xs flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600 border border-green-100">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs text-[#6B7280]">Jobs Completed</div>
            <div className="text-2xl font-extrabold text-[#1E2026] mt-0.5">{completedJobs}</div>
          </div>
        </div>
      </div>

      {/* Recent Assigned Jobs Section */}
      <div className="rounded-2xl border border-[#E7E2D8] bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#E7E2D8] pb-4 mb-4">
          <h2 className="text-lg font-bold text-[#1E2026]">Recent Jobs</h2>
          <Link
            href="/dashboard/bookings"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#D97706] hover:underline"
          >
            All Bookings <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {recentJobs.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-[#E7E2D8] bg-white">
            <table className="w-full border-collapse text-left text-sm text-[#1E2026]">
              <thead className="bg-[#FAF8F5] text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                <tr>
                  <th scope="col" className="px-6 py-4">Service</th>
                  <th scope="col" className="px-6 py-4">Customer</th>
                  <th scope="col" className="px-6 py-4">Scheduled Date</th>
                  <th scope="col" className="px-6 py-4">Price</th>
                  <th scope="col" className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E2D8]/60">
                {recentJobs.map((booking) => (
                  <tr key={booking.id} className="hover:bg-[#FAF8F5]/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-[#1E2026]">
                        {booking.service?.title || "Deleted Service"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-[#1E2026]">
                        {booking.customer?.name || "N/A"}
                      </div>
                      <div className="text-[10px] text-[#6B7280]">
                        {booking.customer?.email || ""}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-[#6B7280]">
                      {new Date(booking.scheduledAt).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-[#1E2026]">
                      ${booking.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(booking.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-[#E7E2D8] bg-[#FAF8F5]/50 py-12 text-center">
            <Calendar className="mx-auto h-8 w-8 text-[#9CA3AF]" />
            <h3 className="mt-3 text-sm font-bold text-[#1E2026]">No jobs assigned yet</h3>
            <p className="mt-1 text-xs text-[#6B7280]">
              You don't have any bookings assigned to your services.
            </p>
          </div>
        )}
      </div>

      {/* Technician Add Service Modal */}
      {isAddServiceOpen && (
        <div
          onClick={() => setIsAddServiceOpen(false)}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative my-auto w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl border border-[#E7E2D8] bg-[#FBFAF7] p-6 shadow-2xl sm:p-8 animate-in zoom-in-95 duration-150"
          >
            <button
              onClick={() => setIsAddServiceOpen(false)}
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-[#EFECE6] text-[#5B6472] transition-colors hover:bg-[#E2DDD3] hover:text-[#171B21]"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-[#E5E0D8] pb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#171B21] text-[#E8912B]">
                <Wrench className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#171B21]">Add Service to Dashboard</h3>
                <p className="text-xs font-medium text-[#5B6472]">
                  Offer a new service under Admin Categories
                </p>
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
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5B6472]">
                  Service Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. AC Installation & Maintenance"
                  className="mt-1 w-full rounded-xl border border-[#E7E2D8] bg-white px-3.5 py-2.5 text-sm font-medium text-[#171B21] focus:border-[#E8912B] focus:outline-none focus:ring-1 focus:ring-[#E8912B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5B6472]">
                  Select Admin Category *
                </label>
                <select
                  name="categoryId"
                  required
                  defaultValue=""
                  className="mt-1 w-full rounded-xl border border-[#E7E2D8] bg-white px-3.5 py-2.5 text-sm font-semibold text-[#171B21] focus:border-[#E8912B] focus:outline-none focus:ring-1 focus:ring-[#E8912B]"
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
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#5B6472]">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    required
                    min="1"
                    placeholder="e.g. 50"
                    className="mt-1 w-full rounded-xl border border-[#E7E2D8] bg-white px-3.5 py-2.5 text-sm font-medium text-[#171B21] focus:border-[#E8912B] focus:outline-none focus:ring-1 focus:ring-[#E8912B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#5B6472]">
                    Duration (Mins)
                  </label>
                  <input
                    type="number"
                    name="durationMins"
                    placeholder="e.g. 60"
                    className="mt-1 w-full rounded-xl border border-[#E7E2D8] bg-white px-3.5 py-2.5 text-sm font-medium text-[#171B21] focus:border-[#E8912B] focus:outline-none focus:ring-1 focus:ring-[#E8912B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5B6472]">
                  Service Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Details of the service package offered..."
                  className="mt-1 w-full rounded-xl border border-[#E7E2D8] bg-white px-3.5 py-2.5 text-sm font-medium text-[#171B21] focus:border-[#E8912B] focus:outline-none focus:ring-1 focus:ring-[#E8912B]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#171B21] py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-[#2A303B] active:scale-[0.99] disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Publishing Service...
                    </>
                  ) : (
                    <>
                      <Wrench className="h-4 w-4 text-[#E8912B]" />
                      Publish Service to Platform
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
