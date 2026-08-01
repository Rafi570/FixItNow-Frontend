"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getBookingsAction } from "@/src/actions/booking.actions";
import { getMyTechnicianApplicationAction } from "@/src/actions/technicianApplication.actions";
import { Calendar, CheckCircle2, Clock, DollarSign, Loader2, ArrowRight, Wrench, Sparkles } from "lucide-react";

interface CustomerOverviewProps {
  user: any;
}

export default function CustomerOverview({ user }: CustomerOverviewProps) {
  const [bookings, setBookings] = useState<any[]>([]);
  const [appStatus, setAppStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getBookingsAction();
      if (res.success && res.data) {
        setBookings(res.data);
      }
      const appRes = await getMyTechnicianApplicationAction();
      if (appRes.success && appRes.data) {
        setAppStatus(appRes.data.status);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#D97706]" />
      </div>
    );
  }

  // Calculate statistics
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(
    (b) => b.status === "REQUESTED" || b.status === "ACCEPTED"
  ).length;
  const completedBookings = bookings.filter((b) => b.status === "COMPLETED").length;
  
  const totalSpent = bookings
    .filter((b) => b.status === "PAID" || b.status === "COMPLETED")
    .reduce((sum, b) => sum + Number(b.price || 0), 0);

  const recentBookings = bookings.slice(0, 5);

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
        <h1 className="text-2xl font-extrabold tracking-tight">Welcome, {user.name}!</h1>
        <p className="mt-2 text-sm text-gray-300">
          Manage your scheduled appointments, view invoices, and track booking reviews here.
        </p>
      </div>

      {/* Technician Application Status Banner */}
      {appStatus === "PENDING" && (
        <div className="flex items-center justify-between rounded-2xl border border-amber-300 bg-amber-50 p-5 shadow-xs text-amber-900">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-200/60 text-amber-800">
              <Clock className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <p className="font-bold text-sm">Technician Application Pending</p>
              <p className="text-xs text-amber-700 mt-0.5">
                Your application to become a verified technician is currently under review by the Admin team.
              </p>
            </div>
          </div>
          <span className="rounded-full bg-amber-200/80 px-3 py-1 text-xs font-bold text-amber-900 hidden sm:inline-block">
            In Review
          </span>
        </div>
      )}

      {appStatus === "ACCEPTED" && (
        <div className="flex items-center justify-between rounded-2xl border border-emerald-300 bg-emerald-50 p-5 shadow-xs text-emerald-900">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-200/60 text-emerald-800">
              <Sparkles className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="font-bold text-sm">🎉 Application Approved!</p>
              <p className="text-xs text-emerald-700 mt-0.5">
                Congratulations! Your Technician application has been accepted. Please refresh or re-login to access your Technician Portal.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard"
            className="rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-800 transition-colors"
          >
            Access Portal
          </Link>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Spent */}
        <div className="rounded-2xl border border-[#E7E2D8] bg-white p-6 shadow-xs flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs text-[#6B7280]">Total Spent</div>
            <div className="text-2xl font-extrabold text-[#1E2026] mt-0.5">${totalSpent.toFixed(2)}</div>
          </div>
        </div>

        {/* Total Bookings */}
        <div className="rounded-2xl border border-[#E7E2D8] bg-white p-6 shadow-xs flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs text-[#6B7280]">Total Bookings</div>
            <div className="text-2xl font-extrabold text-[#1E2026] mt-0.5">{totalBookings}</div>
          </div>
        </div>

        {/* Pending Bookings */}
        <div className="rounded-2xl border border-[#E7E2D8] bg-white p-6 shadow-xs flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs text-[#6B7280]">Active Bookings</div>
            <div className="text-2xl font-extrabold text-[#1E2026] mt-0.5">{pendingBookings}</div>
          </div>
        </div>

        {/* Completed Bookings */}
        <div className="rounded-2xl border border-[#E7E2D8] bg-white p-6 shadow-xs flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600 border border-green-100">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs text-[#6B7280]">Completed Jobs</div>
            <div className="text-2xl font-extrabold text-[#1E2026] mt-0.5">{completedBookings}</div>
          </div>
        </div>
      </div>

      {/* Recent Bookings Section */}
      <div className="rounded-2xl border border-[#E7E2D8] bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#E7E2D8] pb-4 mb-4">
          <h2 className="text-lg font-bold text-[#1E2026]">Recent Bookings</h2>
          <Link
            href="/dashboard/bookings"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#D97706] hover:underline"
          >
            All Bookings <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {recentBookings.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-[#E7E2D8] bg-white">
            <table className="w-full border-collapse text-left text-sm text-[#1E2026]">
              <thead className="bg-[#FAF8F5] text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                <tr>
                  <th scope="col" className="px-6 py-4">Service</th>
                  <th scope="col" className="px-6 py-4">Technician</th>
                  <th scope="col" className="px-6 py-4">Scheduled Date</th>
                  <th scope="col" className="px-6 py-4">Price</th>
                  <th scope="col" className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E2D8]/60">
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-[#FAF8F5]/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-[#1E2026]">
                        {booking.service?.title || "Deleted Service"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xs text-[#4B5563]">
                        {booking.technician?.user?.name || "N/A"}
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
            <h3 className="mt-3 text-sm font-bold text-[#1E2026]">No bookings found</h3>
            <p className="mt-1 text-xs text-[#6B7280]">
              You haven't booked any home service appointments yet.
            </p>
            <Link
              href="/services"
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] px-4 py-2 text-xs font-bold text-white transition-colors"
            >
              Explore Services
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
