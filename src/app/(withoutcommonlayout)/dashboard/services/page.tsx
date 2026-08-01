import { getServicesAction } from "@/src/actions/service.actions";
import { getCategories } from "@/src/actions/category.actions";
import { getMeAction } from "@/src/actions/auth.actions";
import ServiceList from "@/src/components/modules/admin/ServiceList";
import { redirect } from "next/navigation";

export default async function AdminServicesPage() {
  const meRes = await getMeAction();
  
  if (meRes.data?.role === "TECHNICIAN") {
    redirect("/dashboard/my-services");
  }

  if (!meRes.success || meRes.data?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const [servicesRes, categoriesRes] = await Promise.all([
    getServicesAction(),
    getCategories(),
  ]);

  const services = servicesRes?.success ? servicesRes.data : [];
  const categories = categoriesRes?.success ? categoriesRes.data : [];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1E2026]">
            Platform Services Management
          </h1>
          <p className="text-sm text-[#6B7280]">
            Admin panel to view, edit, or remove service offerings across all platform technicians
          </p>
        </div>
      </div>

      {/* Services Table and Filter Component */}
      <ServiceList initialServices={services} categories={categories} currentUser={meRes.data} />
    </div>
  );
}
