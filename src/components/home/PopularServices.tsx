"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Wrench, Clock, X, Loader2, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { createBookingAction } from "@/src/actions/booking.actions";

interface PopularServicesProps {
  services: any[];
  isLoggedIn: boolean;
  currentUser: any;
}

export default function PopularServices({
  services,
  isLoggedIn,
  currentUser,
}: PopularServicesProps) {
  const router = useRouter();
  const [bookingService, setBookingService] = useState<any | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingMessage, setBookingMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleBookingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!bookingService) return;

    setBookingLoading(true);
    setBookingMessage(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      serviceId: bookingService.id,
      scheduledAt: formData.get("scheduledAt") as string,
      address: formData.get("address") as string,
      note: formData.get("note") as string || undefined,
    };

    const res = await createBookingAction(payload);
    setBookingLoading(false);

    if (res.success) {
      setBookingMessage({ type: "success", text: res.message });
      setTimeout(() => {
        setBookingService(null);
        setBookingMessage(null);
        router.push("/dashboard/bookings");
      }, 1500);
    } else {
      setBookingMessage({ type: "error", text: res.message });
    }
  };

  const displayServices = services.slice(0, 6);

  return (
    <section className="bg-white py-16 border-b border-[#E7E2D8]/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2
              className="text-2xl font-bold tracking-tight text-[#1E2026]"
              style={{ fontFamily: "'Space Grotesk', ui-sans-serif, system-ui" }}
            >
              Popular Services
            </h2>
            <p className="mt-2 text-sm text-[#6B7280]">
              Handpicked professional home services highly requested by our customers
            </p>
          </div>

          <Link
            href="/services"
            className="flex items-center gap-1 text-sm font-bold text-[#B45309] hover:underline"
          >
            Explore All Services <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Services Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayServices.map((service) => (
            <div
              key={service.id}
              className="group flex flex-col justify-between rounded-2xl border border-[#E7E2D8] bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#D97706]/40 hover:shadow-lg hover:shadow-[#D97706]/5"
            >
              <div>
                {/* Category Tag */}
                <div className="mb-4 flex items-center justify-between">
                  <span className="inline-flex items-center rounded-full bg-[#D97706]/10 px-2.5 py-0.5 text-xs font-bold text-[#B45309]">
                    {service.category?.name || "Service"}
                  </span>
                  {service.durationMins && (
                    <span className="flex items-center gap-1 text-xs text-[#6B7280]">
                      <Clock className="h-3.5 w-3.5" /> {service.durationMins} mins
                    </span>
                  )}
                </div>

                {/* Title & Desc */}
                <h3 className="text-md font-bold text-[#1E2026] line-clamp-1 group-hover:text-[#B45309] transition-colors">
                  <Link href={`/services/${service.id}`} className="hover:underline">
                    {service.title}
                  </Link>
                </h3>
                <p className="mt-2 text-xs text-[#6B7280] line-clamp-3 min-h-[48px]">
                  {service.description || "No service details provided."}
                </p>

                {/* Technician Info */}
                <div className="mt-4 rounded-xl bg-[#FAF8F5] p-3 border border-[#E7E2D8]/60 space-y-1.5 text-left">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#4B5563]">
                    <Wrench className="h-3.5 w-3.5 text-[#D97706]" />
                    <span>{service.technician?.user?.name || "Verified Provider"}</span>
                  </div>
                  {service.technician?.location && (
                    <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span>{service.technician.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer and Booking Button */}
              <div className="mt-5 pt-4 border-t border-[#E7E2D8]/60 flex items-center justify-between">
                <span className="text-xl font-extrabold text-[#1E2026]">${service.price}</span>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/services/${service.id}`}
                    className="rounded-xl border border-[#E7E2D8] bg-white px-3.5 py-2 text-xs font-bold text-[#4B5563] transition-all hover:bg-[#FAF8F5] hover:text-[#1E2026] shadow-xs"
                  >
                    Details
                  </Link>
                  <button
                    onClick={() => setBookingService(service)}
                    className="rounded-xl bg-[#171B21] hover:bg-[#E8912B] hover:text-[#171B21] px-3.5 py-2 text-xs font-bold text-white transition-all shadow-sm"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {displayServices.length === 0 && (
          <p className="text-center text-[#6B7280] py-8 italic">No services available</p>
        )}
      </div>

      {/* Booking Form Modal */}
      {bookingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl border border-[#E7E2D8] bg-white p-6 shadow-2xl animate-in fade-in-50 zoom-in-95 text-left">
            <button
              onClick={() => {
                setBookingService(null);
                setBookingMessage(null);
              }}
              className="absolute right-4 top-4 text-[#9CA3AF] hover:text-[#1E2026]"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-[#E7E2D8] pb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D97706]/10 text-[#D97706]">
                <Calendar className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-[#1E2026]">Book Service</h3>
                <p className="text-xs text-[#6B7280]">Schedule slot and specify location details</p>
              </div>
            </div>

            {bookingMessage && (
              <div
                className={`mt-4 flex items-center gap-2 rounded-xl p-3 text-xs font-semibold ${
                  bookingMessage.type === "success"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {bookingMessage.type === "success" ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 shrink-0" />
                )}
                <span>{bookingMessage.text}</span>
              </div>
            )}

            {!isLoggedIn ? (
              <div className="mt-6 text-center space-y-4 py-4">
                <AlertCircle className="mx-auto h-12 w-12 text-[#D97706]" />
                <h4 className="text-md font-bold text-[#1E2026]">Login Required</h4>
                <p className="text-xs text-[#6B7280]">
                  You must be logged in as a Customer to book a professional service.
                </p>
                <button
                  onClick={() => router.push(`/login?redirect=/`)}
                  className="w-full rounded-xl bg-[#171B21] hover:bg-[#2A303B] py-3 text-xs font-bold text-white transition-colors"
                >
                  Log In Now
                </button>
              </div>
            ) : currentUser?.role !== "CUSTOMER" ? (
              <div className="mt-6 text-center space-y-4 py-4">
                <AlertCircle className="mx-auto h-12 w-12 text-[#EF4444]" />
                <h4 className="text-md font-bold text-[#1E2026]">Account Restriction</h4>
                <p className="text-xs text-[#6B7280]">
                  Only Customer accounts can book services. You are currently logged in as a {currentUser?.role}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4B5563]">
                    Selected Service
                  </label>
                  <div className="mt-1.5 flex justify-between items-center rounded-xl border border-[#E7E2D8] bg-[#FAF8F5] px-3.5 py-2.5">
                    <div>
                      <div className="text-sm font-bold text-[#1E2026]">{bookingService.title}</div>
                      <div className="text-xs text-[#6B7280]">Provider: {bookingService.technician?.user?.name}</div>
                    </div>
                    <div className="text-md font-extrabold text-[#D97706]">${bookingService.price}</div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4B5563]">
                    Preferred Schedule *
                  </label>
                  <input
                    type="datetime-local"
                    name="scheduledAt"
                    required
                    className="mt-1.5 w-full rounded-xl border border-[#E7E2D8] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#1E2026] outline-none focus:border-[#D97706]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4B5563]">
                    Service Address *
                  </label>
                  <textarea
                    name="address"
                    required
                    rows={2}
                    placeholder="Enter full address for the home service appointment..."
                    className="mt-1.5 w-full rounded-xl border border-[#E7E2D8] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#1E2026] outline-none focus:border-[#D97706]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4B5563]">
                    Special Instructions / Note
                  </label>
                  <textarea
                    name="note"
                    rows={2}
                    placeholder="Add optional notes or descriptions of requirements..."
                    className="mt-1.5 w-full rounded-xl border border-[#E7E2D8] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#1E2026] outline-none focus:border-[#D97706]"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setBookingService(null);
                      setBookingMessage(null);
                    }}
                    className="rounded-xl px-4 py-2 text-sm font-semibold text-[#6B7280] hover:bg-[#FAF8F5]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="flex items-center gap-2 rounded-xl bg-[#D97706] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#B45309] disabled:opacity-50"
                  >
                    {bookingLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Booking...
                      </>
                    ) : (
                      "Confirm Booking"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
