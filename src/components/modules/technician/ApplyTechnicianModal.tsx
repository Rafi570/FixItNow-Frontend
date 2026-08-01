"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Wrench, X, CheckCircle2, AlertCircle, Loader2, Plus, Tag } from "lucide-react";
import { applyTechnicianAction } from "@/src/actions/technicianApplication.actions";
import { getCategories } from "@/src/actions/category.actions";
import { useRouter } from "next/navigation";

interface ApplyTechnicianModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
  userName?: string;
  initialStatus?: string | null;
}

export default function ApplyTechnicianModal({
  isOpen,
  onClose,
  userName,
  userEmail,
  initialStatus,
}: ApplyTechnicianModalProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkillInput, setCustomSkillInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    bio: "",
    experience: "2",
    hourlyRate: "25",
    location: "",
  });

  useEffect(() => {
    setMounted(true);
    const fetchCats = async () => {
      const res = await getCategories();
      if (res?.success && Array.isArray(res.data)) {
        setCategories(res.data);
      }
    };
    fetchCats();
  }, []);

  if (!isOpen || !mounted) return null;

  const handleAddCategorySkill = (categoryName: string) => {
    if (!categoryName) return;
    if (!selectedSkills.includes(categoryName)) {
      setSelectedSkills([...selectedSkills, categoryName]);
    }
  };

  const handleAddCustomSkill = () => {
    const trimmed = customSkillInput.trim();
    if (trimmed && !selectedSkills.includes(trimmed)) {
      setSelectedSkills([...selectedSkills, trimmed]);
      setCustomSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSkills.length === 0) {
      setError("Please select or add at least one skill/category.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const res = await applyTechnicianAction({
      bio: formData.bio,
      experience: parseInt(formData.experience) || 0,
      skills: selectedSkills,
      hourlyRate: parseFloat(formData.hourlyRate) || 0,
      location: formData.location,
    });

    setLoading(false);

    if (res.success) {
      setSuccess("Your application to become a technician has been submitted successfully! Redirecting to Admin review...");
      setTimeout(() => {
        onClose();
        router.refresh();
      }, 2000);
    } else {
      setError(res.message || "Failed to submit application");
    }
  };

  const modalContent = (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative my-auto w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-[#E7E2D8] bg-[#FBFAF7] p-6 shadow-2xl sm:p-8 animate-in zoom-in-95 duration-150"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-[#EFECE6] text-[#5B6472] transition-colors hover:bg-[#E2DDD3] hover:text-[#171B21]"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#171B21] to-[#2A303B] shadow-md shadow-[#171B21]/20">
            <Wrench className="h-6 w-6 text-[#E8912B]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#171B21]" style={{ fontFamily: "'Space Grotesk', ui-sans-serif, system-ui" }}>
              Apply to Technician
            </h2>
            <p className="text-xs font-medium text-[#5B6472]">
              Select your service categories & skill set
            </p>
          </div>
        </div>

        {initialStatus === "PENDING" && (
          <div className="mt-5 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-800">
            <div className="flex items-center gap-2 font-semibold">
              <CheckCircle2 className="h-5 w-5 text-amber-600" />
              <span>Application Under Review</span>
            </div>
            <p className="mt-1 text-xs text-amber-700">
              Your application was already submitted and is currently being reviewed by the Admin team.
            </p>
          </div>
        )}

        {error && (
          <div className="mt-5 flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mt-5 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-800">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{success}</span>
          </div>
        )}

        {/* Application Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5B6472]">
                Full Name
              </label>
              <input
                type="text"
                disabled
                value={userName || "Customer"}
                className="mt-1 w-full rounded-xl border border-[#E7E2D8] bg-[#EFECE6]/50 px-3.5 py-2.5 text-sm font-semibold text-[#171B21] cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5B6472]">
                Email Address
              </label>
              <input
                type="text"
                disabled
                value={userEmail || ""}
                className="mt-1 w-full rounded-xl border border-[#E7E2D8] bg-[#EFECE6]/50 px-3.5 py-2.5 text-sm font-semibold text-[#171B21] cursor-not-allowed truncate"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5B6472]">
                Years of Experience
              </label>
              <input
                type="number"
                min="0"
                required
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                placeholder="e.g. 3"
                className="mt-1 w-full rounded-xl border border-[#E7E2D8] bg-white px-3.5 py-2.5 text-sm font-medium text-[#171B21] focus:border-[#E8912B] focus:outline-none focus:ring-1 focus:ring-[#E8912B]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#5B6472]">
                Hourly Rate ($/hr)
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                required
                value={formData.hourlyRate}
                onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                placeholder="e.g. 25"
                className="mt-1 w-full rounded-xl border border-[#E7E2D8] bg-white px-3.5 py-2.5 text-sm font-medium text-[#171B21] focus:border-[#E8912B] focus:outline-none focus:ring-1 focus:ring-[#E8912B]"
              />
            </div>
          </div>

          {/* Skills / Categories Section */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#5B6472]">
              Skills & Categories Dropdown
            </label>

            {/* Category Select Dropdown */}
            <div className="flex gap-2">
              <select
                onChange={(e) => {
                  handleAddCategorySkill(e.target.value);
                  e.target.value = "";
                }}
                defaultValue=""
                className="w-full rounded-xl border border-[#E7E2D8] bg-white px-3.5 py-2.5 text-sm font-semibold text-[#171B21] focus:border-[#E8912B] focus:outline-none focus:ring-1 focus:ring-[#E8912B]"
              >
                <option value="" disabled>
                  -- Select Category Skill --
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Skill Input */}
            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={customSkillInput}
                onChange={(e) => setCustomSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCustomSkill();
                  }
                }}
                placeholder="Or type custom skill and press add..."
                className="w-full rounded-xl border border-[#E7E2D8] bg-white px-3.5 py-2.5 text-sm font-medium text-[#171B21] focus:border-[#E8912B] focus:outline-none focus:ring-1 focus:ring-[#E8912B]"
              />
              <button
                type="button"
                onClick={handleAddCustomSkill}
                className="flex items-center gap-1 rounded-xl bg-[#171B21] px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#2A303B]"
              >
                <Plus className="h-4 w-4" /> Add
              </button>
            </div>

            {/* Selected Skills Badges */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {selectedSkills.length === 0 ? (
                <p className="text-xs text-[#9CA3AF] italic">
                  No skills selected yet. Choose from category dropdown above.
                </p>
              ) : (
                selectedSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#E8912B]/40 bg-[#E8912B]/10 px-3 py-1 text-xs font-bold text-[#171B21]"
                  >
                    <Tag className="h-3 w-3 text-[#E8912B]" />
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-0.5 rounded-full text-[#5B6472] hover:bg-[#E8912B]/20 hover:text-[#171B21]"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#5B6472]">
              Location / Service Area
            </label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. New York, NY"
              className="mt-1 w-full rounded-xl border border-[#E7E2D8] bg-white px-3.5 py-2.5 text-sm font-medium text-[#171B21] focus:border-[#E8912B] focus:outline-none focus:ring-1 focus:ring-[#E8912B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#5B6472]">
              Professional Bio & Experience Summary
            </label>
            <textarea
              rows={3}
              required
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Describe your expertise, certifications, and services offered..."
              className="mt-1 w-full rounded-xl border border-[#E7E2D8] bg-white px-3.5 py-2.5 text-sm font-medium text-[#171B21] focus:border-[#E8912B] focus:outline-none focus:ring-1 focus:ring-[#E8912B]"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#171B21] py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-[#2A303B] active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting Application...
                </>
              ) : (
                <>
                  <Wrench className="h-4 w-4 text-[#E8912B]" />
                  Submit Application to Admin
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
