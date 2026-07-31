"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Suspense } from "react";

function FailContent() {
  const searchParams = useSearchParams();
  const transactionId = searchParams?.get("tran_id");

  return (
    <div className="w-full max-w-md rounded-2xl border border-[#FCA5A5] bg-white p-8 text-center shadow-xs">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
        <AlertTriangle className="h-10 w-10" />
      </div>
      <h1 className="mt-6 text-2xl font-bold text-[#1E2026]">Payment Failed</h1>
      <p className="mt-2 text-sm text-[#6B7280]">
        Unfortunately, your payment transaction could not be processed. Please try again.
      </p>
      
      {transactionId && (
        <div className="mt-6 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] p-4 text-left">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Transaction ID</span>
          <p className="mt-1 text-sm font-mono font-bold text-[#1E2026] break-all">{transactionId}</p>
        </div>
      )}

      <div className="mt-8 space-y-3">
        <Link
          href="/dashboard/bookings"
          className="inline-block w-full rounded-xl bg-[#EF4444] px-5 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#DC2626]"
        >
          Try Again / Bookings
        </Link>
      </div>
    </div>
  );
}

export default function PaymentFailPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#FAF8F5] px-4">
      <Suspense fallback={<div className="text-sm text-gray-500">Loading...</div>}>
        <FailContent />
      </Suspense>
    </div>
  );
}
