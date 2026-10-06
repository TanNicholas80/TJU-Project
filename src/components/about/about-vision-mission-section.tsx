"use client";

import * as React from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useI18n } from "@/lib/i18n";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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
          { opacity: 0, scale: 0.96, y: 35 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 82%",
              once: true,
            },
          }
        );
      }
      if (missionGridRef.current) {
        gsap.fromTo(
          missionGridRef.current.children,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "power3.out",
            delay: 0.25,
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
      className="relative w-full py-16 sm:py-20 lg:py-24 bg-white overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Blue Card Container */}
        <div
          ref={containerRef}
          className="relative overflow-hidden rounded-3xl bg-[#1B3F93] p-8 sm:p-12 lg:p-16 text-white shadow-2xl border border-blue-800/40"
        >
          {/* Accent 1: Pojok Kiri Atas (accent_vision.png) */}
          <div className="absolute top-0 left-0 w-64 sm:w-80 md:w-96 lg:w-[420px] aspect-square pointer-events-none select-none">
            <Image
              src="/images/accent_vision.png"
              alt="Aksen Visi TJU Truss"
              fill
              className="object-contain object-left-top"
              priority
            />
          </div>

          {/* Accent 2: Pojok Kanan Bawah (accent_vision2.png) */}
          <div className="absolute bottom-0 right-0 w-56 sm:w-72 md:w-80 lg:w-[380px] aspect-square pointer-events-none select-none">
            <Image
              src="/images/accent_vision2.png"
              alt="Aksen Misi TJU Truss"
              fill
              className="object-contain object-right-bottom"
              priority
            />
          </div>

          <div className="relative z-10 space-y-12">
            {/* Visi Perusahaan */}
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <span className="text-base sm:text-lg md:text-xl font-bold tracking-[0.2em] uppercase text-[#DDDDDD]">
                VISI PERUSAHAAN
              </span>
              <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-white leading-snug sm:leading-tight">
                Menjadi perusahaan aplikasi rangka atap baja ringan terbesar,
                kompetitif, dan terpercaya di Indonesia.
              </h3>
            </div>

            {/* Misi Perusahaan Header */}
            <div className="text-center pt-2">
              <span className="text-base sm:text-lg md:text-xl font-bold tracking-[0.2em] uppercase text-[#DDDDDD]">
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
