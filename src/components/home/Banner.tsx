// import Link from "next/link";
// import { Wrench, ShieldCheck, Clock, Search } from "lucide-react";

// export default function Banner() {
//   return (
//     <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF8F5] via-[#F4EFE6] to-[#EFEAE1] py-20 lg:py-28">
//       {/* Background Ambient Warm Glow */}
//       <div
//         className="pointer-events-none absolute -top-40 left-1/2 h-[30rem] w-[50rem] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
//         style={{ background: "radial-gradient(circle, #D97706, #F59E0B, transparent 70%)" }}
//         aria-hidden="true"
//       />

//       <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         <div className="mx-auto max-w-3xl text-center">
          
//           {/* Badge */}
//           <div className="inline-flex items-center gap-2 rounded-full border border-[#D97706]/30 bg-white/70 px-4 py-1.5 text-xs font-semibold text-[#B45309] shadow-sm backdrop-blur-md">
//             <ShieldCheck className="h-4 w-4 text-[#D97706]" />
//             #1 Trusted Home Services in Bangladesh
//           </div>

//           {/* Headline */}
//           <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-[#1E2026] sm:text-5xl lg:text-6xl">
//             Expert Repairs & Home Services,{" "}
//             <span className="bg-gradient-to-r from-[#D97706] to-[#B45309] bg-clip-text text-transparent">
//               Booked in Minutes
//             </span>
//           </h1>

//           {/* Subtitle */}
//           <p className="mt-5 text-base leading-relaxed text-[#6B707E] sm:text-lg">
//             Connect with background-checked local technicians. Fast, transparent pricing, and guaranteed satisfaction for every repair.
//           </p>

//           {/* Search / CTA Box */}
//           <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
//             <div className="relative w-full max-w-md">
//               <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#828795]" />
//               <input
//                 type="text"
//                 placeholder="What service do you need? (e.g. AC Repair, Plumbing)"
//                 className="w-full rounded-xl border border-[#D97706]/20 bg-white py-3.5 pl-11 pr-4 text-sm text-[#1E2026] shadow-sm placeholder:text-[#9EA3AE] focus:border-[#D97706] focus:outline-none focus:ring-2 focus:ring-[#D97706]/20"
//               />
//             </div>
//             <Link
//               href="/services"
//               className="w-full rounded-xl bg-gradient-to-r from-[#D97706] to-[#B45309] px-6 py-3.5 text-center text-sm font-semibold text-white shadow-lg shadow-[#D97706]/25 transition-all hover:opacity-95 sm:w-auto"
//             >
//               Book Service
//             </Link>
//           </div>

//           {/* Quick Stats / Highlights */}
//           <div className="mt-12 grid grid-cols-3 gap-4 border-t border-[#D97706]/15 pt-8">
//             <div className="text-center">
//               <p className="text-xl font-bold text-[#1E2026] sm:text-2xl">500+</p>
//               <p className="text-xs text-[#6B707E]">Verified Experts</p>
//             </div>
//             <div className="text-center">
//               <p className="text-xl font-bold text-[#1E2026] sm:text-2xl">10k+</p>
//               <p className="text-xs text-[#6B707E]">Jobs Completed</p>
//             </div>
//             <div className="text-center">
//               <p className="text-xl font-bold text-[#1E2026] sm:text-2xl">24/7</p>
//               <p className="text-xs text-[#6B707E]">Emergency Service</p>
//             </div>
//           </div>

//         </div>
//       </div>
//     </section>
//   );
// }




import Link from "next/link";
import { ShieldCheck, ArrowRight, Star } from "lucide-react";

export default function Banner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF8F5] via-[#F4EFE6] to-[#EFEAE1] py-20 lg:py-28">
      {/* Background Ambient Warm Glow */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[30rem] w-[50rem] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, #D97706, #F59E0B, transparent 70%)" }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          
          {/* Top Trust Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D97706]/30 bg-white/80 px-4 py-1.5 text-xs font-semibold text-[#B45309] shadow-sm backdrop-blur-md">
            <ShieldCheck className="h-4 w-4 text-[#D97706]" />
            #1 Trusted Home Services in Bangladesh
          </div>

          {/* Headline */}
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-[#1E2026] sm:text-5xl lg:text-6xl">
            Expert Repairs & Home Services,{" "}
            <span className="bg-gradient-to-r from-[#D97706] to-[#B45309] bg-clip-text text-transparent">
              Booked in Minutes
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-base leading-relaxed text-[#6B707E] sm:text-lg">
            Connect with background-checked local technicians. Transparent pricing, fast response, and guaranteed satisfaction for every repair.
          </p>

          {/* Action Buttons (No Searchbar) */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/services"
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#D97706] to-[#B45309] px-7 py-3.5 text-center text-sm font-semibold text-white shadow-lg shadow-[#D97706]/25 transition-all hover:opacity-95 sm:w-auto"
            >
              Book a Service
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            
            <Link
              href="/register?role=technician"
              className="w-full rounded-xl border border-[#D97706]/30 bg-white/70 px-7 py-3.5 text-center text-sm font-semibold text-[#1E2026] shadow-sm transition-all hover:bg-white hover:border-[#D97706] sm:w-auto"
            >
              Become a Technician
            </Link>
          </div>

          {/* Rating & Social Proof */}
          <div className="mt-8 flex items-center justify-center gap-3 text-xs text-[#6B707E]">
            <div className="flex text-[#F59E0B]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <span className="font-medium text-[#1E2026]">4.9/5</span>
            <span>•</span>
            <span>Over 10,000+ Happy Customers</span>
          </div>

          {/* Quick Stats Highlights */}
          <div className="mt-12 grid grid-cols-3 gap-4 border-t border-[#D97706]/15 pt-8">
            <div className="text-center">
              <p className="text-xl font-bold text-[#1E2026] sm:text-2xl">500+</p>
              <p className="text-xs text-[#6B707E]">Verified Experts</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-[#1E2026] sm:text-2xl">10k+</p>
              <p className="text-xs text-[#6B707E]">Jobs Completed</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-[#1E2026] sm:text-2xl">24/7</p>
              <p className="text-xs text-[#6B707E]">Urgent Support</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}