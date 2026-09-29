"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ChevronLeft, ChevronRight, MessageSquare, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n, Locale } from "@/lib/i18n";
import { I18nString } from "@/db/schema";

export interface HeroSlide {
  id: number;
  imageUrl: string;
  titleI18n: I18nString;
  subtitleI18n: I18nString;
  ctaTextI18n?: I18nString | null;
  ctaLink?: string | null;
  sortOrder: number;
  isActive: boolean;
}

interface HeroCarouselProps {
  slides: HeroSlide[];
}

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const { locale } = useI18n();
  const [currentIdx, setCurrentIdx] = React.useState(0);
  const textContainerRef = React.useRef<HTMLDivElement>(null);
  const headlineRef = React.useRef<HTMLHeadingElement>(null);
  const subtitleRef = React.useRef<HTMLParagraphElement>(null);
  const ctaGroupRef = React.useRef<HTMLDivElement>(null);

  const activeSlides = slides.filter((s) => s.isActive);
  const slide = activeSlides[currentIdx] || activeSlides[0];

  const animateSlideText = React.useCallback(() => {
    if (!textContainerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        headlineRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 }
      )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.7 },
          "-=0.5"
        )
        .fromTo(
          ctaGroupRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.4"
        );
    }, textContainerRef);

    return () => ctx.revert();
  }, []);

  React.useEffect(() => {
    const cleanup = animateSlideText();
    return () => {
      if (cleanup) cleanup();
    };
  }, [currentIdx, animateSlideText]);

  // Auto-advance slide every 7 seconds
  React.useEffect(() => {
    if (activeSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % activeSlides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev === 0 ? activeSlides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % activeSlides.length);
  };

  if (!slide) return null;

  const getLocalized = (field?: I18nString | null) => {
    if (!field) return "";
    return field[locale as Locale] || field.id || "";
  };

  return (
    <section className="relative w-full h-[600px] md:h-[680px] lg:h-[720px] overflow-hidden bg-[#0F2353]">
      {/* Background Image with Cinematic Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={slide.imageUrl}
          alt={getLocalized(slide.titleI18n)}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center transition-all duration-1000 scale-105"
        />
        {/* Dual tone dark overlay for optimal text contrast and brand aesthetics */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b1b42]/95 via-[#0f2353]/85 to-black/60" />
        <div className="absolute inset-0 bg-black/25" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-8">
        <div ref={textContainerRef} className="max-w-3xl space-y-6">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-blue-200 uppercase backdrop-blur-md border border-white/15">
            <span className="h-2 w-2 rounded-full bg-[#F48902] animate-pulse" />
            TJU Truss System & Engineering
          </div>

          {/* Headline */}
          <h1
            ref={headlineRef}
            className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl leading-[1.15]"
          >
            {getLocalized(slide.titleI18n)}
          </h1>

          {/* Subheadline */}
          <p
            ref={subtitleRef}
            className="text-base sm:text-lg md:text-xl text-blue-100/90 leading-relaxed max-w-2xl font-light"
          >
            {getLocalized(slide.subtitleI18n)}
          </p>

          {/* CTA Buttons */}
          <div
            ref={ctaGroupRef}
            className="flex flex-wrap items-center gap-4 pt-4"
          >
            <Link href={slide.ctaLink || "#contact"}>
              <Button
                variant="orange"
                size="lg"
                className="h-12 px-7 text-base font-semibold shadow-lg shadow-orange-500/20 hover:scale-[1.02] transition-transform"
              >
                <MessageSquare className="h-5 w-5 mr-2" />
                {getLocalized(slide.ctaTextI18n) || "Konsultasi Proyek"}
              </Button>
            </Link>

            <a
              href="https://wa.me/6281234567890?text=Halo%20TJU%20Truss,%20saya%20ingin%20konsultasi%20mengenai%20proyek%20rangka%20atap"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-7 text-base font-medium bg-white/10 text-white border-white/30 backdrop-blur-sm hover:bg-white/20 hover:text-white"
              >
                <PhoneCall className="h-5 w-5 mr-2 text-green-400" />
                Hubungi via WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {activeSlides.length > 1 && (
        <div className="absolute bottom-8 right-6 z-20 flex items-center gap-2 sm:right-12">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous Slide"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md border border-white/20 transition hover:bg-[#F48902] hover:border-[#F48902] cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next Slide"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md border border-white/20 transition hover:bg-[#F48902] hover:border-[#F48902] cursor-pointer"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Slide Indicators */}
      {activeSlides.length > 1 && (
        <div className="absolute bottom-8 left-6 z-20 flex items-center gap-2 sm:left-12">
          {activeSlides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentIdx(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentIdx ? "w-8 bg-[#F48902]" : "w-2 bg-white/50 hover:bg-white"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
