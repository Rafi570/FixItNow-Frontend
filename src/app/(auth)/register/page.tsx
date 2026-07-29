import Link from "next/link";
import { Wrench } from "lucide-react";
import RegisterForm from "@/src/components/modules/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FAF8F5] px-4 py-12">
      {/* Background Decorative Glows */}
      <div
        className="pointer-events-none absolute -top-24 left-[10%] h-80 w-80 rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, #F59E0B, transparent 70%)" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 right-[8%] h-96 w-96 rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, #D97706, transparent 70%)" }}
        aria-hidden="true"
      />

      {/* Pattern Overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage: "radial-gradient(#D97706 0.75px, transparent 0.75px)",
          backgroundSize: "24px 24px",
        }}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md">
        {/* Main Card */}
        <div className="rounded-3xl border border-[#D97706]/15 bg-white/80 p-8 shadow-[0_20px_50px_-12px_rgba(217,119,6,0.12)] backdrop-blur-xl sm:p-10">
          
          {/* Header & Brand */}
          <div className="flex flex-col items-center text-center">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#D97706]/30 bg-gradient-to-br from-[#F59E0B]/20 via-[#D97706]/10 to-white shadow-sm shadow-[#D97706]/10">
                <Wrench className="h-6 w-6 text-[#B45309]" strokeWidth={2.25} />
              </span>
            </Link>

            <h1
              className="mt-5 text-2xl font-bold tracking-tight text-[#1E2026]"
              style={{ fontFamily: "'Space Grotesk', ui-sans-serif, system-ui" }}
            >
              Create an account
            </h1>
            <p className="mt-1.5 text-xs font-medium text-[#6B7280]">
              Get started with FixIt<span className="text-[#D97706]">Now</span> today
            </p>
          </div>

          {/* Client Form Component */}
          <RegisterForm />

          {/* Footer Navigation Link */}
          <p className="mt-7 text-center text-xs font-medium text-[#6B7280]">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-[#B45309] hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        {/* Footer Copyright */}
        <p className="mt-6 text-center text-xs text-[#9CA3AF]">
          © {new Date().getFullYear()} FixItNow. All rights reserved.
        </p>
      </div>
    </div>
  );
}