"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useI18n, Locale } from "@/lib/i18n";
import { I18nString } from "@/db/schema";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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
  const { t, locale } = useI18n();
  const sectionRef = React.useRef<HTMLElement>(null);
  const headerRef = React.useRef<HTMLDivElement>(null);
  const lineRef = React.useRef<HTMLDivElement>(null);
  const gridRef = React.useRef<HTMLDivElement>(null);
  const btnRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Header Animation
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      // Orange Line scale-in
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

      // Articles Grid Stagger Animation
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

      // Bottom Button Reveal
      if (btnRef.current) {
        gsap.fromTo(
          btnRef.current,
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: 0.25,
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

  const getLocalized = (field?: I18nString | null) => {
    if (!field) return "";
    return field[locale as Locale] || field.id || "";
  };

  return (
    <section ref={sectionRef} id="blog" className="py-20 sm:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div ref={headerRef} className="text-center max-w-4xl mx-auto mb-14 sm:mb-16 flex flex-col items-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black italic tracking-tight text-[#1E1F24]">
            {t("homeBlog.title")}
          </h2>
          {/* Underline Orange Responsive (Konsisten dengan section di atasnya) */}
          <div ref={lineRef} className="mt-4 h-1.5 w-44 sm:w-56 md:w-64 lg:w-72 rounded-full bg-[#F48902]" />
        </div>

        {/* 3-Column Grid Articles */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {posts.map((item) => {
            const title = getLocalized(item.titleI18n);
            const excerpt = getLocalized(item.excerptI18n);
            const fallbackImg =
              "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80";

            return (
              <article
                key={item.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-slate-200"
              >
                {/* Thumbnail Image Container */}
                <div className="relative h-56 sm:h-60 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={item.coverImageUrl || fallbackImg}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Category Pill di sudut kiri atas thumbnail (gelap semi-transparan dengan border lembut) */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="inline-flex items-center rounded-lg bg-black/75 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm shadow-xs border border-white/10">
                      {item.categoryName || "Engineering"}
                    </span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-6 sm:p-7 flex flex-1 flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    {/* Article Title */}
                    <h3 className="text-lg sm:text-xl font-bold text-[#1E1F24] leading-snug line-clamp-2 group-hover:text-[#20449A] transition-colors">
                      {title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-sm text-[#62636C] line-clamp-3 leading-relaxed">
                      {excerpt}
                    </p>
                  </div>

                  {/* Baca Selengkapnya Link */}
                  <div className="pt-2">
                    <Link
                      href={`/blog/${item.id}`}
                      className="inline-flex items-center text-sm font-bold text-[#1E1F24] transition-colors group/link hover:text-[#F48902]"
                    >
                      <span>{t("homeBlog.readMore")}</span>
                      <ArrowRight className="h-4 w-4 ml-1.5 transition-transform duration-200 group-hover/link:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Tombol "Lihat lebih lengkap" di bagian bawah tengah */}
        <div ref={btnRef} className="mt-12 sm:mt-16 flex justify-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-7 py-3 text-sm sm:text-base font-semibold text-slate-700 shadow-xs transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 hover:shadow-md group"
          >
            <span>{t("homeBlog.viewMore")}</span>
            <ArrowRight className="h-4 w-4 text-slate-500 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-slate-900" />
          </Link>
        </div>
      </div>
    </section>
  );
}
