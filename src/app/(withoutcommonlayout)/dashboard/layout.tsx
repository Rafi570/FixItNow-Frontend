import AdminLayout from "@/src/components/layout/Adminlayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}