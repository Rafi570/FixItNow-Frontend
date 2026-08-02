import Link from "next/link";
import { Wrench, Mail, Phone } from "lucide-react";

const columns = [
  {
    title: "For customers",
    links: [
      { label: "Browse services", href: "/services" },
      { label: "Find a technician", href: "/technicians" },
      { label: "How booking works", href: "/how-it-works" },
      { label: "Track a booking", href: "/bookings" },
    ],
  },
  {
    title: "For technicians",
    links: [
      { label: "Join as a technician", href: "/register?role=technician" },
      { label: "Manage your services", href: "/technician/services" },
      { label: "Booking requests", href: "/technician/bookings" },
      { label: "Payouts", href: "/technician/payments" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About FixItNow", href: "/about" },
      { label: "Service categories", href: "/categories" },
      { label: "Contact support", href: "/contact" },
      { label: "Terms & privacy", href: "/legal" },
    ],
  },
];

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M13.5 21v-7.5h2.5l.4-3H13.5V8.4c0-.87.24-1.46 1.49-1.46H16.5V4.35A20 20 0 0 0 14.2 4.2c-2.28 0-3.84 1.39-3.84 3.95v2.35H8v3h2.36V21h3.14Z" />
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
    <circle cx="12" cy="12" r="3.6" />
    <circle cx="17.1" cy="6.9" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M4 4h3.6l4.2 5.6L16.6 4H20l-6.2 7.9L20.4 20h-3.6l-4.5-5.9L7 20H3.6l6.5-8.3L4 4Z" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-[#FAF8F5] via-[#F4EFE6] to-[#EFEAE1] text-[#4A4E58]">
      {/* Torn service-ticket edge */}
      <div
        className="h-3 w-full"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent, transparent 10px, #FFFFFF 10px, #FFFFFF 11px)",
          backgroundColor: "#FAF8F5",
          maskImage:
            "radial-gradient(circle at 6px 0, transparent 6px, black 6.5px)",
          maskSize: "12px 12px",
          maskRepeat: "repeat-x",
          maskPosition: "top",
        }}
        aria-hidden="true"
      />

      {/* Warm Golden Light Glow */}
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-80 w-[42rem] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, #D97706, #F59E0B, transparent 70%)" }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {/* Brand column */}
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D97706]/30 bg-gradient-to-br from-[#F59E0B]/20 via-[#D97706]/10 to-white shadow-md shadow-[#D97706]/10">
                <Wrench className="h-5 w-5 text-[#B45309]" strokeWidth={2} />
              </span>
              <span
                className="text-xl font-bold tracking-tight text-[#1E2026]"
                style={{ fontFamily: "'Space Grotesk', ui-sans-serif, system-ui" }}
              >
                FixIt<span className="bg-gradient-to-r from-[#D97706] to-[#B45309] bg-clip-text text-transparent">Now</span>
              </span>
            </Link>
            <p className="mt-4 max-w-[25ch] text-xs leading-relaxed text-[#6B707E]">
              Your trusted home service platform — vetted technicians, booked and paid in minutes.
            </p>

            {/* Social Icons */}
            <div className="mt-6 flex items-center gap-2.5">
              {[
                { label: "Facebook", icon: FacebookIcon },
                { label: "Instagram", icon: InstagramIcon },
                { label: "X (Twitter)", icon: XIcon },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href="#"
                  aria-label={social.label}
                  className="group flex h-9 w-9 items-center justify-center rounded-full border border-[#D97706]/20 bg-white/70 text-[#5C616E] shadow-sm transition-all hover:border-[#D97706] hover:bg-[#D97706] hover:text-white hover:shadow-md hover:shadow-[#D97706]/20"
                >
                  <social.icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#B45309]">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[13px] font-medium text-[#6B707E] transition-all duration-200 hover:text-[#B45309] hover:translate-x-0.5 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Availability Strip - Clean Luxury Light Glass */}
        <div className="mt-12 flex flex-col gap-4 rounded-2xl border border-[#D97706]/15 bg-white/60 p-5 shadow-lg shadow-[#D97706]/5 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5 text-xs font-semibold text-[#2D313A]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#059669] opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#059669]" />
            </span>
            Support available 24/7 for urgent repairs
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-[#4A4E58]">
            <a href="mailto:support@fixitnow.com" className="flex items-center gap-2 transition-colors hover:text-[#B45309]">
              <Mail className="h-4 w-4 text-[#D97706]" />
              support@fixitnow.com
            </a>
            <a href="tel:+8801700000000" className="flex items-center gap-2 transition-colors hover:text-[#B45309]">
              <Phone className="h-4 w-4 text-[#D97706]" />
              +880 1700-000000
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-[#D97706]/15 pt-6 text-xs font-medium text-[#828795] sm:flex-row">
          <p>© {new Date().getFullYear()} FixItNow. All rights reserved.</p>
          <p className="tracking-wide">Crafted for trusted home services in Bangladesh.</p>
        </div>
      </div>
    </footer>
  );
}