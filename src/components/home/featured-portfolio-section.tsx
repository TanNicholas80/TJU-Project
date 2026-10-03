"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

import { useI18n, Locale } from "@/lib/i18n";
import { I18nString } from "@/db/schema";
import { cn } from "@/lib/utils";

export interface PortfolioCategoryItem {
  id: number;
  slug?: string;
  nameI18n: I18nString;
}

export interface PortfolioItem {
  id: number;
  titleI18n: I18nString;
  location?: string;
  coverImageUrl: string;
  status: string;
  categoryPortfolioId?: number | null;
  categoryName?: string;
  categorySlug?: string;
  categoryNameI18n?: I18nString;
  createdAt?: Date | string;
}

interface FeaturedPortfolioSectionProps {
  portfolios: PortfolioItem[];
  categories?: PortfolioCategoryItem[];
}

export function FeaturedPortfolioSection({
  portfolios,
  categories = [],
}: FeaturedPortfolioSectionProps) {
  const { t, locale } = useI18n();
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<number | "all">("all");

  const sectionRef = React.useRef<HTMLElement>(null);
  const headerRef = React.useRef<HTMLDivElement>(null);
  const tabsRef = React.useRef<HTMLDivElement>(null);
  const gridRef = React.useRef<HTMLDivElement>(null);
  const btnRef = React.useRef<HTMLDivElement>(null);

  const getLocalized = (field?: I18nString | null) => {
    if (!field) return "";
    return field[locale as Locale] || field.id || "";
  };

  // Filter portfolios based on selected category tab
  const filteredPortfolios = React.useMemo(() => {
    if (selectedCategoryId === "all") {
      return portfolios.slice(0, 4);
    }
    return portfolios
      .filter((item) => item.categoryPortfolioId === selectedCategoryId)
      .slice(0, 4);
  }, [portfolios, selectedCategoryId]);

  // Initial scroll-triggered reveal
  React.useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.children,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      if (tabsRef.current) {
        gsap.fromTo(
          tabsRef.current,
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay: 0.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: tabsRef.current,
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
            duration: 0.85,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 82%",
              once: true,
            },
          }
        );
      }

      if (btnRef.current) {
        gsap.fromTo(
          btnRef.current,
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: 0.3,
            ease: "power2.out",
            scrollTrigger: {
              trigger: btnRef.current,
              start: "top 90%",
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Smooth fade-in when switching category tabs
  React.useEffect(() => {
    if (!gridRef.current) return;
    gsap.fromTo(
      gridRef.current.children,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" }
    );
  }, [selectedCategoryId]);

  return (
    <section ref={sectionRef} id="portfolio" className="relative w-full bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header (Menggunakan NEXT INTL) */}
        <div ref={headerRef} className="mx-auto max-w-3xl text-center space-y-3">
          <p className="text-xs sm:text-sm font-bold tracking-widest text-[#F48902] uppercase">
            {t("homePortfolio.badge")}
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black italic tracking-tight text-[#1E1F24]">
            {t("homePortfolio.title")}
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-[#62636C] max-w-2xl mx-auto">
            {t("homePortfolio.description")}
          </p>
        </div>

        {/* Category Tabs (Dinamis dari Database) */}
        <div ref={tabsRef} className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-8 border-b border-transparent">
          {/* Tab "Semua" / All */}
          <button
            type="button"
            onClick={() => setSelectedCategoryId("all")}
            className={cn(
              "relative pb-2 text-sm sm:text-base font-semibold transition-colors duration-200 cursor-pointer",
              selectedCategoryId === "all"
                ? "text-[#20449A] font-bold"
                : "text-slate-500 hover:text-slate-900"
            )}
          >
            {t("homePortfolio.allCategory")}
            {selectedCategoryId === "all" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#20449A] rounded-full transition-all" />
            )}
          </button>

          {/* Dynamic Categories from DB */}
          {categories.map((cat) => {
            const categoryName = getLocalized(cat.nameI18n);
            const isSelected = selectedCategoryId === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategoryId(cat.id)}
                className={cn(
                  "relative pb-2 text-sm sm:text-base font-semibold transition-colors duration-200 cursor-pointer capitalize",
                  isSelected
                    ? "text-[#20449A] font-bold"
                    : "text-slate-500 hover:text-slate-900"
                )}
              >
                {categoryName}
                {isSelected && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#20449A] rounded-full transition-all" />
                )}
              </button>
            );
          })}
        </div>

        {/* 2x2 Grid Portofolio Cards Sesuai Desain */}
        {filteredPortfolios.length > 0 ? (
          <div ref={gridRef} className="mt-10 sm:mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {filteredPortfolios.map((item) => {
              const title = getLocalized(item.titleI18n);
              // Kategori dinamis dari database (dari categoryNameI18n atau fallback categoryName)
              const badgeCategory = item.categoryNameI18n
                ? getLocalized(item.categoryNameI18n)
                : item.categoryName || "KOMERSIAL";

              return (
                <div
                  key={item.id}
                  className="group relative overflow-hidden rounded-2xl bg-slate-900 shadow-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 h-[280px] sm:h-[340px] md:h-[380px]"
                >
                  {/* Gambar Portofolio */}
                  <Image
                    src={item.coverImageUrl}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Dark Gradient Overlay di bagian bawah & badge area */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10 transition-opacity duration-300 group-hover:from-black/90 group-hover:via-black/40" />

                  {/* Content Overlay di pojok kiri bawah */}
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 flex flex-col items-start gap-2.5 z-10">
                    {/* Badge Kategori Orange Solid Persegi Persegi Melengkung Halus */}
                    <span className="inline-block rounded-md bg-[#F48902] px-3.5 py-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white shadow-sm">
                      {badgeCategory}
                    </span>

                    {/* Judul Proyek Putih Tebal Italic Sesuai Desain */}
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold italic text-white tracking-tight line-clamp-2 drop-shadow-sm group-hover:text-blue-100 transition-colors">
                      {title}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State jika belum ada item */
          <div className="mt-12 rounded-2xl border border-dashed border-slate-200 py-16 text-center text-slate-400">
            <p className="text-sm sm:text-base font-medium">
              {t("homePortfolio.emptyMessage")}
            </p>
          </div>
        )}

        {/* Tombol "Lihat lebih lengkap" di bagian bawah tengah */}
        <div ref={btnRef} className="mt-12 sm:mt-16 flex justify-center">
          <Link
            href="/portofolio"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-7 py-3 text-sm sm:text-base font-semibold text-slate-700 shadow-xs transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 hover:shadow-md group"
          >
            <span>{t("homePortfolio.viewMore")}</span>
            <ArrowRight className="h-4 w-4 text-slate-500 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-slate-900" />
          </Link>
        </div>
      </div>
    </section>
  );
}
