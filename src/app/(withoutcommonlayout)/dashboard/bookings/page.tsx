import { getBookingsAction } from "@/src/actions/booking.actions";
import { getMeAction } from "@/src/actions/auth.actions";
import BookingList from "@/src/components/modules/admin/BookingList";

export default async function AdminBookingsPage() {
  const [bookingsRes, userRes] = await Promise.all([
    getBookingsAction(),
    getMeAction(),
  ]);

  const bookings = bookingsRes?.success ? bookingsRes.data : [];
  const userRole = userRes?.success ? userRes.data?.role : null;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1E2026]">
            Bookings Management
          </h1>
          <p className="text-sm text-[#6B7280]">
            Monitor schedules, view client requests, modify statuses, and manage bookings across the system
          </p>
        </div>
      </div>

      {/* Bookings Table Component */}
      <BookingList initialBookings={bookings} userRole={userRole} />
    </div>
  );
}
