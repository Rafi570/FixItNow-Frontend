import { getServicesAction } from "@/src/actions/service.actions";
import { getCategories } from "@/src/actions/category.actions";
import { getMeAction } from "@/src/actions/auth.actions";
import PublicServices from "@/src/components/modules/public/PublicServices";

export default async function ServicesPage() {
  const [servicesRes, categoriesRes, meRes] = await Promise.all([
    getServicesAction(),
    getCategories(),
    getMeAction(),
  ]);

  const services = servicesRes?.success ? servicesRes.data : [];
  const categories = categoriesRes?.success ? categoriesRes.data : [];
  const isLoggedIn = meRes?.success || false;
  const currentUser = meRes?.success ? meRes.data : null;

  return (
    <PublicServices
      initialServices={services}
      categories={categories}
      isLoggedIn={isLoggedIn}
      currentUser={currentUser}
    />
  );
}
