"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const transactionId = searchParams?.get("tran_id");

  return (
    <div className="w-full max-w-md rounded-2xl border border-[#E5E0D8] bg-white p-8 text-center shadow-xs">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
        <CheckCircle2 className="h-10 w-10" />
      </div>
      <h1 className="mt-6 text-2xl font-bold text-[#1E2026]">Payment Successful!</h1>
      <p className="mt-2 text-sm text-[#6B7280]">
        Thank you. Your payment has been processed successfully and your booking is now paid.
      </p>
      
      {transactionId && (
        <div className="mt-6 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] p-4 text-left">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Transaction ID</span>
          <p className="mt-1 text-sm font-mono font-bold text-[#1E2026] break-all">{transactionId}</p>
        </div>
      )}

      <div className="mt-8">
        <Link
          href="/dashboard/bookings"
          className="inline-block w-full rounded-xl bg-[#D97706] px-5 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#B45309]"
        >
          Go to Bookings
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#FAF8F5] px-4">
      <Suspense fallback={<div className="text-sm text-gray-500">Loading...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
