"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, MapPin, Star, X, Briefcase, Mail, Phone, Shield } from "lucide-react";

interface TechniciansListProps {
  initialTechnicians: any[];
}

export default function TechniciansList({ initialTechnicians }: TechniciansListProps) {
  const router = useRouter();
  const [selectedTech, setSelectedTech] = useState<any | null>(null);

  const activeTechnicians = initialTechnicians.filter(
    (tech: any) => tech.user?.status !== "BANNED"
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 bg-[#FAF8F5]">
      {/* Header */}
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#1E2026]">
          Our Professional Technicians
        </h1>
        <p className="mt-3 text-sm text-[#6B7280]">
          Meet our verified local experts equipped with tools and skills to solve your issues quickly.
        </p>
      </div>

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {activeTechnicians.map((tech: any) => (
          <div
            key={tech.id}
            onClick={() => setSelectedTech(tech)}
            className="group flex flex-col justify-between rounded-2xl border border-[#E7E2D8] bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#D97706]/40 hover:shadow-md cursor-pointer"
          >
            <div>
              <div className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D97706]/10 text-[#D97706]">
                <User className="h-7 w-7" />
                <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white border-2 border-white">
                  ✓
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#1E2026] group-hover:text-[#B45309] transition-colors">
                {tech.user?.name || "Verified Expert"}
              </h3>
              <div className="mt-1 flex items-center gap-1 text-xs text-[#D97706] font-bold">
                <Star className="h-3.5 w-3.5 fill-[#D97706]" />
                <span>{tech.ratingAvg ? Number(tech.ratingAvg).toFixed(1) : "5.0"}</span>
                <span className="text-[#9CA3AF] font-normal">({tech.ratingCount || 0} reviews)</span>
              </div>

              <div className="mt-4 space-y-2">
                {tech.skills && tech.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {tech.skills.slice(0, 3).map((skill: string) => (
                      <span
                        key={skill}
                        className="rounded-md bg-[#FAF8F5] border border-[#E7E2D8] px-1.5 py-0.5 text-[10px] font-bold text-[#4B5563]"
                      >
                        {skill}
                      </span>
                    ))}
                    {tech.skills.length > 3 && (
                      <span className="rounded-md bg-[#FAF8F5] border border-[#E7E2D8] px-1.5 py-0.5 text-[10px] font-bold text-[#D97706]">
                        +{tech.skills.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {tech.location && (
                  <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span>{tech.location}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E7E2D8]/60 flex items-center justify-between">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/services?technician=${tech.id}`);
                }}
                className="w-full text-center rounded-xl bg-[#171B21] hover:bg-[#E8912B] hover:text-[#171B21] py-2 text-xs font-bold text-white transition-all shadow-xs"
              >
                View Services
              </button>
            </div>
          </div>
        ))}

        {activeTechnicians.length === 0 && (
          <div className="col-span-full py-16 text-center text-[#6B7280]">
            No technicians registered at the moment.
          </div>
        )}
      </div>

      {/* Technician Profile Details Modal */}
      {selectedTech && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl border border-[#E7E2D8] bg-white p-8 shadow-2xl animate-in fade-in-50 zoom-in-95 text-left">
            {/* Close Button */}
            <button
              onClick={() => setSelectedTech(null)}
              className="absolute right-4 top-4 text-[#9CA3AF] hover:text-[#1E2026] p-1.5 rounded-lg hover:bg-gray-100 transition-all"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Profile Header */}
            <div className="flex items-start gap-4 border-b border-[#E7E2D8] pb-5 mb-6">
              <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#D97706]/10 text-[#D97706]">
                <User className="h-8 w-8" />
                <span className="absolute -bottom-1 -right-1 flex h-5.5 w-5.5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white border-2 border-white">
                  ✓
                </span>
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-[#1E2026]">
                  {selectedTech.user?.name}
                </h2>
                <div className="mt-1 flex items-center gap-1.5 text-sm text-[#D97706] font-bold">
                  <Star className="h-4 w-4 fill-[#D97706]" />
                  <span>{selectedTech.ratingAvg ? Number(selectedTech.ratingAvg).toFixed(1) : "5.0"}</span>
                  <span className="text-[#9CA3AF] font-normal">({selectedTech.ratingCount || 0} reviews)</span>
                </div>
              </div>
            </div>

            {/* Profile Fields */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#6B7280] block mb-1">
                  Email Address
                </label>
                <div className="flex items-center gap-2 text-sm text-[#1E2026] bg-[#FAF8F5] border border-[#E7E2D8] rounded-xl p-3">
                  <Mail className="h-4 w-4 text-[#D97706]" />
                  <span>{selectedTech.user?.email || "No email available"}</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#6B7280] block mb-1">
                  Primary Location
                </label>
                <div className="flex items-center gap-2 text-sm text-[#1E2026] bg-[#FAF8F5] border border-[#E7E2D8] rounded-xl p-3">
                  <MapPin className="h-4 w-4 text-[#D97706]" />
                  <span>{selectedTech.location || "Not specified"}</span>
                </div>
              </div>

              {selectedTech.skills && selectedTech.skills.length > 0 && (
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#6B7280] block mb-2">
                    Professional Skills
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedTech.skills.map((skill: string) => (
                      <span
                        key={skill}
                        className="rounded-xl bg-[#FAF8F5] border border-[#E7E2D8] px-3 py-1.5 text-xs font-bold text-[#4B5563]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-xl bg-amber-50/50 border border-amber-200/60 p-4 flex gap-3 mt-2">
                <Shield className="h-5 w-5 text-[#D97706] shrink-0" />
                <div className="text-xs text-amber-800 leading-relaxed">
                  <strong className="font-bold">Verified Technician Guarantee:</strong> This provider is background-checked, certified, and vetted for quality services by the FixItNow Team.
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-8 pt-5 border-t border-[#E7E2D8] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedTech(null)}
                className="rounded-xl px-5 py-2.5 text-sm font-semibold text-[#6B7280] hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedTech(null);
                  router.push(`/services?technician=${selectedTech.id}`);
                }}
                className="rounded-xl bg-[#D97706] hover:bg-[#B45309] px-6 py-2.5 text-sm font-bold text-white transition-all shadow-sm"
              >
                Explore Services
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
