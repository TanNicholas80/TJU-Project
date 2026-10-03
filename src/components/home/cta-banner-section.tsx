"use client";

import * as React from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface CtaBannerSectionProps {
  className?: string;
  consultationHref?: string;
}

export function CtaBannerSection({
  className,
  consultationHref = "#contact",
}: CtaBannerSectionProps) {
  const { t, locale } = useI18n();
  const sectionRef = React.useRef<HTMLElement>(null);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const btnRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (cardRef.current) {
        gsap.fromTo(
          cardRef.current,
          { opacity: 0, scale: 0.96, y: 30 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
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
    <section ref={sectionRef} className={cn("relative w-full bg-white pb-16 pt-4 sm:pb-20 sm:pt-6", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div ref={cardRef} className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#20449A] px-6 py-12 text-center text-white shadow-xl sm:px-12 sm:py-16 md:px-16 md:py-20">
          {/* Subtle background glow effect */}
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-[#F48902]/20 blur-3xl" />

          {/* Heading */}
          <h2 className="relative z-10 mx-auto max-w-3xl text-2xl font-extrabold italic tracking-tight sm:text-3xl md:text-4xl md:leading-tight">
            {t("cta.title")}
          </h2>

          {/* Description */}
          <p className="relative z-10 mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-blue-100 sm:mt-5 sm:text-base md:text-lg">
            {locale === "en" ? (
              <>
                Discuss your project details with our{" "}
                <span className="font-semibold text-[#F48902]">engineering</span> team for results that are{" "}
                <strong className="text-white font-bold">safe, fast</strong>, and{" "}
                <strong className="text-white font-bold">financially efficient</strong>.
              </>
            ) : locale === "zh" ? (
              <>
                与我们的 <span className="font-semibold text-[#F48902]">工程</span> 团队探讨项目细节，实现{" "}
                <strong className="text-white font-bold">安全、高效</strong> 与{" "}
                <strong className="text-white font-bold">经济效益</strong> 的完美结合。
              </>
            ) : (
              <>
                Diskusikan detail proyek Anda bersama tim{" "}
                <span className="font-semibold text-[#F48902]">engineering</span> kami untuk hasil yang{" "}
                <strong className="text-white font-bold">aman, cepat</strong>, dan{" "}
                <strong className="text-white font-bold">efisien</strong> secara finansial.
              </>
            )}
          </p>

          {/* Action Button */}
          <div ref={btnRef} className="relative z-10 mt-8 flex justify-center sm:mt-10">
            <Link
              href={consultationHref}
              className="inline-flex items-center justify-center rounded-lg bg-[#F48902] px-8 py-3.5 text-sm sm:text-base font-bold text-white shadow-lg transition-all duration-200 hover:bg-[#d97702] hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
            >
              {t("cta.button")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
