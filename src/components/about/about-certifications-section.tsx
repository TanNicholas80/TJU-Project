"use client";

import * as React from "react";
import Image from "next/image";
import gsap from "gsap";
import { useI18n } from "@/lib/i18n";
import { I18nString } from "@/db/schema";

export interface CertificationItem {
  id: number;
  titleI18n?: I18nString | null;
  imageUrl: string;
  sortOrder?: number;
  isActive?: boolean;
}

interface AboutCertificationsSectionProps {
  certifications: CertificationItem[];
}

export function AboutCertificationsSection({
  certifications,
}: AboutCertificationsSectionProps) {
  const { locale } = useI18n();
  const sectionRef = React.useRef<HTMLElement>(null);
  const headerRef = React.useRef<HTMLDivElement>(null);
  const logosRef = React.useRef<HTMLDivElement>(null);

  const activeCertifications = certifications.filter(
    (c) => c.isActive !== false
  );

  React.useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }
        );
      }
      if (logosRef.current) {
        gsap.fromTo(
          logosRef.current.children,
          { opacity: 0, scale: 0.85, y: 20 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.4)",
            delay: 0.2,
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-16 sm:py-20 bg-[#20449A] text-white overflow-hidden shadow-inner"
    >
      {/* Background Decorative Truss Line Accent */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="cert-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 40 M 0 0 L 40 40" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cert-grid)" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div ref={headerRef} className="mx-auto max-w-3xl text-center space-y-3">
          <span className="text-xs sm:text-sm font-black tracking-widest uppercase text-blue-200">
            SERTIFIKASI & STANDAR
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold italic text-white tracking-tight">
            Standar Mutu Tanpa Kompromi
          </h2>
          <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed font-normal max-w-2xl mx-auto">
            Seluruh material dan sistem perhitungan kami telah memenuhi standar
            kualitas nasional secara ketat, menjamin keamanan dan keandalan
            struktural di setiap proyek Anda.
          </p>
        </div>

        {/* Logos Flex/Grid */}
        <div
          ref={logosRef}
          className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 lg:gap-10 pt-4"
        >
          {activeCertifications.map((item) => {
            const label =
              item.titleI18n?.[locale] ||
              item.titleI18n?.id ||
              "Sertifikasi TJU";

            return (
              <div
                key={item.id}
                className="group relative flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-1.5"
                title={label}
              >
                <div className="relative flex h-20 w-24 sm:h-24 sm:w-28 items-center justify-center rounded-2xl bg-white/10 p-3.5 backdrop-blur-md border border-white/20 shadow-lg group-hover:bg-white/20 group-hover:border-white/40 group-hover:shadow-blue-900/50 transition-all">
                  <Image
                    src={item.imageUrl}
                    alt={label}
                    width={90}
                    height={70}
                    className="max-h-14 w-auto object-contain filter drop-shadow transition-transform group-hover:scale-110"
                  />
                </div>
                <span className="mt-2 text-[11px] font-medium text-blue-100 opacity-0 group-hover:opacity-100 transition-opacity text-center max-w-[120px] line-clamp-1 pointer-events-none">
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
