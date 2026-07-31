"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getBookingsAction } from "@/src/actions/booking.actions";
import { Calendar, CheckCircle2, Clock, DollarSign, Loader2, ArrowRight } from "lucide-react";

interface TechnicianOverviewProps {
  user: any;
}

export default function TechnicianOverview({ user }: TechnicianOverviewProps) {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      const res = await getBookingsAction();
      if (res.success && res.data) {
        setBookings(res.data);
      }
      setLoading(false);
    };
    fetchBookings();
  }, []);

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
      <div className="rounded-2xl bg-gradient-to-r from-[#171B21] to-[#2A303B] p-8 text-white shadow-xs">
        <h1 className="text-2xl font-extrabold tracking-tight">Welcome back, Expert {user.name}!</h1>
        <p className="mt-2 text-sm text-gray-300">
          Monitor your assigned service bookings, accept requested appointments, and track your total earnings.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
    </div>
  );
}
