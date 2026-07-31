import { getMeAction } from "@/src/actions/auth.actions";
import CustomerOverview from "../../../components/modules/dashboard/CustomerOverview";
import TechnicianOverview from "../../../components/modules/dashboard/TechnicianOverview";
import AdminOverview from "../../../components/modules/dashboard/AdminOverview";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const meRes = await getMeAction();
  if (!meRes.success || !meRes.data) {
    redirect("/login");
  }

  const user = meRes.data;

  if (user.role === "ADMIN") {
    return <AdminOverview user={user} />;
  } else if (user.role === "TECHNICIAN") {
    return <TechnicianOverview user={user} />;
  } else {
    return <CustomerOverview user={user} />;
  }
}
