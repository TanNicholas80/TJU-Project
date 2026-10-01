"use client";

import * as React from "react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

function ShieldCheckIcon({ color }: { color: "blue" | "orange" }) {
  const isBlue = color === "blue";
  const fillColor = isBlue ? "#20449A" : "#F48902";

  return (
    <div className="shrink-0 mt-0.5">
      <svg
        className="h-5 w-5 drop-shadow-xs"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2L4 5.2V11.5C4 16.5 7.5 21 12 22C16.5 21 20 16.5 20 11.5V5.2L12 2Z"
          fill={fillColor}
        />
        <path
          d="M8.5 12L11 14.5L15.5 9.8"
          stroke="white"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export function ExpertiseSection() {
  const { t } = useI18n();

  const industrialPoints = [
    t("expertise.industrial.point1"),
    t("expertise.industrial.point2"),
    t("expertise.industrial.point3"),
  ];

  const residentialPoints = [
    t("expertise.residential.point1"),
    t("expertise.residential.point2"),
    t("expertise.residential.point3"),
  ];

  return (
    <section className="relative py-20 sm:py-28 overflow-hidden bg-white">
      {/* Background Grid Pattern with Top and Bottom Fade Out (Masking) */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(226, 232, 240, 0.8) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(226, 232, 240, 0.8) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          maskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header: Italic bold with orange underline accent */}
        <div className="text-center mb-16 sm:mb-24">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black italic tracking-tight text-[#1E1F24]">
            {t("expertise.sectionTitle")}
          </h2>
          <div className="w-24 sm:w-28 h-1 bg-[#F48902] mx-auto rounded-full mt-3.5" />
        </div>

        {/* Content Container: 2 Overlapping Block Sections */}
        <div className="space-y-24 sm:space-y-32">
          {/* 1. INDUSTRIAL & COMMERCIAL (Image Left, Card Right) */}
          <div className="relative flex flex-col lg:flex-row items-center justify-between">
            {/* Image (gambar_1.JPG) */}
            <div className="relative w-full lg:w-[58%] h-[340px] sm:h-[440px] lg:h-[480px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-slate-200/80">
              <Image
                src="/images/gambar_1.JPG"
                alt={t("expertise.industrial.title")}
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover object-center transition-transform duration-700 hover:scale-105"
              />
            </div>

            {/* Floating Overlap Card */}
            <div className="relative z-10 w-full lg:w-[48%] mt-[-40px] sm:mt-[-60px] lg:mt-0 lg:-ml-20 bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-11 shadow-2xl shadow-slate-900/10 border border-slate-100">
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1E1F24]">
                {t("expertise.industrial.title")}
              </h3>

              <p className="mt-4 text-sm sm:text-base text-[#62636C] leading-relaxed">
                {t("expertise.industrial.description")}
              </p>

              {/* Checklist Points */}
              <div className="mt-6 sm:mt-8 space-y-4">
                {industrialPoints.map((point, idx) => (
                  <div key={idx} className="flex items-center gap-3.5">
                    <ShieldCheckIcon color="blue" />
                    <span className="font-bold text-sm sm:text-base text-[#1E1F24] leading-snug">
                      {point}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 2. RESIDENTIAL (Card Left, Image Right) */}
          <div className="relative flex flex-col-reverse lg:flex-row items-center justify-between">
            {/* Floating Overlap Card */}
            <div className="relative z-10 w-full lg:w-[48%] mt-[-40px] sm:mt-[-60px] lg:mt-0 lg:-mr-20 bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-11 shadow-2xl shadow-slate-900/10 border border-slate-100">
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1E1F24]">
                {t("expertise.residential.title")}
              </h3>

              <p className="mt-4 text-sm sm:text-base text-[#62636C] leading-relaxed">
                {t("expertise.residential.description")}
              </p>

              {/* Checklist Points */}
              <div className="mt-6 sm:mt-8 space-y-4">
                {residentialPoints.map((point, idx) => (
                  <div key={idx} className="flex items-center gap-3.5">
                    <ShieldCheckIcon color="orange" />
                    <span className="font-bold text-sm sm:text-base text-[#1E1F24] leading-snug">
                      {point}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Image (gambar_2.png) */}
            <div className="relative w-full lg:w-[58%] h-[340px] sm:h-[440px] lg:h-[480px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-slate-200/80">
              <Image
                src="/images/gambar_2.png"
                alt={t("expertise.residential.title")}
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover object-center transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
