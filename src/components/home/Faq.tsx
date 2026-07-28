"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "How do I book a technician on FixItNow?",
    answer:
      "Simply search for the service you need, choose a verified technician based on reviews and pricing, pick a convenient time slot, and confirm your booking.",
  },
  {
    question: "Are the technicians background-checked and verified?",
    answer:
      "Yes! Every technician undergoes a thorough background check, skill assessment, and NID verification before joining our platform.",
  },
  {
    question: "What if I am not satisfied with the repair service?",
    answer:
      "Your satisfaction is covered by our Service Guarantee. If something isn't fixed properly, contact our support team within 7 days, and we will resolve it at no extra cost.",
  },
  {
    question: "How does payment work?",
    answer:
      "You can pay securely online via digital payment options (Mobile Banking/Cards) or choose Cash on Service once the job is completed.",
  },
  {
    question: "Can I cancel or reschedule my booking?",
    answer:
      "Yes, you can cancel or reschedule your booking free of charge up to 2 hours before the scheduled service time directly from your dashboard.",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-[#FAF8F5] py-16 lg:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#D97706]/30 bg-[#D97706]/10 text-[#B45309]">
            <HelpCircle className="h-5 w-5" />
          </div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#1E2026] sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-sm text-[#6B707E]">
            Have questions? We’ve got answers to help you get started with FixItNow.
          </p>
        </div>

        {/* FAQ List */}
        <div className="mt-10 space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-[#D97706]/15 bg-white shadow-sm transition-all duration-200 hover:border-[#D97706]/30"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center justify-between p-5 text-left font-semibold text-[#1E2026] transition-colors hover:text-[#B45309]"
                >
                  <span className="text-base">{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-[#D97706] transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="border-t border-[#D97706]/10 bg-[#FAF8F5]/50 px-5 py-4 text-sm leading-relaxed text-[#6B707E]">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact Callout */}
        <div className="mt-10 rounded-2xl border border-[#D97706]/20 bg-gradient-to-r from-[#F4EFE6] to-[#EFEAE1] p-6 text-center shadow-sm">
          <p className="text-sm font-semibold text-[#1E2026]">
            Still have questions?
          </p>
          <p className="mt-1 text-xs text-[#6B707E]">
            Our support team is available 24/7 to help you with any issue.
          </p>
          <a
            href="/contact"
            className="mt-4 inline-block rounded-xl bg-[#D97706] px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-[#D97706]/20 transition-all hover:bg-[#B45309]"
          >
            Contact Support
          </a>
        </div>

      </div>
    </section>
  );
}