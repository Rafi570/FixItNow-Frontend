"use client";

import React from "react";
import { Building2, Sparkles, ShieldCheck } from "lucide-react";

const companies = [
  { name: "Grameenphone", role: "Telecom Facilities", logo: "📶 GP Corporate" },
  { name: "Daraz Bangladesh", role: "Logistics & Hubs", logo: "📦 Daraz Hubs" },
  { name: "Pathao Ltd.", role: "Corporate HQ", logo: "🛵 Pathao HQ" },
  { name: "BRAC Bank", role: "Branch Network", logo: "🏦 BRAC Bank" },
  { name: "Walton Hi-Tech", role: "Appliance Service", logo: "⚡ Walton" },
  { name: "Square Pharma", role: "Facility Repair", logo: "💊 Square" },
  { name: "bKash Limited", role: "Regional Offices", logo: "💳 bKash" },
  { name: "Unilever BD", role: "Commercial Maintenance", logo: "🌿 Unilever" },
];

export default function TrustedCompanies() {
  // Duplicate array for seamless infinite marquee loop
  const marqueeItems = [...companies, ...companies];

  return (
    <section className="w-full py-14 bg-white border-b border-[#E7E2D8]/60 overflow-hidden">
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0%);
          }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 25s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Center-aligned Uniform Header */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D97706]/30 bg-[#D97706]/10 px-4 py-1.5 text-xs font-bold text-[#D97706] mb-3">
            <Building2 className="h-3.5 w-3.5" />
            <span>Trusted Enterprise Clients</span>
          </div>
          <h2
            className="text-3xl font-extrabold tracking-tight text-[#1E2026] sm:text-4xl"
            style={{ fontFamily: "'Space Grotesk', ui-sans-serif, system-ui" }}
          >
            Powering Maintenance for Leading Brands
          </h2>
          <p className="mt-2 text-sm text-[#6B7280]">
            FixItNow delivers premium electrical, HVAC, and facility repair services to top corporate companies across the nation.
          </p>
        </div>

        {/* Infinite Marquee Ticker */}
        <div className="relative w-full overflow-hidden rounded-2xl bg-[#FAF8F5] border border-[#E7E2D8] py-6 px-4">
          {/* Gradient Overlay Shadows */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-[#FAF8F5] to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-[#FAF8F5] to-transparent" />

          <div className="animate-marquee gap-8">
            {marqueeItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 rounded-xl border border-[#E7E2D8] bg-white px-6 py-3 shadow-2xs transition-all hover:border-[#D97706]/40 hover:shadow-md shrink-0"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#171B21] text-xs font-black text-white">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-[#1E2026] tracking-tight">{item.name}</h4>
                  <p className="text-[10px] font-semibold text-[#6B7280]">{item.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
