"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, AlertCircle, Search, ShieldAlert, ShieldCheck } from "lucide-react";
import { updateUserStatusAction } from "@/src/actions/admin.actions";
import Pagination from "@/src/components/share/Pagination";

interface UserListProps {
  initialUsers: any[];
}

export default function UserList({ initialUsers }: UserListProps) {
  const [users, setUsers] = useState<any[]>(initialUsers);
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Sync state if initialUsers change
  if (JSON.stringify(users) !== JSON.stringify(initialUsers)) {
    setUsers(initialUsers);
  }

  const handleToggleStatus = async (userId: string, currentStatus: "ACTIVE" | "BANNED") => {
    setLoadingUserId(userId);
    setMessage(null);

    const nextStatus = currentStatus === "ACTIVE" ? "BANNED" : "ACTIVE";
    const res = await updateUserStatusAction(userId, nextStatus);

    setLoadingUserId(null);

    if (res.success) {
      setMessage({ type: "success", text: res.message });
      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? { ...user, status: nextStatus } : user))
      );
      setTimeout(() => {
        setMessage(null);
      }, 2000);
    } else {
      setMessage({ type: "error", text: res.message });
    }
  };

  const filteredUsers = users.filter((user) => {
    return (
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      {/* Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#E5E0D8] pb-5">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Search users by name, email, or role..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-xl border border-[#E5E0D8] bg-white pl-10 pr-4 py-2 text-sm text-[#1E2026] outline-none transition-all focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706]"
          />
        </div>
      </div>

      {/* Alert Message */}
      {message && (
        <div
          className={`mb-4 flex items-center gap-2 rounded-xl p-4 text-sm font-semibold ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Users Table */}
      <div className="overflow-x-auto rounded-2xl border border-[#E5E0D8] bg-white shadow-xs">
        <table className="w-full border-collapse text-left text-sm text-[#1E2026]">
          <thead className="bg-[#FAF8F5] text-xs font-bold uppercase tracking-wider text-[#6B7280]">
            <tr>
              <th scope="col" className="px-6 py-4">Name</th>
              <th scope="col" className="px-6 py-4">Email</th>
              <th scope="col" className="px-6 py-4">Role</th>
              <th scope="col" className="px-6 py-4">Status</th>
              <th scope="col" className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E0D8]/60">
            {paginatedUsers.map((user) => (
              <tr key={user.id} className="transition-colors hover:bg-[#FAF8F5]/50">
                <td className="whitespace-nowrap px-6 py-4 font-bold text-[#1E2026]">
                  {user.name}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-[#6B7280]">
                  {user.email}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                      user.role === "ADMIN"
                        ? "bg-purple-50 text-purple-700 border-purple-200"
                        : user.role === "TECHNICIAN"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : "bg-gray-50 text-gray-700 border-gray-200"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                      user.status === "ACTIVE"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {user.role === "ADMIN" ? (
                      <span className="text-xs text-[#9CA3AF] italic px-3 py-1">Admin Protected</span>
                    ) : (
                      <button
                        onClick={() => handleToggleStatus(user.id, user.status)}
                        disabled={loadingUserId === user.id}
                        className={`flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                          user.status === "ACTIVE"
                            ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                            : "border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                        }`}
                      >
                        {loadingUserId === user.id ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            Updating...
                          </>
                        ) : user.status === "ACTIVE" ? (
                          <>
                            <ShieldAlert className="h-3.5 w-3.5" />
                            Ban User
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="h-3.5 w-3.5" />
                            Activate User
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="py-12 text-center text-[#6B7280]">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="p-4 border-t border-[#E5E0D8]">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
            totalItems={filteredUsers.length}
            itemsPerPage={itemsPerPage}
          />
        </div>
      </div>
    </>
  );
}
