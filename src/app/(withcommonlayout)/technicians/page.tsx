import { getTechniciansAction } from "@/src/actions/admin.actions";
import TechniciansList from "../../../components/modules/public/TechniciansList";

export default async function TechniciansPage() {
  const res = await getTechniciansAction();
  const technicians = res?.success ? res.data : [];

  return <TechniciansList initialTechnicians={technicians} />;
}
