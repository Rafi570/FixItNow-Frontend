import { getTechniciansAction } from "@/src/actions/admin.actions";
import { User, MapPin, Star } from "lucide-react";

export default async function TechniciansPage() {
  const res = await getTechniciansAction();
  const technicians = res?.success ? res.data : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 bg-[#FAF8F5]">
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#1E2026]">Our Professional Technicians</h1>
        <p className="mt-3 text-sm text-[#6B7280]">
          Meet our verified local experts equipped with tools and skills to solve your issues quickly.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {technicians
          .filter((tech: any) => tech.user?.status !== "BANNED")
          .map((tech: any) => (
            <div
              key={tech.id}
              className="group flex flex-col justify-between rounded-2xl border border-[#E7E2D8] bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#D97706]/40 hover:shadow-md"
            >
              <div>
                <div className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D97706]/10 text-[#D97706]">
                  <User className="h-7 w-7" />
                  <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white border-2 border-white">
                    ✓
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#1E2026]">
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
                      {tech.skills.map((skill: string) => (
                        <span
                          key={skill}
                          className="rounded-md bg-[#FAF8F5] border border-[#E7E2D8] px-1.5 py-0.5 text-[10px] font-bold text-[#4B5563]"
                        >
                          {skill}
                        </span>
                      ))}
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
            </div>
          ))}

        {technicians.length === 0 && (
          <div className="col-span-full py-16 text-center text-[#6B7280]">
            No technicians registered at the moment.
          </div>
        )}
      </div>
    </div>
  );
}
