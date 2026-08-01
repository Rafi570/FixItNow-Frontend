"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Wrench,
  Clock,
  ArrowLeft,
  Star,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Mail,
  User,
} from "lucide-react";
import { createBookingAction } from "@/src/actions/booking.actions";

interface ServiceDetailsProps {
  service: any;
  reviews: any[];
  isLoggedIn: boolean;
  currentUser: any;
}

export default function ServiceDetails({
  service,
  reviews,
  isLoggedIn,
  currentUser,
}: ServiceDetailsProps) {
  const router = useRouter();
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingMessage, setBookingMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleBookingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBookingLoading(true);
    setBookingMessage(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      serviceId: service.id,
      scheduledAt: formData.get("scheduledAt") as string,
      address: formData.get("address") as string,
      note: formData.get("note") as string || undefined,
    };

    const res = await createBookingAction(payload);
    setBookingLoading(false);

    if (res.success) {
      setBookingMessage({ type: "success", text: res.message });
      setTimeout(() => {
        router.push("/dashboard/bookings");
      }, 1500);
    } else {
      setBookingMessage({ type: "error", text: res.message });
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#FAF8F5]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back Button */}
      <Link
        href="/services"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#6B7280] hover:text-[#1E2026] mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Services
      </Link>

      {/* Top Main Section */}
      <div className="mb-8 rounded-2xl bg-gradient-to-r from-[#171B21] to-[#2A303B] p-8 text-white shadow-xs">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="inline-flex items-center rounded-full bg-[#D97706]/20 px-3 py-1 text-xs font-bold text-[#FBBF24]">
              {service.category?.name || "Service Category"}
            </span>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight">{service.title}</h1>
            <p className="mt-2 text-sm text-gray-300">
              Provided by certified local technicians and backed by FixNow satisfaction guarantee
            </p>
          </div>
          <div className="text-left md:text-right shrink-0">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Pricing</span>
            <div className="text-4xl font-extrabold text-[#FBBF24] mt-1">${service.price}</div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Columns - Details and Reviews Table */}
        <div className="lg:col-span-2 space-y-8">
          {/* Details Card */}
          <div className="rounded-2xl border border-[#E7E2D8] bg-white p-6 shadow-xs">
            <h2 className="text-xl font-bold text-[#1E2026] mb-4">Service Overview</h2>
            <p className="text-[#4B5563] text-sm leading-relaxed whitespace-pre-line">
              {service.description || "No service details provided."}
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-xl bg-[#FAF8F5] p-3.5 border border-[#E7E2D8]/60">
                <Clock className="h-5 w-5 text-[#D97706]" />
                <div>
                  <div className="text-xs text-[#6B7280]">Est. Duration</div>
                  <div className="text-sm font-bold text-[#1E2026]">
                    {service.durationMins ? `${service.durationMins} minutes` : "Variable"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-[#FAF8F5] p-3.5 border border-[#E7E2D8]/60">
                <MapPin className="h-5 w-5 text-[#D97706]" />
                <div>
                  <div className="text-xs text-[#6B7280]">Provider Location</div>
                  <div className="text-sm font-bold text-[#1E2026]">
                    {service.technician?.location || "Not specified"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Technician Profile Card */}
          <div className="rounded-2xl border border-[#E7E2D8] bg-white p-6 shadow-xs">
            <h2 className="text-xl font-bold text-[#1E2026] mb-4">Technician Details</h2>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D97706]/10 text-[#D97706]">
                  <Wrench className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1E2026]">
                    {service.technician?.user?.name || "Verified Professional"}
                  </h3>
                  <div className="flex items-center gap-4 mt-1 text-xs text-[#6B7280]">
                    <span className="flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5" />
                      {service.technician?.user?.email || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 divide-x divide-[#E7E2D8] text-center bg-[#FAF8F5] p-4 rounded-xl border border-[#E7E2D8]/60">
                <div className="px-3">
                  <div className="text-xs text-[#6B7280]">Rating Avg</div>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-bold text-[#1E2026]">
                      {service.technician?.ratingAvg ? Number(service.technician.ratingAvg).toFixed(1) : "0.0"}
                    </span>
                  </div>
                </div>
                <div className="px-3 pl-6">
                  <div className="text-xs text-[#6B7280]">Total Reviews</div>
                  <div className="mt-1 text-sm font-bold text-[#1E2026]">
                    {service.technician?.totalReviews || 0} reviews
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Table Card */}
          <div className="rounded-2xl border border-[#E7E2D8] bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#E7E2D8] pb-4 mb-4">
              <h2 className="text-xl font-bold text-[#1E2026]">Service Reviews</h2>
              <span className="rounded-full bg-[#FAF8F5] border border-[#E7E2D8] px-2.5 py-1 text-xs font-semibold text-[#4B5563]">
                {reviews.length} total reviews
              </span>
            </div>

            {reviews.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-[#E7E2D8] bg-white">
                <table className="w-full border-collapse text-left text-sm text-[#1E2026]">
                  <thead className="bg-[#FAF8F5] text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                    <tr>
                      <th scope="col" className="px-6 py-4">Customer</th>
                      <th scope="col" className="px-6 py-4">Rating</th>
                      <th scope="col" className="px-6 py-4">Review Comment</th>
                      <th scope="col" className="px-6 py-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E7E2D8]/60">
                    {reviews.map((review) => (
                      <tr key={review.id} className="hover:bg-[#FAF8F5]/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                              <User className="h-4 w-4" />
                            </span>
                            <div>
                              <div className="font-bold text-[#1E2026]">
                                {review.customer?.name || "Anonymous"}
                              </div>
                              <div className="text-[10px] text-[#6B7280]">
                                {review.customer?.email || ""}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/60 rounded-lg px-2 py-1 max-w-fit">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            <span className="text-xs font-bold text-amber-800">
                              {review.rating}/5
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs text-[#4B5563] italic whitespace-normal max-w-md">
                            "{review.comment || "No comment left."}"
                          </p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-[#6B7280]">
                          {new Date(review.createdAt).toLocaleDateString("en-US", {
                            dateStyle: "medium",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-[#E7E2D8] bg-[#FAF8F5]/50 py-12 text-center">
                <Star className="mx-auto h-8 w-8 text-[#9CA3AF]" />
                <h3 className="mt-3 text-sm font-bold text-[#1E2026]">No reviews yet</h3>
                <p className="mt-1 text-xs text-[#6B7280]">
                  Be the first one to book and leave a review for this service!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Booking Form */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 rounded-2xl border border-[#E7E2D8] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 border-b border-[#E7E2D8] pb-4 mb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D97706]/10 text-[#D97706]">
                <Calendar className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-[#1E2026]">Book This Service</h3>
                <p className="text-xs text-[#6B7280]">Confirm slot and service address</p>
              </div>
            </div>

            {bookingMessage && (
              <div
                className={`mb-4 flex items-center gap-2 rounded-xl p-3 text-xs font-semibold ${
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
              <div className="text-center space-y-4 py-4">
                <AlertCircle className="mx-auto h-12 w-12 text-[#D97706]" />
                <h4 className="text-md font-bold text-[#1E2026]">Login Required</h4>
                <p className="text-xs text-[#6B7280]">
                  You must be logged in as a Customer to book a professional service.
                </p>
                <button
                  onClick={() => router.push(`/login?redirect=/services/${service.id}`)}
                  className="w-full rounded-xl bg-[#171B21] hover:bg-[#2A303B] py-3 text-xs font-bold text-white transition-colors"
                >
                  Log In Now
                </button>
              </div>
            ) : currentUser?.role !== "CUSTOMER" ? (
              <div className="text-center space-y-4 py-4">
                <AlertCircle className="mx-auto h-12 w-12 text-[#EF4444]" />
                <h4 className="text-md font-bold text-[#1E2026]">Account Restriction</h4>
                <p className="text-xs text-[#6B7280]">
                  Only Customer accounts can book services. You are currently logged in as a {currentUser?.role}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4B5563]">
                    Preferred Schedule *
                  </label>
                  <input
                    type="datetime-local"
                    name="scheduledAt"
                    required
                    className="mt-1.5 w-full rounded-xl border border-[#E7E2D8] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#1E2026] outline-none focus:border-[#D97706] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4B5563]">
                    Service Address *
                  </label>
                  <textarea
                    name="address"
                    required
                    rows={3}
                    placeholder="Enter full address for the home service appointment..."
                    className="mt-1.5 w-full rounded-xl border border-[#E7E2D8] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#1E2026] outline-none focus:border-[#D97706] transition-colors resize-none"
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
                    className="mt-1.5 w-full rounded-xl border border-[#E7E2D8] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#1E2026] outline-none focus:border-[#D97706] transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#D97706] py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#B45309] disabled:opacity-50"
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
              </form>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
