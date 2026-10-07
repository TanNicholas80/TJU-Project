"use client";

import * as React from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useI18n } from "@/lib/i18n";
import { I18nString } from "@/db/schema";

import { defaultCertifications } from "@/lib/data-defaults";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface CertificationItem {
  id: string | number;
  titleI18n?: I18nString | null;
  imageUrl: string;
  sortOrder?: number;
  isActive?: boolean;
}

interface AboutCertificationsSectionProps {
  certifications: CertificationItem[];
}

const certImageMap: Record<string, string> = {
  "/images/certifications/haki.svg": "/images/certifications/logo_haki.png",
  "/images/certifications/iso.svg": "/images/certifications/logo_iso.png",
  "/images/certifications/sni.svg": "/images/certifications/logo_sni.png",
  "/images/certifications/tkdn.svg": "/images/certifications/logo_tkdn.png",
};

export function AboutCertificationsSection({
  certifications,
}: AboutCertificationsSectionProps) {
  const { locale } = useI18n();
  const sectionRef = React.useRef<HTMLElement>(null);
  const headerRef = React.useRef<HTMLDivElement>(null);
  const logosRef = React.useRef<HTMLDivElement>(null);

  const rawList = certifications && certifications.length > 0 ? certifications : defaultCertifications;

  const officialLogos = [
    {
      id: 1,
      title: "Sertifikasi Software Rekayasa Struktur HAKI",
      imageUrl: "/images/certifications/logo_haki.png",
    },
    {
      id: 2,
      title: "Sistem Manajemen Mutu ISO 9001:2015",
      imageUrl: "/images/certifications/logo_iso.png",
    },
    {
      id: 3,
      title: "Standar Nasional Indonesia SNI 8399:2017",
      imageUrl: "/images/certifications/logo_sni.png",
    },
    {
      id: 4,
      title: "Tingkat Komponen Dalam Negeri (TKDN) Kemenperin",
      imageUrl: "/images/certifications/logo_tkdn.png",
    },
  ];

  const activeCertifications = officialLogos.map((item, idx) => {
    const raw = rawList[idx];
    return {
      id: item.id,
      titleI18n: raw?.titleI18n || { id: item.title, en: item.title, zh: item.title },
      imageUrl: item.imageUrl,
    };
  });

  React.useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
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
              trigger: sectionRef.current,
              start: "top 82%",
              once: true,
            },
          }
        );
      }
      if (logosRef.current) {
        gsap.fromTo(
          logosRef.current.children,
          { opacity: 0, scale: 0.9, y: 20 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            delay: 0.15,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 82%",
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-16 sm:py-20 lg:py-24 bg-[#20449A] text-white overflow-hidden shadow-inner"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* Section Header */}
        <div ref={headerRef} className="mx-auto max-w-3xl text-center space-y-3.5">
          <span className="text-base sm:text-lg md:text-xl font-bold tracking-[0.2em] uppercase text-white/90">
            SERTIFIKASI & STANDAR
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold italic text-white tracking-tight leading-tight">
            Standar Mutu Tanpa Kompromi
          </h2>
          <p className="text-sm sm:text-base text-white/80 leading-relaxed font-normal max-w-2xl sm:max-w-3xl mx-auto">
            Seluruh material dan sistem perhitungan kami telah memenuhi standar
            kualitas nasional secara ketat, menjamin keamanan dan keandalan
            struktural di setiap proyek Anda.
          </p>
        </div>

        {/* Logos Row - 4 Logo PNG Resmi Tanpa Container dengan Animasi Hover */}
        <div
          ref={logosRef}
          className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 lg:gap-16 pt-4 sm:pt-6"
        >
          {activeCertifications.map((item) => {
            const label =
              item.titleI18n?.[locale] ||
              item.titleI18n?.id ||
              "Sertifikasi TJU";

            return (
              <div
                key={item.id}
                className="group relative flex items-center justify-center p-2 cursor-pointer transition-all duration-300 ease-out hover:scale-115 hover:-translate-y-2 hover:drop-shadow-[0_12px_24px_rgba(0,0,0,0.35)]"
                title={label}
              >
                <Image
                  src={item.imageUrl}
                  alt={label}
                  width={260}
                  height={100}
                  className="h-16 sm:h-20 md:h-22 lg:h-24 w-auto object-contain transition-transform duration-300"
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
