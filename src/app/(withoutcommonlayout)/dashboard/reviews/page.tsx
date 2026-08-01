import { getMyWorkReviewsAction } from "@/src/actions/review.actions";
import { getMeAction } from "@/src/actions/auth.actions";
import { redirect } from "next/navigation";
import TechnicianReviewsClient from "@/src/components/modules/technician/TechnicianReviewsClient";

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

  const reviews = reviewsRes?.success && Array.isArray(reviewsRes.data) ? reviewsRes.data : [];

  return <TechnicianReviewsClient initialReviews={reviews} />;
}
