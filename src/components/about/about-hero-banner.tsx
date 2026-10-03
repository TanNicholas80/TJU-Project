"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ChevronRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { I18nString } from "@/db/schema";

interface AboutHeroBannerProps {
  banner: {
    titleI18n: I18nString;
    breadcrumbI18n?: I18nString | null;
    backgroundImageUrl: string;
  };
}

export function AboutHeroBanner({ banner }: AboutHeroBannerProps) {
  const { locale } = useI18n();
  const bannerRef = React.useRef<HTMLDivElement>(null);
  const textRef = React.useRef<HTMLDivElement>(null);

  const title =
    banner.titleI18n?.[locale] || banner.titleI18n?.id || "About Us";

  React.useEffect(() => {
    if (!textRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 30, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: "power3.out" }
      );
    }, textRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={bannerRef}
      className="relative w-full h-[260px] sm:h-[320px] md:h-[360px] flex items-center justify-center overflow-hidden bg-zinc-950"
    >
      {/* Background Image with Dark Vignette */}
      <div className="absolute inset-0">
        <Image
          src={banner.backgroundImageUrl || "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1920&q=80"}
          alt="About Us Banner"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-105 filter brightness-[0.45] contrast-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/75" />
      </div>

      {/* Content */}
      <div
        ref={textRef}
        className="relative z-10 mx-auto max-w-4xl px-4 text-center"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
          {title}
        </h1>

        {/* Breadcrumb */}
        <div className="mt-3 sm:mt-4 flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold tracking-wide">
          <Link
            href="/"
            className="text-[#E76F1D] hover:underline transition-colors"
          >
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-zinc-300" />
          <span className="text-white">About US</span>
        </div>
      </div>
    </section>
  );
}
