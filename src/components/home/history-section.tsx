"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function HistorySection() {
  const { t } = useI18n();

  const milestones = [
    {
      year: t("history.milestones.m2000.year"),
      description: t("history.milestones.m2000.description"),
      isCurrent: false,
    },
    {
      year: t("history.milestones.m2001.year"),
      description: t("history.milestones.m2001.description"),
      isCurrent: false,
    },
    {
      year: t("history.milestones.m2010.year"),
      description: t("history.milestones.m2010.description"),
      isCurrent: false,
    },
    {
      year: t("history.milestones.now.year"),
      description: t("history.milestones.now.description"),
      isCurrent: true,
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-[#F9F9FB] border-b border-[#E2E4EB] overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Heading, Description & CTA */}
          <div className="lg:col-span-6 space-y-6">
            <span className="inline-block text-xs sm:text-sm font-bold tracking-wider uppercase text-[#F48902]">
              {t("history.badge")}
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black italic tracking-tight text-[#1E1F24] leading-[1.18]">
              {t("history.title")}
            </h2>

            <p className="text-sm sm:text-base md:text-lg text-[#62636C] leading-relaxed max-w-xl">
              {t("history.description")}
            </p>

            <div className="pt-2">
              <Link href="/about">
                <Button
                  className="bg-[#20449A] hover:bg-[#1a3880] text-white font-semibold px-7 py-3 h-auto text-sm sm:text-base rounded-md shadow-md transition-transform active:scale-95 cursor-pointer"
                >
                  {t("history.cta")}
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Vertical Timeline */}
          <div className="lg:col-span-6">
            <div className="relative">
              {/* Milestones List */}
              <div className="space-y-8 sm:space-y-10">
                {milestones.map((item, idx) => (
                  <div key={idx} className="relative flex items-center gap-5 sm:gap-7">
                    {/* Badge Container with Centered Line Segment */}
                    <div className="relative flex w-20 shrink-0 items-center justify-center">
                      {/* Vertical line passing behind badge */}
                      {idx !== 0 && (
                        <div
                          className="absolute -top-10 sm:-top-12 bottom-1/2 left-1/2 w-[2px] bg-[#E2E4EB] -translate-x-1/2"
                          aria-hidden="true"
                        />
                      )}
                      {idx !== milestones.length - 1 && (
                        <div
                          className="absolute top-1/2 -bottom-10 sm:-bottom-12 left-1/2 w-[2px] bg-[#E2E4EB] -translate-x-1/2"
                          aria-hidden="true"
                        />
                      )}

                      {/* Year Badge */}
                      <div
                        className={cn(
                          "relative z-10 flex h-10 w-20 items-center justify-center rounded-full text-sm font-bold text-white shadow-xs select-none",
                          item.isCurrent ? "bg-[#F48902]" : "bg-[#20449A]"
                        )}
                      >
                        {item.year}
                      </div>
                    </div>

                    {/* Milestone Description */}
                    <p className="text-sm sm:text-base text-[#62636C] leading-relaxed font-normal">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
