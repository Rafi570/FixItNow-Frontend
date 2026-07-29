"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { logoutAction } from "@/src/actions/auth.actions";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    // ১. কুকি মুছে ফেলা
    await logoutAction();
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    // ২. পেজ রিফ্রেশ করে লগইন পেজে রিডাইরেক্ট
    router.replace("/");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-1.5 text-sm font-medium text-red-600 transition-colors hover:text-red-700"
    >
      <LogOut className="h-4 w-4" />
      Logout
    </button>
  );
}