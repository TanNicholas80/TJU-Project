"use client";

import * as React from "react";
import gsap from "gsap";
import { useI18n } from "@/lib/i18n";

export function AboutVisionMissionSection() {
  const { locale } = useI18n();
  const sectionRef = React.useRef<HTMLElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const missionGridRef = React.useRef<HTMLDivElement>(null);

  const missions = [
    {
      num: "01.",
      text: "Mengutamakan kepentingan bersama bagi kepentingan semua pihak terkait.",
    },
    {
      num: "02.",
      text: "Memberikan pelayanan terbaik.",
    },
    {
      num: "03.",
      text: "Mengutamakan keamanan dan kenyamanan bagi pelanggan.",
    },
    {
      num: "04.",
      text: "Kepedulian terhadap lingkungan hidup dan masyarakat.",
    },
    {
      num: "05.",
      text: "Mengoptimalkan sumber daya manusia.",
    },
  ];

  React.useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      if (containerRef.current) {
        gsap.fromTo(
          containerRef.current,
          { opacity: 0, y: 35 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
        );
      }
      if (missionGridRef.current) {
        gsap.fromTo(
          missionGridRef.current.children,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.12,
            ease: "power2.out",
            delay: 0.25,
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-16 sm:py-20 lg:py-24 bg-[#F9F9FB] overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Blue Card Container */}
        <div
          ref={containerRef}
          className="relative overflow-hidden rounded-3xl bg-[#1B3F93] p-8 sm:p-12 lg:p-16 text-white shadow-2xl border border-blue-800/40"
        >
          {/* Decorative Subtle Diagonal Geometric Lines */}
          <div className="absolute inset-0 pointer-events-none opacity-10">
            <svg
              className="h-full w-full"
              viewBox="0 0 1000 600"
              preserveAspectRatio="none"
              fill="none"
              stroke="white"
              strokeWidth="2"
            >
              <line x1="0" y1="0" x2="300" y2="600" />
              <line x1="100" y1="0" x2="400" y2="600" />
              <line x1="200" y1="0" x2="500" y2="600" />
              <line x1="800" y1="0" x2="1000" y2="400" />
              <line x1="880" y1="0" x2="1080" y2="400" />
              <polygon points="50,50 150,20 120,120" strokeWidth="1.5" />
            </svg>
          </div>

          <div className="relative z-10 space-y-12">
            {/* Visi Perusahaan */}
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <span className="text-xs sm:text-sm font-black tracking-widest uppercase text-blue-200">
                VISI PERUSAHAAN
              </span>
              <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-white leading-snug sm:leading-tight">
                Menjadi perusahaan aplikasi rangka atap baja ringan terbesar,
                kompetitif, dan terpercaya di Indonesia.
              </h3>
            </div>

            {/* Misi Perusahaan Header */}
            <div className="text-center pt-2">
              <span className="text-xs sm:text-sm font-black tracking-widest uppercase text-blue-200">
                MISI PERUSAHAAN
              </span>
            </div>

            {/* Misi Grid: 2 cards on top row, 3 cards on bottom row */}
            <div ref={missionGridRef} className="space-y-4">
              {/* Row 1: 01 and 02 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {missions.slice(0, 2).map((item) => (
                  <div
                    key={item.num}
                    className="flex flex-col justify-start rounded-2xl bg-white/10 p-6 backdrop-blur-md border border-white/15 transition-all duration-300 hover:bg-white/15 hover:border-white/30"
                  >
                    <span className="text-xl sm:text-2xl font-black text-[#E76F1D]">
                      {item.num}
                    </span>
                    <p className="mt-2 text-sm sm:text-base text-blue-50 leading-relaxed font-medium">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Row 2: 03, 04, 05 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {missions.slice(2, 5).map((item) => (
                  <div
                    key={item.num}
                    className="flex flex-col justify-start rounded-2xl bg-white/10 p-6 backdrop-blur-md border border-white/15 transition-all duration-300 hover:bg-white/15 hover:border-white/30"
                  >
                    <span className="text-xl sm:text-2xl font-black text-[#E76F1D]">
                      {item.num}
                    </span>
                    <p className="mt-2 text-sm sm:text-base text-blue-50 leading-relaxed font-medium">
                      {item.text}
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
