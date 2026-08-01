import { getTechnicianApplicationsAction } from "@/src/actions/technicianApplication.actions";
import { getMeAction } from "@/src/actions/auth.actions";
import AdminApplicationsClient from "@/src/components/modules/admin/AdminApplicationsClient";
import { redirect } from "next/navigation";

export default async function AdminApplicationsPage() {
  const meRes = await getMeAction();
  if (!meRes.success || meRes.data?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const applicationsRes = await getTechnicianApplicationsAction();
  const applications = applicationsRes.success ? applicationsRes.data : [];

  return <AdminApplicationsClient initialApplications={applications} />;
}
