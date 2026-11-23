"use client";

import * as React from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles, Cpu, ShieldCheck, Award } from "lucide-react";
import { useI18n } from "@/lib/i18n";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function CoreValuesSection() {
  const { t } = useI18n();
  const sectionRef = React.useRef<HTMLElement>(null);
  const leftContentRef = React.useRef<HTMLDivElement>(null);
  const rightCardRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Reveal storytelling content
      if (leftContentRef.current) {
        gsap.fromTo(
          leftContentRef.current.children,
          { opacity: 0, y: 22 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 82%",
              once: true,
            },
          }
        );
      }

      // Reveal right trust card
      if (rightCardRef.current) {
        gsap.fromTo(
          rightCardRef.current,
          { opacity: 0, scale: 0.94, y: 15 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.8,
            delay: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 82%",
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-slate-950 py-12 sm:py-16 lg:py-18 border-b border-slate-800/80"
    >
      {/* Background Image with Dark Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/core_background.png"
          alt="TJU Truss Core Values Background"
          fill
          priority={false}
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/90 to-slate-950/85" />
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]" />
      </div>

      {/* Ambient Lighting Accents */}
      <div
        className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-[#F48902]/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-blue-600/10 blur-3xl"
        aria-hidden="true"
      />

      {/* Main Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12 lg:items-center">
          
          {/* SISI KIRI: Storytelling Narration (7 cols) */}
          <div ref={leftContentRef} className="lg:col-span-7 flex flex-col">
            {/* Badge / Eyebrow */}
            <div className="flex items-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#F48902]/40 bg-[#F48902]/10 px-3 py-1 text-[11px] font-bold tracking-wider text-[#F48902] uppercase shadow-sm">
                <Sparkles className="h-3 w-3 text-[#F48902]" />
                {t("coreValues.badge")}
              </span>
            </div>

            {/* Headline */}
            <h2 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-[2.15rem] leading-tight sm:leading-tight">
              {t("coreValues.title")}
            </h2>

            {/* Short & Punchy Storytelling Description */}
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-300 font-normal max-w-2xl">
              {t("coreValues.description")}
            </p>

            {/* 3 Quick-Scan Micro Cards */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800/80">
              {/* Pillar 1 */}
              <div className="group rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 transition-all duration-200 hover:border-[#F48902]/40 hover:bg-slate-900/90">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#F48902]/15 text-[#F48902]">
                    <Cpu className="h-4 w-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-white">
                    {t("coreValues.point1Title")}
                  </span>
                </div>
                <p className="mt-1.5 text-[11px] sm:text-xs text-slate-400 leading-normal">
                  {t("coreValues.point1Desc")}
                </p>
              </div>

              {/* Pillar 2 */}
              <div className="group rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 transition-all duration-200 hover:border-[#F48902]/40 hover:bg-slate-900/90">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#F48902]/15 text-[#F48902]">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-white">
                    {t("coreValues.point2Title")}
                  </span>
                </div>
                <p className="mt-1.5 text-[11px] sm:text-xs text-slate-400 leading-normal">
                  {t("coreValues.point2Desc")}
                </p>
              </div>

              {/* Pillar 3 */}
              <div className="group rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 transition-all duration-200 hover:border-[#F48902]/40 hover:bg-slate-900/90">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#F48902]/15 text-[#F48902]">
                    <Award className="h-4 w-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-white">
                    {t("coreValues.point3Title")}
                  </span>
                </div>
                <p className="mt-1.5 text-[11px] sm:text-xs text-slate-400 leading-normal">
                  {t("coreValues.point3Desc")}
                </p>
              </div>
            </div>
          </div>

          {/* SISI KANAN: Compact Digital Certificate Seal (5 cols) */}
          <div ref={rightCardRef} className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm rounded-2xl border border-slate-700/60 bg-slate-900/80 p-5 sm:p-6 backdrop-blur-md shadow-2xl transition-all duration-300 hover:border-[#F48902]/50">
              {/* Corner Ambient Glow */}
              <div className="absolute top-0 right-0 h-24 w-24 rounded-tr-2xl bg-gradient-to-bl from-[#F48902]/15 to-transparent pointer-events-none" />

              <div className="flex flex-col items-center text-center">
                {/* Logo HAKI in Crisp Badge */}
                <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-xl bg-white p-3 shadow-lg transition-transform duration-300 hover:scale-105">
                  <Image
                    src="/images/haki_logo.png"
                    alt="Logo HAKI"
                    width={96}
                    height={96}
                    unoptimized
                    priority
                    className="h-full w-full object-contain"
                  />
                </div>

                {/* Status Pill */}
                <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>{t("coreValues.cardTag")}</span>
                </div>

                {/* Title & Subtitle */}
                <h3 className="mt-2.5 text-base sm:text-lg font-bold tracking-tight text-white">
                  {t("coreValues.cardTitle")}
                </h3>
                <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-[#F48902]">
                  {t("coreValues.cardSubtitle")}
                </p>

                {/* Short Description */}
                <p className="mt-2 text-xs leading-relaxed text-slate-300 max-w-xs font-normal">
                  {t("coreValues.cardDesc")}
                </p>

                {/* Bottom Trust Stamp */}
                <div className="mt-5 flex w-full items-center justify-between border-t border-slate-800 pt-3 text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5 text-[#F48902]" />
                    <span>Akreditasi Resmi</span>
                  </div>
                  <span className="font-semibold text-slate-300">SNI & HAKI</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
