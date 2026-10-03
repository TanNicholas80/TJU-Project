"use client";

import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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
  const { t, locale } = useI18n();
  const sectionRef = React.useRef<HTMLElement>(null);
  const headerRef = React.useRef<HTMLHeadingElement>(null);
  const underlineRef = React.useRef<HTMLDivElement>(null);
  const cardsRef = React.useRef<HTMLDivElement>(null);

  const activeStandards = standards.filter((s) => s.isActive);

  React.useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Header Animation
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            once: true,
          },
        }
      );

      // Underline animation
      gsap.fromTo(
        underlineRef.current,
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1,
          opacity: 1,
          duration: 0.8,
          delay: 0.2,
          ease: "power2.out",
          transformOrigin: "center",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            once: true,
          },
        }
      );

      // Cards staggered reveal
      if (cardsRef.current) {
        gsap.fromTo(
          cardsRef.current.children,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }
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
      className="py-20 bg-white"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-16 flex flex-col items-center">
          <h2
            ref={headerRef}
            className="text-3xl sm:text-4xl md:text-5xl font-black italic tracking-tight text-[#1E1F24]"
          >
            {t("qualityStandards.title")}
          </h2>
          {/* Underline Orange Responsive (Proporsional sesuai desain) */}
          <div
            ref={underlineRef}
            className="mt-4 h-1.5 w-44 sm:w-56 md:w-64 lg:w-72 rounded-full bg-[#F48902]"
          />
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
                className="group relative rounded-2xl border border-[#E2E4EB] bg-[#F9F9FB] p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#20449A]/5 hover:border-[#20449A]/40 flex flex-col justify-start"
              >
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
