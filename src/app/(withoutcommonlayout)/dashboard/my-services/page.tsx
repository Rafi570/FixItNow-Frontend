import { getOwnServicesAction } from "@/src/actions/service.actions";
import { getCategories } from "@/src/actions/category.actions";
import { getMeAction } from "@/src/actions/auth.actions";
import MyServicesList from "@/src/components/modules/technician/MyServicesList";
import { redirect } from "next/navigation";

export default async function MyServicesPage() {
  const meRes = await getMeAction();
  if (!meRes.success || meRes.data?.role !== "TECHNICIAN") {
    redirect("/dashboard");
  }

  const [servicesRes, categoriesRes] = await Promise.all([
    getOwnServicesAction(),
    getCategories(),
  ]);

  const myServices = servicesRes.success ? servicesRes.data : [];
  const categories = categoriesRes.success ? categoriesRes.data : [];

  return <MyServicesList initialServices={myServices} allCategories={categories} />;
}
