"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useI18n, Locale } from "@/lib/i18n";
import { I18nString } from "@/db/schema";
import { cn } from "@/lib/utils";
import { markViewIntent } from "@/lib/view-tracker";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface PortfolioCategoryItem {
  id: string | number;
  slug?: string;
  nameI18n: I18nString;
}

export interface PortfolioItem {
  id: string | number;
  titleI18n: I18nString;
  location?: string;
  coverImageUrl: string;
  status: string;
  categoryPortfolioId?: string | number | null;
  categoryName?: string;
  categorySlug?: string;
  categoryNameI18n?: I18nString;
  createdAt?: Date | string;
}

interface PortfolioContentSectionProps {
  portfolios: PortfolioItem[];
  categories?: PortfolioCategoryItem[];
}

export function PortfolioContentSection({
  portfolios,
  categories = [],
}: PortfolioContentSectionProps) {
  const { locale } = useI18n();
  const [selectedCategory, setSelectedCategory] = React.useState<string | number | "all">("all");

  const sectionRef = React.useRef<HTMLElement>(null);
  const tabsRef = React.useRef<HTMLDivElement>(null);
  const gridRef = React.useRef<HTMLDivElement>(null);

  const getLocalized = (field?: I18nString | null) => {
    if (!field) return "";
    return field[locale as Locale] || field.id || "";
  };

  // Filter portfolios based on selected category tab
  const filteredPortfolios = React.useMemo(() => {
    if (selectedCategory === "all") {
      return portfolios;
    }
    return portfolios.filter(
      (item) => String(item.categoryPortfolioId) === String(selectedCategory)
    );
  }, [portfolios, selectedCategory]);

  // Initial GSAP reveal animations
  React.useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (tabsRef.current) {
        gsap.fromTo(
          tabsRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: tabsRef.current,
              start: "top 90%",
              once: true,
            },
          }
        );
      }

      if (gridRef.current && gridRef.current.children.length > 0) {
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
              start: "top 85%",
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Smooth category transition on tab switch
  React.useEffect(() => {
    if (!gridRef.current || gridRef.current.children.length === 0) return;
    gsap.fromTo(
      gridRef.current.children,
      { opacity: 0, y: 20, scale: 0.98 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.45,
        stagger: 0.08,
        ease: "power2.out",
      }
    );
  }, [selectedCategory]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-10 sm:py-14 md:py-16 bg-[#F9F9FB]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        {/* Category Filter Tabs (Identik dengan Gambar 2: Semua, Komersial, Industrial, Residensial) */}
        <div
          ref={tabsRef}
          className="flex items-center justify-center gap-6 sm:gap-10 border-b border-transparent"
        >
          {/* Tab "Semua" */}
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={cn(
              "relative pb-2.5 text-sm sm:text-base font-semibold transition-colors duration-200 cursor-pointer focus:outline-none",
              selectedCategory === "all"
                ? "text-[#20449A] font-bold"
                : "text-slate-500 hover:text-slate-900"
            )}
          >
            Semua
            {selectedCategory === "all" && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#20449A] rounded-full transition-all" />
            )}
          </button>

          {/* Dynamic Categories */}
          {categories.map((cat) => {
            const catName = getLocalized(cat.nameI18n);
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "relative pb-2.5 text-sm sm:text-base font-semibold transition-colors duration-200 cursor-pointer capitalize focus:outline-none",
                  isSelected
                    ? "text-[#20449A] font-bold"
                    : "text-slate-500 hover:text-slate-900"
                )}
              >
                {catName}
                {isSelected && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#20449A] rounded-full transition-all" />
                )}
              </button>
            );
          })}
        </div>

        {/* 2-Column Grid Portofolio Cards (Identik dengan Gambar 2) */}
        {filteredPortfolios.length > 0 ? (
          <div
            ref={gridRef}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8"
          >
            {filteredPortfolios.map((item) => {
              const title = getLocalized(item.titleI18n);
              const badgeCategory = item.categoryNameI18n
                ? getLocalized(item.categoryNameI18n)
                : item.categoryName || "KOMERSIAL";

              return (
                <Link
                  key={item.id}
                  href={`/portofolio/${item.id}`}
                  onClick={() => markViewIntent("portfolio", item.id)}
                  className="group relative overflow-hidden rounded-2xl sm:rounded-3xl bg-slate-900 shadow-md transition-all duration-500 hover:shadow-2xl hover:-translate-y-1.5 h-[280px] sm:h-[350px] md:h-[400px] block cursor-pointer"
                >
                  {/* Gambar Portofolio dengan Smooth Hover Zoom */}
                  <Image
                    src={item.coverImageUrl}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-106"
                  />

                  {/* Dark Gradient Overlay di bagian bawah */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/5 transition-opacity duration-300 group-hover:from-black/90 group-hover:via-black/45" />

                  {/* Content Overlay di pojok kiri bawah (Badge Orange + Judul Putih Tebal) */}
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 flex flex-col items-start gap-2.5 z-10">
                    {/* Badge Kategori Orange Persegi Sedikit Membulat */}
                    <span className="inline-block rounded-md bg-[#F48902] px-3.5 py-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white shadow-sm">
                      {badgeCategory}
                    </span>

                    {/* Judul Proyek Putih Tebal */}
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight line-clamp-2 drop-shadow-sm group-hover:text-blue-100 transition-colors">
                      {title}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center text-slate-400">
            <p className="text-sm sm:text-base font-medium">
              Belum ada portofolio untuk kategori ini.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
