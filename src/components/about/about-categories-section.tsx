"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { I18nString } from "@/db/schema";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface PortfolioCategoryItem {
  id: number;
  slug: string;
  nameI18n: I18nString;
  descriptionI18n?: I18nString | null;
  coverImageUrl?: string | null;
}

interface AboutCategoriesSectionProps {
  categories: PortfolioCategoryItem[];
}

export function AboutCategoriesSection({
  categories,
}: AboutCategoriesSectionProps) {
  const { locale } = useI18n();
  const sectionRef = React.useRef<HTMLElement>(null);
  const titleRef = React.useRef<HTMLDivElement>(null);
  const lineRef = React.useRef<HTMLDivElement>(null);
  const gridRef = React.useRef<HTMLDivElement>(null);
  const ctaRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: titleRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleX: 0, opacity: 0 },
          {
            scaleX: 1,
            opacity: 1,
            duration: 0.7,
            delay: 0.15,
            ease: "power2.out",
            transformOrigin: "center center",
            scrollTrigger: {
              trigger: lineRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }
      if (gridRef.current) {
        gsap.fromTo(
          gridRef.current.children,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.14,
            ease: "power3.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 82%",
              once: true,
            },
          }
        );
      }
      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: 0.25,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ctaRef.current,
              start: "top 90%",
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
      className="relative w-full py-16 sm:py-20 lg:py-24 bg-white overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Title with Orange Underline */}
        <div ref={titleRef} className="text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold italic text-[#1E1F24] tracking-tight">
            Menangani Berbagai Skala Proyek
          </h2>
          <div ref={lineRef} className="mx-auto h-1.5 w-52 sm:w-64 md:w-72 bg-[#E76F1D] rounded-full" />
        </div>

        {/* Card Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {categories.map((cat) => {
            const name = cat.nameI18n?.[locale] || cat.nameI18n?.id || "Kategori";
            const desc =
              cat.descriptionI18n?.[locale] ||
              cat.descriptionI18n?.id ||
              "Solusi struktur rangka atap terpercaya";
            const bgImage =
              cat.coverImageUrl ||
              "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80";

            return (
              <div
                key={cat.id}
                className="group relative h-[440px] sm:h-[480px] rounded-2xl overflow-hidden shadow-lg border border-[#E2E4EB] transition-all duration-500 hover:shadow-2xl hover:-translate-y-1.5 bg-zinc-900"
              >
                {/* Background Image */}
                <Image
                  src={bgImage}
                  alt={name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Deep Blue Gradient Overlay at Bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#15367d] via-[#15367d]/75 via-40% to-transparent opacity-95 transition-opacity" />

                {/* Card Content at the Bottom */}
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7 flex flex-col justify-end space-y-1.5 z-10">
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-normal drop-shadow-sm">
                    {name}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/85 leading-relaxed font-normal line-clamp-2">
                    {desc}
                  </p>

                  {/* Accent Line indicator */}
                  <div className="h-1.5 w-14 bg-[#E76F1D] group-hover:w-20 transition-all duration-300 rounded-full mt-3" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button: Lihat Portfolio Kami */}
        <div ref={ctaRef} className="flex justify-center pt-4">
          <Link href="/portofolio">
            <Button
              variant="outline"
              size="lg"
              className="group border border-[#E2E4EB] bg-[#F8F9FA] px-7 py-3 text-xs sm:text-sm font-semibold text-[#1E1F24] hover:bg-[#EEF2FA] hover:text-[#20449A] hover:border-[#20449A]/30 transition-all duration-200 shadow-sm rounded-lg"
            >
              <span>Lihat Portfolio Kami</span>
              <ArrowRight className="h-4 w-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
