"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ChevronRight } from "lucide-react";
import { useI18n, Locale } from "@/lib/i18n";
import { I18nString } from "@/db/schema";
import { cn } from "@/lib/utils";

interface PageHeroBannerProps {
  title: string | I18nString;
  breadcrumbCurrent: string | I18nString;
  backgroundImageUrl?: string;
  className?: string;
}

export function PageHeroBanner({
  title,
  breadcrumbCurrent,
  backgroundImageUrl = "/images/core_background.png",
  className,
}: PageHeroBannerProps) {
  const { t, locale } = useI18n();
  const bannerRef = React.useRef<HTMLDivElement>(null);
  const bgRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  const displayTitle =
    typeof title === "string"
      ? (title.startsWith("navigation.") || title.startsWith("aboutPage.") ? t(title) : title)
      : title[locale as Locale] || title.id || "";

  // Helper to extract clean breadcrumb label if it contains "Home > " or "首页 > "
  const cleanBreadcrumbText = (text: string) => {
    return text.replace(/^(Home|Beranda|首页)\s*>\s*/i, "").trim();
  };

  const resolveBreadcrumb = (): string => {
    if (!breadcrumbCurrent) return "";
    if (typeof breadcrumbCurrent === "object") {
      const raw =
        breadcrumbCurrent[locale as Locale] ||
        breadcrumbCurrent.id ||
        breadcrumbCurrent.en ||
        "";
      return cleanBreadcrumbText(raw);
    }
    // If it's a known i18n key or common page name
    if (breadcrumbCurrent.startsWith("navigation.")) {
      return t(breadcrumbCurrent);
    }
    const lower = breadcrumbCurrent.toLowerCase();
    if (lower === "blog") return t("navigation.blog");
    if (lower === "portofolio" || lower === "portfolio") return t("navigation.portfolio");
    if (lower === "kontak" || lower === "contact" || lower === "contact us") return t("navigation.contact");
    if (lower === "about" || lower === "about us" || lower === "tentang kami") return t("navigation.about");

    return cleanBreadcrumbText(breadcrumbCurrent);
  };

  const displayBreadcrumb = resolveBreadcrumb();

  React.useEffect(() => {
    if (!bannerRef.current) return;
    const ctx = gsap.context(() => {
      if (bgRef.current) {
        gsap.fromTo(
          bgRef.current,
          { scale: 1.08 },
          { scale: 1, duration: 1.4, ease: "power2.out" }
        );
      }
      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current,
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", delay: 0.1 }
        );
      }
    }, bannerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={bannerRef}
      className={cn(
        "relative w-full h-[240px] sm:h-[280px] md:h-[320px] flex items-center justify-center overflow-hidden bg-slate-950",
        className
      )}
    >
      {/* Background Image with Dark Vignette Overlay */}
      <div ref={bgRef} className="absolute inset-0 z-0">
        <Image
          src={backgroundImageUrl}
          alt={displayTitle || "Hero Banner"}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center filter grayscale brightness-[0.4] contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/50 to-black/80" />
      </div>

      {/* Content Container */}
      <div
        ref={contentRef}
        className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 text-center"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
          {displayTitle}
        </h1>

        {/* Breadcrumb Navigation: Home (Orange) > Page (White) */}
        <div className="mt-3 sm:mt-4 flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold tracking-wide">
          <Link
            href="/"
            className="text-[#F48902] hover:text-[#FFA633] transition-colors"
          >
            {t("navigation.home")}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-zinc-400" />
          <span className="text-white">{displayBreadcrumb}</span>
        </div>
      </div>
    </section>
  );
}
