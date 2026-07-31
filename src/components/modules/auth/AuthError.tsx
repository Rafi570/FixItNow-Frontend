"use client";

import { AlertCircle } from "lucide-react";

export default function AuthError({ message }: { message: string | null }) {
  if (!message) return null;

  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-semibold text-red-600 animate-error-entry">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
      <span>{message}</span>
    </div>
  );
}