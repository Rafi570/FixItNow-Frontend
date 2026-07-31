import { getMyWorkReviewsAction } from "@/src/actions/review.actions";
import { getMeAction } from "@/src/actions/auth.actions";
import { redirect } from "next/navigation";
import { Star, MessageSquare, Calendar, ShieldAlert } from "lucide-react";

export default async function TechnicianReviewsPage() {
  const [userRes, reviewsRes] = await Promise.all([
    getMeAction(),
    getMyWorkReviewsAction(),
  ]);

  if (!userRes?.success || !userRes?.data) {
    redirect("/login");
  }

  const user = userRes.data;
  if (user.role !== "TECHNICIAN") {
    redirect("/dashboard");
  }

  const reviews = reviewsRes?.success ? reviewsRes.data : [];

  // Calculate summary metrics
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? (reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : "0.0";

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1E2026]">
            My Service Reviews
          </h1>
          <p className="text-sm text-[#6B7280]">
            Monitor customer feedback, ratings, and testimonials for your completed service bookings
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-[#E5E0D8] bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold uppercase tracking-wider text-[#6B7280]">
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
            Based on all customer reviews received
          </p>
        </div>

        <div className="rounded-2xl border border-[#E5E0D8] bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold uppercase tracking-wider text-[#6B7280]">
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
      </div>

      {/* Review List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-[#1E2026]">Recent Feedback</h2>
        
        {reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-[#E5E0D8] bg-white py-12 px-4 text-center">
            <ShieldAlert className="h-10 w-10 text-[#6B7280] mb-3" />
            <h3 className="text-sm font-bold text-[#1E2026]">No Reviews Yet</h3>
            <p className="text-xs text-[#6B7280] mt-1 max-w-xs">
              Once clients complete bookings and leave feedback, their ratings and reviews will show up here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {reviews.map((r: any) => (
              <div
                key={r.id}
                className="flex flex-col justify-between rounded-2xl border border-[#E5E0D8] bg-white p-6 shadow-xs hover:border-[#D97706]/40 transition-colors"
              >
                <div>
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4.5 w-4.5 ${
                          star <= r.rating
                            ? "fill-[#D97706] text-[#D97706]"
                            : "text-gray-200"
                        }`}
                      />
                    ))}
                    <span className="ml-1 text-xs font-bold text-[#1E2026]">
                      {r.rating}.0
                    </span>
                  </div>

                  {/* Comment */}
                  <p className="mt-4 text-sm text-[#4B5563] italic leading-relaxed">
                    "{r.comment}"
                  </p>
                </div>

                <div className="mt-6 border-t border-[#E5E0D8]/60 pt-4">
                  <div className="flex items-center justify-between text-xs text-[#6B7280]">
                    <div>
                      <span className="block font-bold text-[#1E2026]">
                        {r.customer?.name || "Anonymous Client"}
                      </span>
                      <span className="block mt-0.5 text-[11px]">
                        Service: {r.booking?.service?.title || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px]">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(r.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
