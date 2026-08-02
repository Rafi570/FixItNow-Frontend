import Link from "next/link";
import { cookies } from "next/headers";
import { Wrench, User, LayoutDashboard } from "lucide-react";
import NavSearch from "./NavSearch";
import LogoutButton from "./LogoutButton";
import MobileMenu from "./MobileMenu";
import ApplyTechnicianButton from "./ApplyTechnicianButton";
import { getMeAction } from "../../actions/auth.actions";
import { getCategories } from "../../actions/category.actions";
import { getMyTechnicianApplicationAction } from "../../actions/technicianApplication.actions";

const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Technicians", href: "/technicians" },
];

export default async function Navbar() {
  // সার্ভার সাইডে কুকি রিড করে চেক করা
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const isLoggedIn = !!token;

  const meRes = await getMeAction();
  const currentUser = meRes?.success ? meRes.data : null;

  const categoriesRes = await getCategories();
  const navbarCategories = categoriesRes?.success ? categoriesRes.data : [];

  const myAppRes = isLoggedIn ? await getMyTechnicianApplicationAction() : null;
  const applicationStatus = myAppRes?.success && myAppRes.data ? myAppRes.data.status : null;

  return (
    <header className="sticky top-0 z-50 border-b border-[#E7E2D8] bg-[#FBFAF7]/95 backdrop-blur supports-[backdrop-filter]:bg-[#FBFAF7]/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#171B21]">
            <Wrench className="h-5 w-5 text-[#E8912B]" strokeWidth={2.25} />
          </span>
          <span
            className="inline-block text-base sm:text-lg font-semibold tracking-tight text-[#171B21]"
            style={{ fontFamily: "'Space Grotesk', ui-sans-serif, system-ui" }}
          >
            FixIt<span className="text-[#E8912B]">Now</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden items-center gap-6 pl-4 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[#5B6472] transition-colors hover:text-[#171B21]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Search Bar Component */}
        <NavSearch categories={navbarCategories} />

        {/* Right side Auth Action Buttons */}
        <div className="ml-auto hidden items-center gap-3 lg:flex">
          {/* Apply to Technician Button */}
          <ApplyTechnicianButton
            isLoggedIn={isLoggedIn}
            userRole={currentUser?.role}
            userName={currentUser?.name}
            userEmail={currentUser?.email}
            applicationStatus={applicationStatus}
          />

          {isLoggedIn ? (
            <>
              <span className="text-xs font-semibold text-[#5B6472]">
                Hello, <span className="text-[#171B21] font-bold">{currentUser?.name || "User"}</span>
              </span>
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 text-sm font-medium text-[#171B21] hover:text-[#E8912B] transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              {/* Logout button */}
              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-[#5B6472] hover:text-[#171B21]"
              >
                Log in
              </Link>
              {/* Get started button only when logged out */}
              <Link
                href="/register"
                className="flex items-center gap-1.5 rounded-full bg-[#171B21] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2A303B]"
              >
                <User className="h-4 w-4" />
                Get started
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <MobileMenu
          navLinks={navLinks}
          isLoggedIn={isLoggedIn}
          userRole={currentUser?.role}
          userName={currentUser?.name}
          userEmail={currentUser?.email}
          applicationStatus={applicationStatus}
        />
      </div>
    </header>
  );
}