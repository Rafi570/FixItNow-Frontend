"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, Loader2, ArrowRight } from "lucide-react";
import { loginAction } from "@/src/actions/auth.actions";
import AuthError from "./AuthError";

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
      router.replace("/dashboard");
      router.refresh();
    } else {
      setError(res.message);
    }
  };

  const handleInputChange = () => {
    if (error) setError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      <AuthError key={error || ""} message={error} />

      {/* Email Field */}
      <div>
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#1E2026]">
          Email address
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            type="email"
            name="email"
            required
            onChange={handleInputChange}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-[#D97706]/20 bg-white py-3 pl-11 pr-4 text-sm text-[#1E2026] outline-none transition-all placeholder:text-[#9CA3AF] focus:border-[#D97706] focus:ring-2 focus:ring-[#D97706]/20 shadow-sm"
          />
        </div>
      </div>

      {/* Password Field */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#1E2026]">
            Password
          </label>
          <Link
            href="/forgot-password"
            className="text-xs font-semibold text-[#B45309] hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            type="password"
            name="password"
            required
            onChange={handleInputChange}
            placeholder="••••••••"
            className="w-full rounded-xl border border-[#D97706]/20 bg-white py-3 pl-11 pr-4 text-sm text-[#1E2026] outline-none transition-all placeholder:text-[#9CA3AF] focus:border-[#D97706] focus:ring-2 focus:ring-[#D97706]/20 shadow-sm"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#D97706] to-[#B45309] py-3 text-sm font-bold text-white shadow-md shadow-[#D97706]/20 transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          <>
            Sign in
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}