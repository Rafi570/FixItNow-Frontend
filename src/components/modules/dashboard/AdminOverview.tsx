"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getUsersAction, getTechniciansAction } from "../../../actions/admin.actions";
import { getServicesAction } from "../../../actions/service.actions";
import { getBookingsAction } from "../../../actions/booking.actions";
import { Calendar, Users, Wrench, Grid, DollarSign, Loader2, ArrowRight } from "lucide-react";

interface AdminOverviewProps {
  user: any;
}

export default function AdminOverview({ user }: AdminOverviewProps) {
  const [stats, setStats] = useState({
    usersCount: 0,
    techniciansCount: 0,
    servicesCount: 0,
    bookingsCount: 0,
    systemRevenue: 0,
  });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const [usersRes, techRes, servicesRes, bookingsRes] = await Promise.all([
          getUsersAction(),
          getTechniciansAction(),
          getServicesAction(),
          getBookingsAction(),
        ]);

        const users = usersRes?.success ? usersRes.data : [];
        const technicians = techRes?.success ? techRes.data : [];
        const services = servicesRes?.success ? servicesRes.data : [];
        const bookings = bookingsRes?.success ? bookingsRes.data : [];

        const revenue = bookings
          .filter((b: any) => b.status === "PAID" || b.status === "COMPLETED")
          .reduce((sum: number, b: any) => sum + Number(b.price || 0), 0);

        setStats({
          usersCount: users.length,
          techniciansCount: technicians.length,
          servicesCount: services.length,
          bookingsCount: bookings.length,
          systemRevenue: revenue,
        });

        setRecentBookings(bookings.slice(0, 5));
      } catch (error) {
        console.error("Failed to load admin stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#D97706]" />
      </div>
    );
  }

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
        <h1 className="text-2xl font-extrabold tracking-tight">System Admin Console</h1>
        <p className="mt-2 text-sm text-gray-300">
          Hello {user.name}. You have full access to system-wide bookings, categories, user roles, and service management.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {/* Total System Revenue */}
        <div className="rounded-2xl border border-[#E7E2D8] bg-white p-5 shadow-xs flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 shrink-0">
            <DollarSign className="h-5.5 w-5.5" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Total Revenue</div>
            <div className="text-xl font-extrabold text-[#1E2026] mt-0.5">${stats.systemRevenue.toFixed(2)}</div>
          </div>
        </div>

        {/* Total System Bookings */}
        <div className="rounded-2xl border border-[#E7E2D8] bg-white p-5 shadow-xs flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
            <Calendar className="h-5.5 w-5.5" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">All Bookings</div>
            <div className="text-xl font-extrabold text-[#1E2026] mt-0.5">{stats.bookingsCount}</div>
          </div>
        </div>

        {/* Total Registered Users */}
        <div className="rounded-2xl border border-[#E7E2D8] bg-white p-5 shadow-xs flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 shrink-0">
            <Users className="h-5.5 w-5.5" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Total Users</div>
            <div className="text-xl font-extrabold text-[#1E2026] mt-0.5">{stats.usersCount}</div>
          </div>
        </div>

        {/* Total Technicians */}
        <div className="rounded-2xl border border-[#E7E2D8] bg-white p-5 shadow-xs flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100 shrink-0">
            <Wrench className="h-5.5 w-5.5" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Technicians</div>
            <div className="text-xl font-extrabold text-[#1E2026] mt-0.5">{stats.techniciansCount}</div>
          </div>
        </div>

        {/* Total Services */}
        <div className="rounded-2xl border border-[#E7E2D8] bg-white p-5 shadow-xs flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600 border border-teal-100 shrink-0">
            <Grid className="h-5.5 w-5.5" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Services</div>
            <div className="text-xl font-extrabold text-[#1E2026] mt-0.5">{stats.servicesCount}</div>
          </div>
        </div>
      </div>

      {/* Recent System Bookings Section */}
      <div className="rounded-2xl border border-[#E7E2D8] bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#E7E2D8] pb-4 mb-4">
          <h2 className="text-lg font-bold text-[#1E2026]">Recent System Bookings</h2>
          <Link
            href="/dashboard/bookings"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#D97706] hover:underline"
          >
            Manage Bookings <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {recentBookings.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-[#E7E2D8] bg-white">
            <table className="w-full border-collapse text-left text-sm text-[#1E2026]">
              <thead className="bg-[#FAF8F5] text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                <tr>
                  <th scope="col" className="px-6 py-4">Service</th>
                  <th scope="col" className="px-6 py-4">Customer</th>
                  <th scope="col" className="px-6 py-4">Provider</th>
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
                      <div className="font-semibold text-[#1E2026]">
                        {booking.customer?.name || "N/A"}
                      </div>
                      <div className="text-[10px] text-[#6B7280]">
                        {booking.customer?.email || ""}
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
            <h3 className="mt-3 text-sm font-bold text-[#1E2026]">No system bookings</h3>
            <p className="mt-1 text-xs text-[#6B7280]">
              There are no service bookings logged in the system.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
