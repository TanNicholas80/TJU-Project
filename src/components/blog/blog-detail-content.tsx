"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { markViewIntent } from "@/lib/view-tracker";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface RelatedPost {
  id: string | number;
  title: string;
  coverImageUrl: string;
  categoryName?: string;
  createdAt?: string | Date;
}

interface BlogDetailContentProps {
  id: number | string;
  title: string;
  categoryName: string;
  coverImageUrl: string;
  contentHtml: string;
  relatedPosts: RelatedPost[];
}

export function BlogDetailContent({
  id,
  title,
  categoryName,
  coverImageUrl,
  contentHtml,
  relatedPosts,
}: BlogDetailContentProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const headerRef = React.useRef<HTMLDivElement>(null);
  const heroImageRef = React.useRef<HTMLDivElement>(null);
  const contentGridRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Header elements entrance animation
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.children,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.12,
            ease: "power3.out",
          }
        );
      }

      // 2. Hero Image Entrance with smooth scale
      if (heroImageRef.current) {
        gsap.fromTo(
          heroImageRef.current,
          { opacity: 0, scale: 0.96, y: 20 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.9,
            delay: 0.25,
            ease: "power2.out",
          }
        );
      }

      // 3. Content and Sidebar Entrance
      if (contentGridRef.current) {
        gsap.fromTo(
          contentGridRef.current.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: contentGridRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Top Header Bar & Title */}
        <div ref={headerRef} className="space-y-6">
          {/* Top Row: Back button on left, Category badge centered/beside */}
          <div className="relative flex items-center justify-center sm:justify-start">
            <Link
              href="/blog"
              className="sm:absolute left-0 inline-flex items-center gap-2 rounded-lg border border-[#E2E4EB] bg-white px-4 py-1.5 text-xs font-semibold text-[#62636C] shadow-xs hover:border-[#20449A] hover:text-[#20449A] transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Kembali</span>
            </Link>

            {/* Category Badge Centered */}
            <div className="mx-auto">
              <span className="inline-block rounded-md bg-[#20449A] px-5 py-1.5 text-xs font-semibold text-white shadow-xs tracking-wide">
                {categoryName || "Engineering"}
              </span>
            </div>
          </div>

          {/* Title Centered Italic Bold */}
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold italic text-[#1E1F24] tracking-tight text-center max-w-4xl mx-auto leading-tight md:leading-[1.2]">
            {title}
          </h1>
        </div>

        {/* Hero Featured Big Image */}
        <div
          ref={heroImageRef}
          className="relative w-full h-[320px] sm:h-[440px] md:h-[520px] lg:h-[580px] rounded-2xl md:rounded-3xl overflow-hidden shadow-lg bg-slate-900 my-8 md:my-10"
        >
          <Image
            src={coverImageUrl || "/images/gambar_1.JPG"}
            alt={title}
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1200px"
            className="object-cover object-center"
          />
        </div>

        {/* Main 2-Column Content Grid: Left 8 cols, Right 4 cols */}
        <div ref={contentGridRef} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Article Body Content */}
          <div className="lg:col-span-8">
            <div
              className="prose prose-slate max-w-none text-[#333742] text-sm sm:text-base leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          </div>

          {/* Right Column: Sticky Sidebar (Consultation Box & Related Articles) */}
          <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-24 self-start">
            {/* Blue Consultation CTA Card */}
            <div className="rounded-2xl bg-[#20449A] p-6 sm:p-7 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10 space-y-3">
                <h3 className="text-xl font-extrabold text-white tracking-tight">
                  Butuh Konsultasi?
                </h3>
                <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                  Tim kami siap membantu kebutuhan konstruksi rangka atap untuk proyek Anda.
                </p>
                <div className="pt-2">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center w-full rounded-lg bg-[#F48902] hover:bg-[#d97706] text-white font-bold py-3 px-4 text-sm shadow-md transition-all duration-200 hover:shadow-lg active:scale-98"
                  >
                    Konsultasi Proyek
                  </Link>
                </div>
              </div>
            </div>

            {/* Artikel Lainnya List */}
            {relatedPosts && relatedPosts.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-[#1E1F24] tracking-tight">
                  Artikel Lainnya
                </h3>

                <div className="space-y-3">
                  {relatedPosts.map((item) => (
                    <Link
                      key={item.id}
                      href={`/blog/${item.id}`}
                      onClick={() => markViewIntent("article", item.id)}
                      className="group flex items-center gap-3.5 p-2 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-[#E2E4EB]"
                    >
                      {/* Thumbnail Left */}
                      <div className="relative h-16 w-20 sm:h-18 sm:w-24 shrink-0 rounded-lg overflow-hidden bg-slate-100 border border-[#E2E4EB]">
                        <Image
                          src={item.coverImageUrl || "/images/gambar_1.JPG"}
                          alt={item.title}
                          fill
                          sizes="96px"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>

                      {/* Info Right */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-[#1E1F24] line-clamp-2 leading-snug group-hover:text-[#20449A] transition-colors">
                          {item.title}
                        </h4>
                        <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#20449A] mt-1 group-hover:text-[#F48902] transition-colors">
                          <span>Baca Selengkapnya</span>
                          <ChevronRight className="h-3 w-3" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
