import { getUsersAction } from "@/src/actions/admin.actions";
import UserList from "@/src/components/modules/admin/UserList";

export default async function AdminUsersPage() {
  const res = await getUsersAction();
  const users = res?.success ? res.data : [];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1E2026]">
            Users Management
          </h1>
          <p className="text-sm text-[#6B7280]">
            Manage, view, search, and ban/activate registered users in the platform
          </p>
        </div>
      </div>

      {/* Users Table Component */}
      <UserList initialUsers={users} />
    </div>
  );
}
