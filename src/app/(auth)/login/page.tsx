"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2, ArrowRight } from "lucide-react";
import { loginAction } from "@/src/actions/auth.actions";

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await loginAction(formData);

    setLoading(false);

    if (res.success) {
      router.push("/dashboard"); // লগইন সফল হলে অ্যাডমিন বা কাঙ্ক্ষিত পেজে রিডাইরেক্ট হবে
      router.refresh();
    } else {
      setError(res.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-semibold text-red-600">
          {error}
        </div>
      )}

      {/* Email Field */}
      <div>
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#1E2026]">
          Email Address
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            type="email"
            name="email"
            required
            placeholder="admin@example.com"
            className="w-full rounded-xl border border-[#D97706]/20 bg-white py-2.5 pl-10 pr-4 text-sm text-[#1E2026] outline-none transition-all focus:border-[#D97706] focus:ring-2 focus:ring-[#D97706]/20"
          />
        </div>
      </div>

      {/* Password Field */}
      <div>
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#1E2026]">
          Password
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            type="password"
            name="password"
            required
            placeholder="••••••••"
            className="w-full rounded-xl border border-[#D97706]/20 bg-white py-2.5 pl-10 pr-4 text-sm text-[#1E2026] outline-none transition-all focus:border-[#D97706] focus:ring-2 focus:ring-[#D97706]/20"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#D97706] to-[#B45309] py-3 text-sm font-bold text-white shadow-md shadow-[#D97706]/20 transition-all hover:opacity-95 active:scale-[0.99] disabled:opacity-70"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Logging in...
          </>
        ) : (
          <>
            Sign In
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}