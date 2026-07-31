"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Search, SlidersHorizontal, ArrowUpDown, X, Loader2, CheckCircle2, AlertCircle, Calendar, MapPin, Wrench, Clock } from "lucide-react";
import { createBookingAction } from "@/src/actions/booking.actions";

interface PublicServicesProps {
  initialServices: any[];
  categories: any[];
  isLoggedIn: boolean;
  currentUser: any;
}

export default function PublicServices({
  initialServices,
  categories,
  isLoggedIn,
  currentUser,
}: PublicServicesProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [sortOption, setSortOption] = useState<string>("default");

  // Booking states
  const [bookingService, setBookingService] = useState<any | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingMessage, setBookingMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Initialize filter from URL Search Query Params (for Homepage & Navbar Redirection)
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      const found = categories.find(
        (c) => c.name.toLowerCase() === categoryParam.toLowerCase() || c.id === categoryParam
      );
      if (found) {
        setSelectedCategories([found.id]);
      }
    } else {
      setSelectedCategories([]);
    }

    const searchParam = searchParams.get("searchTerm");
    if (searchParam) {
      setSearchTerm(searchParam);
    } else {
      setSearchTerm("");
    }
  }, [searchParams, categories]);

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setMinPrice("");
    setMaxPrice("");
    setSortOption("default");
    router.replace("/services");
  };

  const selectedTechnicianId = searchParams.get("technician");
  const selectedTechName = selectedTechnicianId
    ? initialServices.find(
        (s) => s.technicianId === selectedTechnicianId || s.technician?.id === selectedTechnicianId
      )?.technician?.user?.name || "Selected Technician"
    : null;

  const handleClearTechnicianFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("technician");
    router.replace(`/services${params.toString() ? `?${params.toString()}` : ""}`);
  };

  // Filter & Sort Logic
  const filteredServices = initialServices
    .filter((service) => {
      // 1. Search term match
      const titleMatch = service.title.toLowerCase().includes(searchTerm.toLowerCase());
      const descMatch = service.description
        ? service.description.toLowerCase().includes(searchTerm.toLowerCase())
        : false;
      const searchMatch = titleMatch || descMatch;

      // 2. Category match
      const categoryMatch =
        selectedCategories.length === 0
          ? true
          : selectedCategories.includes(service.categoryId);

      // 3. Price match
      const priceVal = Number(service.price);
      const minMatch = minPrice === "" ? true : priceVal >= Number(minPrice);
      const maxMatch = maxPrice === "" ? true : priceVal <= Number(maxPrice);

      // 4. Technician match
      const technicianMatch = selectedTechnicianId
        ? service.technicianId === selectedTechnicianId || service.technician?.id === selectedTechnicianId
        : true;

      return searchMatch && categoryMatch && minMatch && maxMatch && technicianMatch;
    })
    .sort((a, b) => {
      if (sortOption === "price_asc") {
        return Number(a.price) - Number(b.price);
      }
      if (sortOption === "price_desc") {
        return Number(b.price) - Number(a.price);
      }
      if (sortOption === "title_asc") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  const handleBookingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!bookingService) return;

    setBookingLoading(true);
    setBookingMessage(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      serviceId: bookingService.id,
      scheduledAt: formData.get("scheduledAt") as string,
      address: formData.get("address") as string,
      note: formData.get("note") as string || undefined,
    };

    const res = await createBookingAction(payload);
    setBookingLoading(false);

    if (res.success) {
      setBookingMessage({ type: "success", text: res.message });
      setTimeout(() => {
        setBookingService(null);
        setBookingMessage(null);
        router.push("/dashboard/bookings");
      }, 1500);
    } else {
      setBookingMessage({ type: "error", text: res.message });
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-[#FAF8F5]">
      {/* Top Banner */}
      <div className="mb-8 rounded-2xl bg-gradient-to-r from-[#171B21] to-[#2A303B] p-8 text-white">
        <h1 className="text-3xl font-extrabold tracking-tight">Professional Services Directory</h1>
        <p className="mt-2 text-sm text-gray-300">
          Find, filter, and book certified local technicians for your household and business needs
        </p>
      </div>

      <div className="lg:grid lg:grid-cols-4 lg:gap-8">
        {/* Sidebar Filters - Ryans style */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl border border-[#E7E2D8] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#E7E2D8] pb-4">
              <h2 className="flex items-center gap-2 font-bold text-[#1E2026]">
                <SlidersHorizontal className="h-4.5 w-4.5 text-[#D97706]" /> Filters
              </h2>
              <button
                onClick={handleResetFilters}
                className="text-xs font-bold text-[#B45309] hover:underline"
              >
                Reset All
              </button>
            </div>

            {/* Search filter */}
            <div className="mt-4 border-b border-[#E7E2D8]/60 pb-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4B5563] mb-2">
                Search Keyword
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
                <input
                  type="text"
                  placeholder="e.g. cleaning, repair..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-[#E7E2D8] bg-[#FAF8F5] pl-9 pr-4 py-2.5 text-sm text-[#1E2026] outline-none transition-all focus:border-[#D97706]"
                />
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="mt-5 border-b border-[#E7E2D8]/60 pb-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4B5563] mb-3">
                Price Range ($)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full rounded-xl border border-[#E7E2D8] bg-[#FAF8F5] px-3 py-2 text-xs text-[#1E2026] outline-none focus:border-[#D97706]"
                />
                <span className="text-[#9CA3AF]">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full rounded-xl border border-[#E7E2D8] bg-[#FAF8F5] px-3 py-2 text-xs text-[#1E2026] outline-none focus:border-[#D97706]"
                />
              </div>
            </div>

            {/* Categories filter */}
            <div className="mt-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4B5563] mb-3">
                Categories
              </label>
              <div className="max-h-60 overflow-y-auto space-y-2.5 pr-2 no-scrollbar">
                {categories.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.id)}
                      onChange={() => handleCategoryToggle(cat.id)}
                      className="h-4.5 w-4.5 rounded border-[#E7E2D8] text-[#D97706] focus:ring-[#D97706]"
                    />
                    <span className="text-sm text-[#4B5563] hover:text-[#1E2026] transition-colors">
                      {cat.name}
                    </span>
                  </label>
                ))}
                {categories.length === 0 && (
                  <p className="text-xs text-[#9CA3AF] italic">No categories found</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right side Main Content Area */}
        <div className="mt-6 lg:col-span-3 lg:mt-0 space-y-6">
          {/* Top Sort and Info Bar */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-[#E7E2D8] bg-white px-5 py-3 shadow-sm">
            <span className="text-sm font-semibold text-[#4B5563]">
              <span className="text-[#1E2026] font-bold">{filteredServices.length}</span> services found
            </span>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-[#6B7280]" />
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="rounded-xl border border-[#E7E2D8] bg-white px-3.5 py-1.5 text-xs text-[#1E2026] outline-none transition-all focus:border-[#D97706]"
              >
                <option value="default">Default Sort</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="title_asc">Title: A to Z</option>
              </select>
            </div>
          </div>

          {/* Technician Filter Active Banner */}
          {selectedTechName && (
            <div className="flex items-center justify-between rounded-2xl bg-amber-50 border border-amber-200/60 px-5 py-3 shadow-xs">
              <div className="flex items-center gap-2 text-sm text-amber-800">
                <Wrench className="h-4 w-4 text-[#D97706]" />
                <span>
                  Showing services provided by <strong className="font-extrabold">{selectedTechName}</strong>
                </span>
              </div>
              <button
                onClick={handleClearTechnicianFilter}
                className="text-xs font-bold text-amber-900 hover:text-amber-700 bg-amber-100 hover:bg-amber-200/80 px-2.5 py-1 rounded-lg transition-all"
              >
                Clear Filter
              </button>
            </div>
          )}

          {/* Services Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="group flex flex-col justify-between rounded-2xl border border-[#E7E2D8] bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#D97706]/40 hover:shadow-lg hover:shadow-[#D97706]/5"
              >
                <div>
                  {/* Category Tag */}
                  <div className="mb-3.5 flex items-center justify-between">
                    <span className="inline-flex items-center rounded-full bg-[#D97706]/10 px-2.5 py-0.5 text-xs font-bold text-[#B45309]">
                      {service.category?.name || "Service"}
                    </span>
                    {service.durationMins && (
                      <span className="flex items-center gap-1 text-xs text-[#6B7280]">
                        <Clock className="h-3.5 w-3.5" /> {service.durationMins} mins
                      </span>
                    )}
                  </div>

                  {/* Title & Desc */}
                  <h3 className="text-md font-bold text-[#1E2026] line-clamp-1 group-hover:text-[#B45309] transition-colors">
                    <Link href={`/services/${service.id}`} className="hover:underline">
                      {service.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-xs text-[#6B7280] line-clamp-3 min-h-[48px]">
                    {service.description || "No service details provided."}
                  </p>

                  {/* Technician Info */}
                  <div className="mt-4 rounded-xl bg-[#FAF8F5] p-3 border border-[#E7E2D8]/60 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#4B5563]">
                      <Wrench className="h-3.5 w-3.5 text-[#D97706]" />
                      <span>{service.technician?.user?.name || "Verified Provider"}</span>
                    </div>
                    {service.technician?.location && (
                      <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span>{service.technician.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer and Booking Button */}
                <div className="mt-5 pt-4 border-t border-[#E7E2D8]/60 flex items-center justify-between">
                  <div className="flex items-baseline">
                    <span className="text-xl font-extrabold text-[#1E2026]">${service.price}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/services/${service.id}`}
                      className="rounded-xl border border-[#E7E2D8] bg-white px-3.5 py-2 text-xs font-bold text-[#4B5563] transition-all hover:bg-[#FAF8F5] hover:text-[#1E2026] shadow-xs"
                    >
                      Details
                    </Link>
                    <button
                      onClick={() => setBookingService(service)}
                      className="rounded-xl bg-[#171B21] hover:bg-[#E8912B] hover:text-[#171B21] px-3.5 py-2 text-xs font-bold text-white transition-all shadow-sm"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="rounded-2xl border border-[#E7E2D8] bg-white py-16 text-center shadow-sm">
              <AlertCircle className="mx-auto h-10 w-10 text-[#9CA3AF]" />
              <h3 className="mt-4 text-md font-bold text-[#1E2026]">No services match your criteria</h3>
              <p className="mt-1 text-xs text-[#6B7280]">
                Try relaxing your filter parameters or resetting all criteria.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-4 rounded-xl bg-[#D97706] hover:bg-[#B45309] px-4 py-2 text-xs font-bold text-white transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Booking Form Modal */}
      {bookingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl border border-[#E7E2D8] bg-white p-6 shadow-2xl animate-in fade-in-50 zoom-in-95">
            <button
              onClick={() => {
                setBookingService(null);
                setBookingMessage(null);
              }}
              className="absolute right-4 top-4 text-[#9CA3AF] hover:text-[#1E2026]"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-[#E7E2D8] pb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D97706]/10 text-[#D97706]">
                <Calendar className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-[#1E2026]">Book Service</h3>
                <p className="text-xs text-[#6B7280]">Schedule slot and specify location details</p>
              </div>
            </div>

            {bookingMessage && (
              <div
                className={`mt-4 flex items-center gap-2 rounded-xl p-3 text-xs font-semibold ${
                  bookingMessage.type === "success"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {bookingMessage.type === "success" ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 shrink-0" />
                )}
                <span>{bookingMessage.text}</span>
              </div>
            )}

            {!isLoggedIn ? (
              <div className="mt-6 text-center space-y-4 py-4">
                <AlertCircle className="mx-auto h-12 w-12 text-[#D97706]" />
                <h4 className="text-md font-bold text-[#1E2026]">Login Required</h4>
                <p className="text-xs text-[#6B7280]">
                  You must be logged in as a Customer to book a professional service.
                </p>
                <button
                  onClick={() => router.push(`/login?redirect=/services`)}
                  className="w-full rounded-xl bg-[#171B21] hover:bg-[#2A303B] py-3 text-xs font-bold text-white transition-colors"
                >
                  Log In Now
                </button>
              </div>
            ) : currentUser?.role !== "CUSTOMER" ? (
              <div className="mt-6 text-center space-y-4 py-4">
                <AlertCircle className="mx-auto h-12 w-12 text-[#EF4444]" />
                <h4 className="text-md font-bold text-[#1E2026]">Account Restriction</h4>
                <p className="text-xs text-[#6B7280]">
                  Only Customer accounts can book services. You are currently logged in as a {currentUser?.role}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4B5563]">
                    Selected Service
                  </label>
                  <div className="mt-1.5 flex justify-between items-center rounded-xl border border-[#E7E2D8] bg-[#FAF8F5] px-3.5 py-2.5">
                    <div>
                      <div className="text-sm font-bold text-[#1E2026]">{bookingService.title}</div>
                      <div className="text-xs text-[#6B7280]">Provider: {bookingService.technician?.user?.name}</div>
                    </div>
                    <div className="text-md font-extrabold text-[#D97706]">${bookingService.price}</div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4B5563]">
                    Preferred Schedule *
                  </label>
                  <input
                    type="datetime-local"
                    name="scheduledAt"
                    required
                    className="mt-1.5 w-full rounded-xl border border-[#E7E2D8] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#1E2026] outline-none focus:border-[#D97706]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4B5563]">
                    Service Address *
                  </label>
                  <textarea
                    name="address"
                    required
                    rows={2}
                    placeholder="Enter full address for the home service appointment..."
                    className="mt-1.5 w-full rounded-xl border border-[#E7E2D8] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#1E2026] outline-none focus:border-[#D97706]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#4B5563]">
                    Special Instructions / Note
                  </label>
                  <textarea
                    name="note"
                    rows={2}
                    placeholder="Add optional notes or descriptions of requirements..."
                    className="mt-1.5 w-full rounded-xl border border-[#E7E2D8] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#1E2026] outline-none focus:border-[#D97706]"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setBookingService(null);
                      setBookingMessage(null);
                    }}
                    className="rounded-xl px-4 py-2 text-sm font-semibold text-[#6B7280] hover:bg-[#FAF8F5]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="flex items-center gap-2 rounded-xl bg-[#D97706] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#B45309] disabled:opacity-50"
                  >
                    {bookingLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Booking...
                      </>
                    ) : (
                      "Confirm Booking"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
