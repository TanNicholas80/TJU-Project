"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowRight, Eye, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n, Locale } from "@/lib/i18n";
import { I18nString } from "@/db/schema";

export interface PortfolioItem {
  id: number;
  titleI18n: I18nString;
  location: string;
  coverImageUrl: string;
  status: string;
  categoryName?: string;
  createdAt: Date | string;
}

interface FeaturedPortfolioSectionProps {
  portfolios: PortfolioItem[];
}

export function FeaturedPortfolioSection({ portfolios }: FeaturedPortfolioSectionProps) {
  const { locale } = useI18n();

  const getLocalized = (field?: I18nString | null) => {
    if (!field) return "";
    return field[locale as Locale] || field.id || "";
  };

  return (
    <section id="portfolio" className="py-24 bg-white border-b border-[#E2E4EB]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#EEF2FA] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#20449A]">
              <Building2 className="h-4 w-4 text-[#F48902]" />
              Portofolio Proyek Unggulan
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E1F24] tracking-tight">
              Bukti Nyata Kualitas & Presisi di Setiap Sudut Konstruksi
            </h2>
            <p className="text-base text-[#62636C] leading-relaxed">
              Jelajahi berbagai proyek atap bentang lebar, bangunan institusi pendidikan, gedung komersial, hingga hunian tapak eksklusif hasil karya tim TJU Truss.
            </p>
          </div>

          <Link href="/portofolio" className="shrink-0">
            <Button variant="outline" size="lg" className="font-semibold group">
              Lihat Seluruh Portofolio
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {portfolios.map((item) => {
            const title = getLocalized(item.titleI18n);
            return (
              <div
                key={item.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#E2E4EB] bg-[#F9F9FB] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#20449A]/40"
              >
                {/* Image Container with Hover Scale */}
                <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-zinc-900">
                  <Image
                    src={item.coverImageUrl}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="inline-flex items-center rounded-full bg-[#20449A]/90 px-3.5 py-1 text-xs font-semibold text-white backdrop-blur-md shadow-sm">
                      {item.categoryName || "Konstruksi Rangka Atap"}
                    </span>
                  </div>

                  {/* Quick Action Overlay Icon */}
                  <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#20449A] backdrop-blur-md shadow-md">
                      <Eye className="h-4 w-4" />
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-6 flex flex-1 flex-col justify-between space-y-4">
                  <div>
                    {/* Location Tag */}
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#F48902] mb-2">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span>{item.location}</span>
                    </div>

                    {/* Project Title */}
                    <h3 className="text-xl font-bold text-[#1E1F24] group-hover:text-[#20449A] transition-colors leading-snug">
                      {title}
                    </h3>
                  </div>

                  {/* Card Bottom Link */}
                  <div className="pt-3 border-t border-[#E2E4EB] flex items-center justify-between text-xs font-medium text-[#62636C]">
                    <span>Status: Selesai Terverifikasi</span>
                    <span className="text-[#20449A] font-semibold flex items-center gap-1 group-hover:underline">
                      Detail Proyek
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
