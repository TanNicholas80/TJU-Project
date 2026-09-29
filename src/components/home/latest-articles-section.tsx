"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowRight, BookOpen, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n, Locale } from "@/lib/i18n";
import { I18nString } from "@/db/schema";

export interface PostItem {
  id: number;
  titleI18n: I18nString;
  excerptI18n?: I18nString | null;
  coverImageUrl?: string | null;
  status: string;
  categoryName?: string;
  createdAt: Date | string;
}

interface LatestArticlesSectionProps {
  posts: PostItem[];
}

export function LatestArticlesSection({ posts }: LatestArticlesSectionProps) {
  const { locale } = useI18n();

  const getLocalized = (field?: I18nString | null) => {
    if (!field) return "";
    return field[locale as Locale] || field.id || "";
  };

  const formatDate = (date: Date | string) => {
    try {
      const d = new Date(date);
      return d.toLocaleDateString(locale === "en" ? "en-US" : locale === "zh" ? "zh-CN" : "id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "Terbaru";
    }
  };

  return (
    <section id="blog" className="py-24 bg-[#F9F9FB] border-b border-[#E2E4EB]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#EEF2FA] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#20449A]">
              <BookOpen className="h-4 w-4 text-[#F48902]" />
              Edukasi & Wawasan Rekayasa
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E1F24] tracking-tight">
              Artikel & Berita Konstruksi Baja Ringan Terkini
            </h2>
            <p className="text-base text-[#62636C] leading-relaxed">
              Dapatkan wawasan mendalam mengenai panduan pemilihan ketebalan profil, standar beban struktural, dan inovasi fabrikasi rangka atap modern.
            </p>
          </div>

          <Link href="/blog" className="shrink-0">
            <Button variant="outline" size="lg" className="font-semibold group">
              Lihat Semua Artikel
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((item) => {
            const title = getLocalized(item.titleI18n);
            const excerpt = getLocalized(item.excerptI18n);
            const fallbackImg =
              "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80";

            return (
              <article
                key={item.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-[#E2E4EB] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#20449A]/30"
              >
                {/* Thumbnail Image */}
                <div className="relative h-52 w-full overflow-hidden bg-zinc-100">
                  <Image
                    src={item.coverImageUrl || fallbackImg}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Category Pill */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="inline-flex items-center rounded-md bg-[#20449A] px-2.5 py-1 text-xs font-semibold text-white shadow-xs">
                      {item.categoryName || "Engineering"}
                    </span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-6 flex flex-1 flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    {/* Date & Read Time */}
                    <div className="flex items-center gap-4 text-xs text-[#62636C]">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-[#F48902]" />
                        {formatDate(item.createdAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-zinc-400" />
                        4 mnt baca
                      </span>
                    </div>

                    {/* Article Title */}
                    <h3 className="text-lg font-bold text-[#1E1F24] group-hover:text-[#20449A] transition-colors line-clamp-2 leading-snug">
                      {title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-sm text-[#62636C] line-clamp-3 leading-relaxed">
                      {excerpt}
                    </p>
                  </div>

                  {/* Baca Selengkapnya Link */}
                  <div className="pt-4 border-t border-[#E2E4EB]">
                    <span className="inline-flex items-center text-sm font-semibold text-[#20449A] group-hover:text-[#F48902] transition-colors">
                      Baca Selengkapnya
                      <ArrowRight className="h-4 w-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
