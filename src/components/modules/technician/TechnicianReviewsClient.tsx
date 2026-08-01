"use client";

import { useState } from "react";
import { Star, MessageSquare, Calendar, ShieldAlert, Search, Filter } from "lucide-react";
import Pagination from "@/src/components/share/Pagination";

interface ReviewItem {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  customer?: {
    id: string;
    name: string;
    email: string;
  };
  booking?: {
    id: string;
    service?: {
      id: string;
      title: string;
    };
  };
}

export default function TechnicianReviewsClient({
  initialReviews,
}: {
  initialReviews: ReviewItem[];
}) {
  const [reviews] = useState<ReviewItem[]>(initialReviews);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Calculate Summary metrics
  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
      : "0.0";
  const fiveStarCount = reviews.filter((r) => r.rating === 5).length;

  // Search & Filter
  const filteredReviews = reviews.filter((r) => {
    const customerName = r.customer?.name || "";
    const customerEmail = r.customer?.email || "";
    const serviceTitle = r.booking?.service?.title || "";
    const comment = r.comment || "";

    const matchesSearch =
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      serviceTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRating = ratingFilter ? r.rating === Number(ratingFilter) : true;

    return matchesSearch && matchesRating;
  });

  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col gap-2 border-b border-[#E5E0D8] pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1E2026]">
            My Service Reviews
          </h1>
          <p className="text-sm text-[#6B7280]">
            Monitor customer feedback, ratings, and testimonials for your completed service bookings
          </p>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#E5E0D8] bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
              Average Rating
            </span>
            <Star className="h-5 w-5 fill-[#D97706] text-[#D97706]" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-[#1E2026]">
              {avgRating}
            </span>
            <span className="text-sm font-semibold text-[#6B7280]">/ 5.0</span>
          </div>
          <p className="mt-1 text-xs text-[#6B7280]">
            Based on all customer feedback received
          </p>
        </div>

        <div className="rounded-2xl border border-[#E5E0D8] bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
              Total Reviews
            </span>
            <MessageSquare className="h-5 w-5 text-[#D97706]" />
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold tracking-tight text-[#1E2026]">
              {totalReviews}
            </span>
          </div>
          <p className="mt-1 text-xs text-[#6B7280]">
            Total feedbacks submitted by clients
          </p>
        </div>

        <div className="rounded-2xl border border-[#E5E0D8] bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">
              5-Star Feedbacks
            </span>
            <Star className="h-5 w-5 fill-emerald-500 text-emerald-500" />
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold tracking-tight text-emerald-600">
              {fiveStarCount}
            </span>
          </div>
          <p className="mt-1 text-xs text-[#6B7280]">
            Top rated service experiences
          </p>
        </div>
      </div>

      {/* Search & Filter controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#E5E0D8] pb-5">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Search reviews by customer, service, or comment..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-xl border border-[#E5E0D8] bg-white pl-10 pr-4 py-2 text-sm text-[#1E2026] outline-none transition-all focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-[#6B7280]" />
          <select
            value={ratingFilter}
            onChange={(e) => {
              setRatingFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-xl border border-[#E5E0D8] bg-white px-3.5 py-2 text-sm text-[#1E2026] outline-none transition-all focus:border-[#D97706]"
          >
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {/* Reviews Table View */}
      <div className="overflow-hidden rounded-3xl border border-[#E5E0D8] bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-[#1E2026]">
            <thead className="bg-[#FAF8F5] text-xs font-bold uppercase tracking-wider text-[#6B7280]">
              <tr>
                <th scope="col" className="px-6 py-4">Customer & Service</th>
                <th scope="col" className="px-6 py-4">Rating</th>
                <th scope="col" className="px-6 py-4">Customer Feedback</th>
                <th scope="col" className="px-6 py-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E0D8]/60">
              {paginatedReviews.map((r) => (
                <tr key={r.id} className="transition-colors hover:bg-[#FAF8F5]/60">
                  {/* Customer & Service */}
                  <td className="px-6 py-4">
                    <div className="font-bold text-[#1E2026]">
                      {r.customer?.name || "Anonymous Client"}
                    </div>
                    <div className="text-xs text-[#6B7280]">
                      {r.customer?.email}
                    </div>
                    <div className="mt-1 inline-flex items-center rounded-md bg-[#FAF8F5] border border-[#E5E0D8] px-2 py-0.5 text-[11px] font-semibold text-[#D97706]">
                      Service: {r.booking?.service?.title || "N/A"}
                    </div>
                  </td>

                  {/* Rating */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= r.rating
                              ? "fill-[#D97706] text-[#D97706]"
                              : "text-gray-200"
                          }`}
                        />
                      ))}
                      <span className="ml-1.5 text-xs font-bold text-[#1E2026]">
                        {r.rating}.0
                      </span>
                    </div>
                  </td>

                  {/* Feedback / Review Comment */}
                  <td className="px-6 py-4">
                    <p className="text-xs text-[#4B5563] italic leading-relaxed max-w-md bg-[#FAF8F5] p-3 rounded-xl border border-[#E5E0D8]">
                      "{r.comment}"
                    </p>
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-xs text-[#6B7280]">
                    <div className="flex items-center justify-end gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-[#9CA3AF]" />
                      {new Date(r.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredReviews.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-[#6B7280]">
                    <div className="flex flex-col items-center justify-center">
                      <ShieldAlert className="h-8 w-8 text-[#9CA3AF] mb-2" />
                      <p className="text-sm font-bold text-[#1E2026]">No Reviews Found</p>
                      <p className="text-xs text-[#6B7280] mt-0.5">
                        There are no customer reviews matching your search query or rating filter.
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
            totalItems={filteredReviews.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      </div>
    </div>
  );
}
