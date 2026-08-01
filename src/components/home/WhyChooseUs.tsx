"use client";

import React from "react";
import { ShieldCheck, DollarSign, Clock, Award, Sparkles, CheckCircle2 } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "100% Verified Specialists",
    description:
      "Every technician on FixItNow passes rigorous background checks, skill tests, and identity verification before accepting jobs.",
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    badge: "Identity Checked",
  },
  {
    icon: DollarSign,
    title: "Transparent Upfront Pricing",
    description:
      "No unexpected surprises or hidden charges. Get clear, upfront estimates before work starts with fixed hourly or job rates.",
    color: "bg-[#D97706]/10 text-[#D97706] border-[#D97706]/20",
    badge: "Zero Hidden Fees",
  },
  {
    icon: Clock,
    title: "Instant 60-Second Booking",
    description:
      "Schedule repair and maintenance services in under a minute with real-time technician matching and instant notifications.",
    color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    badge: "Fast & Convenient",
  },
  {
    icon: Award,
    title: "Satisfaction Guarantee",
    description:
      "Your peace of mind matters. If you're not satisfied with the repair quality, our support team ensures free follow-up service.",
    color: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    badge: "Quality Guaranteed",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="w-full py-16 lg:py-24 bg-[#FAF8F5]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-14 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D97706]/30 bg-[#D97706]/10 px-4 py-1.5 text-xs font-bold text-[#D97706] mb-3">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Why Choose Us</span>
          </div>
          <h2
            className="text-3xl font-extrabold tracking-tight text-[#1E2026] sm:text-4xl"
            style={{ fontFamily: "'Space Grotesk', ui-sans-serif, system-ui" }}
          >
            Built for Trust, Speed & Uncompromised Quality
          </h2>
          <p className="mt-3 text-sm text-[#6B7280]">
            We connect homeowners and businesses with top-tier, certified service experts for seamless maintenance and repair experiences.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group relative flex flex-col justify-between rounded-3xl border border-[#E7E2D8] bg-white p-7 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-[#D97706]/40 hover:shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${item.color} transition-transform group-hover:scale-110`}
                    >
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider rounded-full bg-[#FAF8F5] border border-[#E7E2D8] px-2.5 py-1 text-[#6B7280]">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="mt-6 text-lg font-bold text-[#1E2026] group-hover:text-[#B45309] transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs text-[#6B7280] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-1.5 text-[11px] font-bold text-[#D97706]">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Verified Standard</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
