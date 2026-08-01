import { getCategories } from "@/src/actions/category.actions";
import { getMeAction } from "@/src/actions/auth.actions";
import AddServiceForm from "@/src/components/modules/technician/AddServiceForm";
import { redirect } from "next/navigation";

export default async function AddServicePage() {
  const meRes = await getMeAction();
  if (!meRes.success || (meRes.data?.role !== "ADMIN" && meRes.data?.role !== "TECHNICIAN")) {
    redirect("/dashboard");
  }

  const categoriesRes = await getCategories();
  const categories = categoriesRes.success ? categoriesRes.data : [];

  return <AddServiceForm categories={categories} currentUser={meRes.data} />;
}
