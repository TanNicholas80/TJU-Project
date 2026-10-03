"use client";

import * as React from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useI18n } from "@/lib/i18n";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function CoreValuesSection() {
  const { t } = useI18n();
  const sectionRef = React.useRef<HTMLElement>(null);
  const logoRef = React.useRef<HTMLDivElement>(null);
  const textRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (logoRef.current) {
        gsap.fromTo(
          logoRef.current,
          { opacity: 0, scale: 0.88 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      if (textRef.current) {
        gsap.fromTo(
          textRef.current,
          { opacity: 0, x: 25 },
          {
            opacity: 1,
            x: 0,
            duration: 0.9,
            delay: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden bg-slate-950 py-16 sm:py-20 md:py-24">
      {/* Background Image with Dark Dim Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/core_background.png"
          alt="Core Values Background"
          fill
          priority={false}
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Layer overlay gelap agar teks dan logo terbaca tajam dan elegan */}
        <div className="absolute inset-0 bg-slate-950/75 sm:bg-slate-950/70" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8 md:gap-10">
          {/* Logo HAKI (Pure Image) */}
          <div ref={logoRef} className="shrink-0 flex items-center justify-center">
            <Image
              src="/images/haki_logo.png"
              alt="HAKI Logo"
              width={140}
              height={140}
              unoptimized
              priority
              className="h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 object-contain drop-shadow-md"
            />
          </div>

          {/* Text Content */}
          <div ref={textRef} className="flex flex-col text-center sm:text-left">
            <h2 className="text-2xl font-bold tracking-tight text-white italic sm:text-3xl md:text-4xl drop-shadow-sm font-sans">
              {t("coreValues.title")}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-200 sm:text-base md:text-lg max-w-2xl font-normal drop-shadow-xs">
              {t("coreValues.description")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
