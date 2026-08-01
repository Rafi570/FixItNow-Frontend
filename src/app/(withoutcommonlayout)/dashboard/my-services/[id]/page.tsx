import { getServiceByIdAction } from "@/src/actions/service.actions";
import { getMeAction } from "@/src/actions/auth.actions";
import TechnicianServiceDetail from "@/src/components/modules/technician/TechnicianServiceDetail";
import { redirect } from "next/navigation";

export default async function TechnicianServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const meRes = await getMeAction();
  if (!meRes.success || meRes.data?.role !== "TECHNICIAN") {
    redirect("/dashboard");
  }

  const { id } = await params;
  const serviceRes = await getServiceByIdAction(id);
  const service = serviceRes.success ? serviceRes.data : null;

  return <TechnicianServiceDetail service={service} />;
}
