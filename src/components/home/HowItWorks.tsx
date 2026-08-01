"use client";

import React from "react";
import { Search, CalendarCheck, CheckCircle, ArrowRight, Wrench } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Browse & Select Service",
    description:
      "Explore our verified categories or search for specific electrical, plumbing, or AC repair services matching your exact requirements.",
  },
  {
    number: "02",
    icon: CalendarCheck,
    title: "Schedule Date & Location",
    description:
      "Pick your preferred date and time slot, enter your home or office address, and add any specific instructions for the specialist.",
  },
  {
    number: "03",
    icon: CheckCircle,
    title: "Expert Arrives & Fixes",
    description:
      "A certified technician arrives fully equipped with tools, completes the repair seamlessly, and you pay securely with complete peace of mind.",
  },
];

export default function HowItWorks() {
  return (
    <section className="w-full py-16 lg:py-24 bg-gradient-to-b from-white via-[#FAF8F5] to-[#FAF8F5] border-t border-b border-[#E7E2D8]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D97706]/30 bg-[#D97706]/10 px-4 py-1.5 text-xs font-bold text-[#D97706] mb-3">
            <Wrench className="h-3.5 w-3.5" />
            <span>How It Works</span>
          </div>
          <h2
            className="text-3xl font-extrabold tracking-tight text-[#1E2026] sm:text-4xl"
            style={{ fontFamily: "'Space Grotesk', ui-sans-serif, system-ui" }}
          >
            Book Your Service in 3 Easy Steps
          </h2>
          <p className="mt-3 text-sm text-[#6B7280]">
            Getting professional repair & maintenance done has never been simpler. Here is how FixItNow works from request to completion.
          </p>
        </div>

        {/* 3 Step Cards Layout */}
        <div className="relative grid gap-8 lg:grid-cols-3">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative flex flex-col justify-between rounded-3xl border border-[#E7E2D8] bg-white p-8 shadow-sm transition-all duration-300 hover:border-[#D97706]/40 hover:shadow-xl group"
              >
                {/* Step Number Accent */}
                <div className="flex items-center justify-between border-b border-[#E7E2D8]/60 pb-6 mb-6">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#171B21] text-white font-extrabold text-lg shadow-md group-hover:bg-[#D97706] transition-colors">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="text-4xl font-extrabold tracking-tight text-[#E7E2D8] group-hover:text-[#D97706]/30 transition-colors">
                    {step.number}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-[#1E2026] group-hover:text-[#B45309] transition-colors">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-xs text-[#6B7280] leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-8 flex items-center gap-2 text-xs font-bold text-[#D97706]">
                  <span>Step {step.number} Details</span>
                  <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
