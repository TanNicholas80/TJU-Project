"use client";

import * as React from "react";
import gsap from "gsap";
import {
  ShieldCheck,
  Calculator,
  Award,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
  LucideIcon,
} from "lucide-react";
import { useI18n, Locale } from "@/lib/i18n";
import { I18nString } from "@/db/schema";

export interface QualityStandardItem {
  id: number;
  iconName: string;
  titleI18n: I18nString;
  descriptionI18n: I18nString;
  sortOrder: number;
  isActive: boolean;
}

const iconMap: Record<string, LucideIcon> = {
  ShieldCheck,
  Calculator,
  Award,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
};

interface QualityStandardsSectionProps {
  standards: QualityStandardItem[];
}

export function QualityStandardsSection({ standards }: QualityStandardsSectionProps) {
  const { locale } = useI18n();
  const sectionRef = React.useRef<HTMLElement>(null);
  const cardsRef = React.useRef<HTMLDivElement>(null);

  const activeStandards = standards.filter((s) => s.isActive);

  React.useEffect(() => {
    if (!cardsRef.current) return;
    const cards = cardsRef.current.children;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: "power2.out",
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [standards]);

  const getLocalized = (field?: I18nString | null) => {
    if (!field) return "";
    return field[locale as Locale] || field.id || "";
  };

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-white border-b border-[#E2E4EB]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#EEF2FA] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#20449A]">
            <Award className="h-4 w-4 text-[#F48902]" />
            Standar Kualitas & Rekayasa TJU
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E1F24] tracking-tight">
            Fondasi Struktur Kokoh Berstandar Rekayasa Tinggi
          </h2>
          <p className="text-base sm:text-lg text-[#62636C] leading-relaxed">
            Kami menjamin setiap sambungan, profil, dan sudut kemiringan rangka atap Anda didesain dengan perhitungan presisi mutlak tanpa kompromi.
          </p>
        </div>

        {/* 3-Column Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {activeStandards.map((item) => {
            const Icon = iconMap[item.iconName] || ShieldCheck;
            return (
              <div
                key={item.id}
                className="group relative rounded-2xl border border-[#E2E4EB] bg-[#F9F9FB] p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#20449A]/5 hover:border-[#20449A]/40 flex flex-col justify-between"
              >
                <div>
                  {/* Icon badge */}
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-[#20449A] text-white shadow-md shadow-[#20449A]/20 transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#F48902]">
                    <Icon className="h-7 w-7 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="mt-6 text-xl font-bold text-[#1E1F24] group-hover:text-[#20449A] transition-colors">
                    {getLocalized(item.titleI18n)}
                  </h3>

                  {/* Description */}
                  <p className="mt-3 text-sm text-[#62636C] leading-relaxed">
                    {getLocalized(item.descriptionI18n)}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E2E4EB]/80 flex items-center gap-2 text-xs font-semibold text-[#20449A]">
                  <CheckCircle2 className="h-4 w-4 text-[#F48902]" />
                  <span>Terverifikasi SNI & K3</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
