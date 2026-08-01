"use client";

import { useState } from "react";
import { Pencil, Trash2, X, Loader2, CheckCircle2, AlertCircle, Search, Filter, Calendar, MapPin, Eye, FileText, User, Wrench } from "lucide-react";
import { updateAdminBookingStatusAction, deleteAdminBookingAction } from "@/src/actions/booking.actions";
import { createPaymentAction } from "@/src/actions/payment.actions";
import { createReviewAction, updateReviewAction, deleteReviewAction } from "@/src/actions/review.actions";
import Pagination from "@/src/components/share/Pagination";

interface BookingListProps {
  initialBookings: any[];
  userRole?: string | null;
}

const STATUS_OPTIONS = [
  "REQUESTED",
  "ACCEPTED",
  "DECLINED",
  "PAID",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
];

const getNextStatusOptions = (currentStatus: string) => {
  switch (currentStatus) {
    case "REQUESTED":
      return ["REQUESTED", "ACCEPTED", "DECLINED", "CANCELLED"];
    case "ACCEPTED":
      return ["ACCEPTED", "PAID", "DECLINED", "CANCELLED"];
    case "PAID":
      return ["PAID", "IN_PROGRESS", "CANCELLED"];
    case "IN_PROGRESS":
      return ["IN_PROGRESS", "COMPLETED", "CANCELLED"];
    case "COMPLETED":
      return ["COMPLETED"];
    case "DECLINED":
      return ["DECLINED"];
    case "CANCELLED":
      return ["CANCELLED"];
    default:
      return STATUS_OPTIONS;
  }
};

export default function BookingList({ initialBookings, userRole }: BookingListProps) {
  const [bookings, setBookings] = useState<any[]>(initialBookings);
  const [editBooking, setEditBooking] = useState<any | null>(null);
  const [deleteBookingId, setDeleteBookingId] = useState<string | null>(null);
  const [selectedBookingDetail, setSelectedBookingDetail] = useState<any | null>(null);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [reviewModal, setReviewModal] = useState<{
    bookingId: string;
    reviewId: string | null;
    rating: number;
    comment: string;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handlePayNow = async (bookingId: string) => {
    setPayingId(bookingId);
    try {
      const res = await createPaymentAction(bookingId);
      if (res.success && res.data?.paymentUrl) {
        window.location.href = res.data.paymentUrl;
      } else {
        alert(res.message || "Failed to initiate payment. Please try again.");
      }
    } catch (err: any) {
      alert(err.message || "Something went wrong.");
    } finally {
      setPayingId(null);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModal) return;

    setLoading(true);
    setMessage(null);

    try {
      let res;
      if (reviewModal.reviewId) {
        res = await updateReviewAction(reviewModal.reviewId, reviewModal.rating, reviewModal.comment);
      } else {
        res = await createReviewAction(reviewModal.bookingId, reviewModal.rating, reviewModal.comment);
      }

      if (res.success) {
        setMessage({ type: "success", text: res.message });
        setReviewModal(null);
        window.location.reload();
      } else {
        setMessage({ type: "error", text: res.message });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "An error occurred" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    setLoading(true);
    setMessage(null);

    try {
      const res = await deleteReviewAction(reviewId);
      if (res.success) {
        setMessage({ type: "success", text: res.message });
        window.location.reload();
      } else {
        setMessage({ type: "error", text: res.message });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "An error occurred" });
    } finally {
      setLoading(false);
    }
  };

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Sync state if initialBookings change
  if (JSON.stringify(bookings) !== JSON.stringify(initialBookings)) {
    setBookings(initialBookings);
  }

  const handleUpdateStatus = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editBooking) return;

    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const status = formData.get("status") as string;

    const res = await updateAdminBookingStatusAction(editBooking.id, status);
    setLoading(false);

    if (res.success) {
      setMessage({ type: "success", text: res.message });
      // Update local state
      setBookings((prev) =>
        prev.map((b) => (b.id === editBooking.id ? { ...b, status } : b))
      );
      setTimeout(() => {
        setEditBooking(null);
        setMessage(null);
      }, 1500);
    } else {
      setMessage({ type: "error", text: res.message });
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    setMessage(null);

    const res = await deleteAdminBookingAction(id);
    setLoading(false);

    if (res.success) {
      setMessage({ type: "success", text: res.message });
      setBookings((prev) => prev.filter((b) => b.id !== id));
      setDeleteBookingId(null);
      setTimeout(() => {
        setMessage(null);
      }, 1500);
    } else {
      setMessage({ type: "error", text: res.message });
    }
  };

  // Filtered bookings
  const filteredBookings = bookings.filter((b) => {
    const customerName = b.customer?.name || "";
    const technicianName = b.technician?.user?.name || "";
    const serviceTitle = b.service?.title || "";
    const address = b.address || "";

    const matchesSearch =
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      technicianName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      serviceTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus ? b.status === selectedStatus : true;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadgeStyles = (status: string) => {
    switch (status) {
      case "COMPLETED":
      case "PAID":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "REQUESTED":
      case "ACCEPTED":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "IN_PROGRESS":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "DECLINED":
      case "CANCELLED":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <>
      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#E5E0D8] pb-5">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Search bookings by customer, technician, service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-[#E5E0D8] bg-white pl-10 pr-4 py-2 text-sm text-[#1E2026] outline-none transition-all focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-[#6B7280]" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-xl border border-[#E5E0D8] bg-white px-3.5 py-2 text-sm text-[#1E2026] outline-none transition-all focus:border-[#D97706]"
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Alert Message */}
      {message && !editBooking && !deleteBookingId && (
        <div
          className={`mb-4 flex items-center gap-2 rounded-xl p-4 text-sm font-semibold ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Bookings Table */}
      <div className="overflow-x-auto rounded-2xl border border-[#E5E0D8] bg-white shadow-xs">
        <table className="w-full border-collapse text-left text-sm text-[#1E2026]">
          <thead className="bg-[#FAF8F5] text-xs font-bold uppercase tracking-wider text-[#6B7280]">
            <tr>
              <th scope="col" className="px-6 py-4">Service & Customer</th>
              <th scope="col" className="px-6 py-4">Technician</th>
              <th scope="col" className="px-6 py-4">Schedule & Address</th>
              <th scope="col" className="px-6 py-4">Price</th>
              <th scope="col" className="px-6 py-4">Status</th>
              <th scope="col" className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E0D8]/60">
            {paginatedBookings.map((b) => (
              <tr key={b.id} className="transition-colors hover:bg-[#FAF8F5]/50">
                <td className="px-6 py-4">
                  <div className="font-bold text-[#1E2026]">{b.service?.title || "N/A"}</div>
                  <div className="text-xs text-[#6B7280]">
                    By: {b.customer?.name} ({b.customer?.email})
                  </div>
                  {b.review && (
                    <div className="mt-2 rounded-lg bg-amber-50/50 border border-amber-100 p-2 text-xs max-w-[250px]">
                      <div className="flex items-center gap-1 font-semibold text-amber-800">
                        Rating: {b.review.rating}/5
                        {userRole === "ADMIN" && (
                          <button
                            onClick={() => handleDeleteReview(b.review.id)}
                            className="ml-auto text-red-500 hover:text-red-700 transition-colors"
                            title="Delete Review"
                          >
                            <Trash2 className="h-3 w-3 inline" />
                          </button>
                        )}
                      </div>
                      <p className="text-gray-600 mt-0.5 italic">"{b.review.comment}"</p>
                    </div>
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-[#4B5563]">
                  {b.technician?.user?.name || "N/A"}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-xs text-[#1E2026]">
                    <Calendar className="h-3.5 w-3.5 text-[#D97706]" />
                    {new Date(b.scheduledAt).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-[#6B7280]">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="line-clamp-1 max-w-[200px]">{b.address}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 font-bold text-[#1E2026]">
                  ${b.price}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${getStatusBadgeStyles(
                      b.status
                    )}`}
                  >
                    {b.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setSelectedBookingDetail(b)}
                      className="flex items-center gap-1 rounded-lg border border-[#E5E0D8] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#4B5563] transition-all hover:bg-[#FAF8F5] hover:text-[#1E2026]"
                      title="View Details"
                    >
                      <Eye className="h-3.5 w-3.5" /> Details
                    </button>
                    {userRole !== "CUSTOMER" && (
                      <button
                        onClick={() => setEditBooking(b)}
                        className="flex items-center gap-1 rounded-lg border border-[#E5E0D8] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#4B5563] transition-all hover:bg-[#FAF8F5] hover:text-[#1E2026]"
                        title="Update Status"
                      >
                        <Pencil className="h-3.5 w-3.5" /> Status
                      </button>
                    )}
                    {userRole === "ADMIN" && (
                      <button
                        onClick={() => setDeleteBookingId(b.id)}
                        className="flex items-center gap-1 rounded-lg border border-[#FCA5A5] bg-[#FEF2F2] px-2.5 py-1.5 text-xs font-semibold text-[#EF4444] transition-all hover:bg-[#FEE2E2]"
                        title="Delete Booking"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    )}
                    {userRole === "CUSTOMER" && b.status === "ACCEPTED" && (
                      <button
                        onClick={() => handlePayNow(b.id)}
                        disabled={payingId === b.id}
                        className="flex items-center gap-1 rounded-lg border border-[#D97706] bg-[#D97706] px-3 py-1.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-[#B45309] disabled:opacity-50"
                        title="Pay with SSLCommerz"
                      >
                        {payingId === b.id ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            Paying...
                          </>
                        ) : (
                          "Pay Now"
                        )}
                      </button>
                    )}
                    {userRole === "CUSTOMER" && b.status === "COMPLETED" && (
                      <button
                        onClick={() => {
                          setReviewModal({
                            bookingId: b.id,
                            reviewId: b.review?.id || null,
                            rating: b.review?.rating || 5,
                            comment: b.review?.comment || "",
                          });
                        }}
                        className="flex items-center gap-1 rounded-lg border border-amber-600 bg-amber-50 px-2.5 py-1.5 text-xs font-semibold text-amber-700 transition-all hover:bg-amber-100"
                        title={b.review ? "Edit Review" : "Give Review"}
                      >
                        {b.review ? "Edit Review" : "Give Review"}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {filteredBookings.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center text-[#6B7280]">
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="p-4 border-t border-[#E5E0D8]">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
            totalItems={filteredBookings.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      </div>

      {/* Edit Booking Status Modal */}
      {editBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl border border-[#E5E0D8] bg-white p-6 shadow-2xl animate-in fade-in-50 zoom-in-95">
            <button
              onClick={() => {
                setEditBooking(null);
                setMessage(null);
              }}
              className="absolute right-4 top-4 text-[#9CA3AF] hover:text-[#1E2026]"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-[#E5E0D8] pb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D97706]/10 text-[#D97706]">
                <Pencil className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-[#1E2026]">Update Booking Status</h3>
                <p className="text-xs text-[#6B7280]">Modify the current state of booking</p>
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

            <form onSubmit={handleUpdateStatus} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4B5563]">
                  Current Status
                </label>
                <div className="mt-1.5 text-sm font-semibold text-[#1E2026] bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl px-3.5 py-2.5">
                  {editBooking.status}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4B5563]">
                  New Status *
                </label>
                <select
                  name="status"
                  required
                  defaultValue={editBooking.status}
                  className="mt-1.5 w-full rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#1E2026] outline-none transition-all focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706]"
                >
                  {getNextStatusOptions(editBooking.status).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditBooking(null);
                    setMessage(null);
                  }}
                  className="rounded-xl px-4 py-2 text-sm font-semibold text-[#6B7280] hover:bg-[#FAF8F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 rounded-xl bg-[#D97706] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#B45309] disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Booking Confirmation */}
      {deleteBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl border border-[#E5E0D8] bg-white p-6 shadow-2xl animate-in fade-in-50 zoom-in-95">
            <button
              onClick={() => {
                setDeleteBookingId(null);
                setMessage(null);
              }}
              className="absolute right-4 top-4 text-[#9CA3AF] hover:text-[#1E2026]"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-[#E5E0D8] pb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600">
                <Trash2 className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-[#1E2026]">Delete Booking</h3>
                <p className="text-xs text-[#6B7280]">This action cannot be undone.</p>
              </div>
            </div>

            {message && (
              <div
                className={`mt-4 flex items-center gap-2 rounded-xl p-3 text-xs font-semibold bg-red-50 text-red-700 border border-red-200`}
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{message.text}</span>
              </div>
            )}

            <p className="mt-4 text-sm text-[#4B5563]">
              Are you sure you want to delete this booking? The transaction data and scheduled technician details will be removed from the system.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setDeleteBookingId(null);
                  setMessage(null);
                }}
                className="rounded-xl px-4 py-2 text-sm font-semibold text-[#6B7280] hover:bg-[#FAF8F5]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteBookingId)}
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Yes, Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-[#E5E0D8] bg-white p-6 shadow-xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-[#E5E0D8]/60 pb-3">
              <h3 className="text-lg font-bold text-[#1E2026]">
                {reviewModal.reviewId ? "Edit Review" : "Write a Review"}
              </h3>
              <button
                onClick={() => setReviewModal(null)}
                className="rounded-lg p-1 text-[#6B7280] hover:bg-[#FAF8F5] hover:text-[#1E2026]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4B5563]">
                  Rating (1-5) *
                </label>
                <select
                  name="rating"
                  required
                  value={reviewModal.rating}
                  onChange={(e) => setReviewModal({ ...reviewModal, rating: Number(e.target.value) })}
                  className="mt-1.5 w-full rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#1E2026] outline-none transition-all focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706]"
                >
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>
                      {r} Stars
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4B5563]">
                  Comment *
                </label>
                <textarea
                  name="comment"
                  required
                  rows={4}
                  value={reviewModal.comment}
                  onChange={(e) => setReviewModal({ ...reviewModal, comment: e.target.value })}
                  placeholder="Share your experience working with this technician..."
                  className="mt-1.5 w-full rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#1E2026] outline-none transition-all focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModal(null)}
                  className="rounded-xl px-4 py-2 text-sm font-semibold text-[#6B7280] hover:bg-[#FAF8F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 rounded-xl bg-[#D97706] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#B45309] disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Booking Details Modal */}
      {selectedBookingDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl border border-[#E5E0D8] bg-white p-6 shadow-2xl animate-in fade-in-50 zoom-in-95 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedBookingDetail(null)}
              className="absolute right-4 top-4 text-[#9CA3AF] hover:text-[#1E2026]"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-[#E5E0D8] pb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D97706]/10 text-[#D97706]">
                <Eye className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-[#1E2026]">Booking Details</h3>
                <p className="text-xs text-[#6B7280]">
                  Booking Reference ID: <span className="font-mono text-[10px] bg-gray-100 px-1 py-0.5 rounded">{selectedBookingDetail.id}</span>
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-6">
              {/* Service Information */}
              <div className="rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-[#1E2026]">{selectedBookingDetail.service?.title || "N/A"}</h4>
                    <p className="mt-1 text-xs text-[#6B7280]">
                      {selectedBookingDetail.service?.description || "No description provided for this service."}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-[#D97706]">${selectedBookingDetail.price}</span>
                  </div>
                </div>
              </div>

              {/* Grid for Customer and Technician info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Customer Information */}
                <div className="rounded-xl border border-[#E5E0D8]/60 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#4B5563]">
                    <User className="h-4 w-4 text-[#D97706]" />
                    <span>Customer Details</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-[#1E2026]">{selectedBookingDetail.customer?.name || "N/A"}</p>
                    <p className="text-xs text-[#6B7280]">{selectedBookingDetail.customer?.email || "N/A"}</p>
                  </div>
                </div>

                {/* Technician Information */}
                <div className="rounded-xl border border-[#E5E0D8]/60 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#4B5563]">
                    <Wrench className="h-4 w-4 text-[#D97706]" />
                    <span>Assigned Technician</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-[#1E2026]">{selectedBookingDetail.technician?.user?.name || "Unassigned"}</p>
                    <p className="text-xs text-[#6B7280]">{selectedBookingDetail.technician?.user?.email || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Schedule and Location */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#4B5563]">Schedule & Location</h4>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-2 rounded-xl border border-[#E5E0D8]/60 px-3.5 py-2.5 bg-white">
                    <Calendar className="h-4.5 w-4.5 text-[#D97706] shrink-0" />
                    <div>
                      <p className="text-[10px] text-[#6B7280] uppercase tracking-wider font-bold">Scheduled At</p>
                      <p className="text-xs font-semibold text-[#1E2026]">
                        {new Date(selectedBookingDetail.scheduledAt).toLocaleString("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-xl border border-[#E5E0D8]/60 px-3.5 py-2.5 bg-white">
                    <MapPin className="h-4.5 w-4.5 text-[#D97706] shrink-0" />
                    <div>
                      <p className="text-[10px] text-[#6B7280] uppercase tracking-wider font-bold">Service Location</p>
                      <p className="text-xs font-semibold text-[#1E2026] line-clamp-2">{selectedBookingDetail.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Note / Special Instructions */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#4B5563]">
                  <FileText className="h-4 w-4 text-[#D97706]" />
                  <span>Customer's Special Instructions</span>
                </div>
                <div className="rounded-xl border border-[#E5E0D8] bg-amber-50/30 p-3.5 text-xs text-[#4B5563] italic leading-relaxed">
                  {selectedBookingDetail.note ? `"${selectedBookingDetail.note}"` : "No special instructions or notes provided by the customer."}
                </div>
              </div>

              {/* Status and Actions */}
              <div className="flex items-center justify-between border-t border-[#E5E0D8] pt-4">
                <div>
                  <span className="text-xs text-[#6B7280] block mb-1">Booking Status</span>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${getStatusBadgeStyles(
                      selectedBookingDetail.status
                    )}`}
                  >
                    {selectedBookingDetail.status}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedBookingDetail(null)}
                  className="rounded-xl bg-[#1E2026] text-white px-5 py-2.5 text-sm font-bold shadow-sm transition-all hover:bg-black"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
