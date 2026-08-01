"use client";

import { useState } from "react";
import { Wrench, CheckCircle2, Clock } from "lucide-react";
import ApplyTechnicianModal from "../modules/technician/ApplyTechnicianModal";
import { useRouter } from "next/navigation";

interface ApplyTechnicianButtonProps {
  isLoggedIn: boolean;
  userRole?: string;
  userName?: string;
  userEmail?: string;
  applicationStatus?: string | null;
}

export default function ApplyTechnicianButton({
  isLoggedIn,
  userRole,
  userName,
  userEmail,
  applicationStatus,
}: ApplyTechnicianButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    if (!isLoggedIn) {
      router.push("/login?redirect=/apply");
      return;
    }
    setIsOpen(true);
  };

  // If already a technician
  if (userRole === "TECHNICIAN") {
    return (
      <span className="hidden lg:inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
        Technician Active
      </span>
    );
  }

  if (userRole === "ADMIN") {
    return null;
  }

  // If application is pending
  if (applicationStatus === "PENDING") {
    return (
      <>
        <button
          onClick={handleClick}
          className="flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3.5 py-1.5 text-xs font-semibold text-amber-800 transition-all hover:bg-amber-100"
        >
          <Clock className="h-3.5 w-3.5 text-amber-600 animate-pulse" />
          Application Pending
        </button>
        <ApplyTechnicianModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          userName={userName}
          userEmail={userEmail}
          initialStatus={applicationStatus}
        />
      </>
    );
  }

  return (
    <>
      <button
        onClick={handleClick}
        className="group flex items-center gap-1.5 rounded-full border border-[#E8912B]/40 bg-[#E8912B]/10 px-3.5 py-1.5 text-xs font-bold text-[#171B21] transition-all hover:border-[#E8912B] hover:bg-[#E8912B] hover:text-white shadow-sm"
      >
        <Wrench className="h-3.5 w-3.5 text-[#E8912B] group-hover:text-white transition-colors" />
        Apply to Technician
      </button>

      <ApplyTechnicianModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        userName={userName}
        userEmail={userEmail}
        initialStatus={applicationStatus}
      />
    </>
  );
}
