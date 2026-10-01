"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { MessageSquare } from "lucide-react";
import { useI18n, Locale } from "@/lib/i18n";
import { I18nString } from "@/db/schema";
import { cn } from "@/lib/utils";

export interface HeroSlide {
  id: number;
  imageUrl: string;
  subheaderI18n?: I18nString | null;
  titleI18n: I18nString;
  descriptionI18n?: I18nString | null;
  loadingTitleI18n?: I18nString | null;
  subtitleI18n?: I18nString | null;
  ctaTextI18n?: I18nString | null;
  ctaLink?: string | null;
  sortOrder: number;
  isActive: boolean;
}

interface HeroCarouselProps {
  slides: HeroSlide[];
}

const SLIDE_DURATION = 6000; // 6 detik per slide

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const { locale } = useI18n();
  const [currentIdx, setCurrentIdx] = React.useState(0);
  const [progress, setProgress] = React.useState(0);

  const textContainerRef = React.useRef<HTMLDivElement>(null);
  const eyebrowRef = React.useRef<HTMLDivElement>(null);
  const headlineRef = React.useRef<HTMLHeadingElement>(null);
  const subtitleRef = React.useRef<HTMLParagraphElement>(null);
  const ctaGroupRef = React.useRef<HTMLDivElement>(null);

  const activeSlides = slides.filter((s) => s.isActive);
  const currentSlide = activeSlides[currentIdx] || activeSlides[0];

  // Helper i18n
  const getLocalized = (field?: I18nString | null) => {
    if (!field) return "";
    return field[locale as Locale] || field.id || "";
  };

  // Text transition with GSAP
  React.useEffect(() => {
    if (!textContainerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        eyebrowRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.6 }
      )
        .fromTo(
          headlineRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.7 },
          "-=0.4"
        )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.4"
        )
        .fromTo(
          ctaGroupRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.3"
        );
    }, textContainerRef);

    return () => ctx.revert();
  }, [currentIdx]);

  // Smooth Progress Bar Timer
  React.useEffect(() => {
    if (activeSlides.length <= 1) return;

    setProgress(0);
    const startTime = Date.now();
    const intervalTime = 30; // update setiap 30ms

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
      setProgress(currentProgress);

      if (elapsed >= SLIDE_DURATION) {
        clearInterval(timer);
        setCurrentIdx((prev) => (prev + 1) % activeSlides.length);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [currentIdx, activeSlides.length]);

  if (!currentSlide) return null;

  return (
    <section className="relative w-full min-h-[640px] md:min-h-[700px] lg:h-[750px] flex flex-col justify-center overflow-hidden bg-[#0c121e]">
      {/* Background Slides with Cross-Fade */}
      {activeSlides.map((s, idx) => (
        <div
          key={s.id || idx}
          className={cn(
            "absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out",
            idx === currentIdx ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          <Image
            src={s.imageUrl}
            alt={getLocalized(s.titleI18n)}
            fill
            priority={idx === 0}
            sizes="100vw"
            className="object-cover object-center scale-105 transition-transform duration-10000 ease-out"
          />
          {/* Cinematic Dark Overlay sesuai gambar referensi */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/75 to-black/65" />
          <div className="absolute inset-0 bg-[#0c121e]/45" />
        </div>
      ))}

      {/* Main Content Area */}
      <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div ref={textContainerRef} className="max-w-3xl space-y-6">
          {/* Subheader dengan Garis Oranye di sebelah kiri */}
          <div ref={eyebrowRef} className="flex items-center gap-3">
            <span className="h-[3px] w-12 sm:w-16 rounded-full bg-[#F48902] inline-block shrink-0" />
            <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-white/90">
              {getLocalized(currentSlide.subheaderI18n) || "SOLUSI TERINTEGRASI"}
            </span>
          </div>

          {/* Headline / Title */}
          <h1
            ref={headlineRef}
            className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]"
          >
            {getLocalized(currentSlide.titleI18n)}
          </h1>

          {/* Description */}
          <p
            ref={subtitleRef}
            className="text-sm sm:text-base md:text-lg text-white/80 leading-relaxed max-w-2xl font-normal"
          >
            {getLocalized(currentSlide.descriptionI18n) ||
              getLocalized(currentSlide.subtitleI18n)}
          </p>

          {/* Statis CTA Buttons */}
          <div
            ref={ctaGroupRef}
            className="flex flex-wrap items-center gap-4 pt-2"
          >
            {/* 1. Konsultasi Proyek (Biru dengan Icon Chat) */}
            <Link href="/contact">
              <button
                type="button"
                className="inline-flex items-center gap-2.5 rounded-md bg-[#20449A] hover:bg-[#1a3880] text-white px-6 py-3 font-semibold text-sm transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <MessageSquare className="h-4 w-4 fill-white/20" />
                <span>Konsultasi Proyek</span>
              </button>
            </Link>

            {/* 2. Pelajari Sistem TJU (Transparan Border Putih) */}
            <Link href="/about">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md border border-white/80 bg-black/20 hover:bg-white/15 text-white px-6 py-3 font-semibold text-sm transition-all active:scale-95 cursor-pointer"
              >
                <span>Pelajari Sistem TJU</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Loading Titles Tabs & Progress Bar di Bagian Bawah */}
        {activeSlides.length > 0 && (
          <div className="mt-14 sm:mt-20 flex flex-wrap items-end gap-8 sm:gap-14">
            {activeSlides.map((s, idx) => {
              const isActive = idx === currentIdx;
              const loadingTitle =
                getLocalized(s.loadingTitleI18n) ||
                (idx === 0 ? "Strength" : idx === 1 ? "Structure" : "Balance");

              return (
                <button
                  key={s.id || idx}
                  type="button"
                  onClick={() => {
                    setCurrentIdx(idx);
                    setProgress(0);
                  }}
                  className="group flex flex-col items-start text-left focus:outline-none cursor-pointer"
                >
                  {/* Progress Bar Loading tepat di atas Loading Title */}
                  <div className="relative h-[3px] w-full min-w-[70px] sm:min-w-[90px] bg-white/10 rounded-full overflow-hidden mb-2.5">
                    {isActive ? (
                      <div
                        className="h-full bg-[#F48902] transition-none rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    ) : (
                      <div className="h-full w-0 bg-transparent group-hover:w-full group-hover:bg-white/30 transition-all duration-300" />
                    )}
                  </div>

                  {/* Teks Loading Title */}
                  <span
                    className={cn(
                      "text-base sm:text-lg font-semibold tracking-wide transition-colors duration-200",
                      isActive
                        ? "text-white font-bold"
                        : "text-white/40 group-hover:text-white/70 font-medium"
                    )}
                  >
                    {loadingTitle}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
