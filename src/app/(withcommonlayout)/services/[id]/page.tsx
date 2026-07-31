import { getServiceByIdAction } from "../../../../actions/service.actions";
import { getServiceReviewsAction } from "../../../../actions/review.actions";
import { getMeAction } from "../../../../actions/auth.actions";
import ServiceDetails from "../../../../components/modules/public/ServiceDetails";
import { notFound } from "next/navigation";

export default async function ServiceDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [serviceRes, reviewsRes, meRes] = await Promise.all([
    getServiceByIdAction(id),
    getServiceReviewsAction(id),
    getMeAction(),
  ]);

  if (!serviceRes?.success || !serviceRes.data) {
    notFound();
  }

  const service = serviceRes.data;
  const reviews = reviewsRes?.success ? reviewsRes.data : [];
  const isLoggedIn = meRes?.success || false;
  const currentUser = meRes?.success ? meRes.data : null;

  return (
    <ServiceDetails
      service={service}
      reviews={reviews}
      isLoggedIn={isLoggedIn}
      currentUser={currentUser}
    />
  );
}
