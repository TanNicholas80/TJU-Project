"use client";

import * as React from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Play, X, ChevronDown } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function AboutStorySection() {
  const [isVideoModalOpen, setIsVideoModalOpen] = React.useState(false);
  const sectionRef = React.useRef<HTMLElement>(null);
  const textColRef = React.useRef<HTMLDivElement>(null);
  const videoCardRef = React.useRef<HTMLDivElement>(null);
  const imagesGridRef = React.useRef<HTMLDivElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      if (textColRef.current) {
        gsap.fromTo(
          textColRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              once: true,
            },
          }
        );
      }
      if (videoCardRef.current) {
        gsap.fromTo(
          videoCardRef.current,
          { opacity: 0, y: 30, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            delay: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              once: true,
            },
          }
        );
      }
      if (imagesGridRef.current) {
        gsap.fromTo(
          imagesGridRef.current.children,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            stagger: 0.18,
            ease: "power3.out",
            scrollTrigger: {
              trigger: imagesGridRef.current,
              start: "top 82%",
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleOpenVideo = () => {
    setIsVideoModalOpen(true);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().catch(() => {});
      }
    }, 100);
  };

  const handleCloseVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setIsVideoModalOpen(false);
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full pt-16 sm:pt-20 lg:pt-24 pb-12 sm:pb-16 bg-white overflow-hidden"
    >
      {/* Top Split: Story Text & Video Card (Clean Plain Background, No Grid) */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Story Text */}
          <div ref={textColRef} className="lg:col-span-7 space-y-5">
            <div className="inline-block">
              <span className="text-xs sm:text-sm font-black tracking-wider uppercase text-[#E76F1D]">
                TENTANG KAMI
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold italic text-[#1E1F24] leading-tight sm:leading-snug">
              Membangun Pondasi Kepercayaan.
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-[#62636C] leading-relaxed">
              <p>
                CV. Tri Jaya Utama didirikan pada tahun 2000 untuk menjawab
                besarnya permintaan pasar terhadap rangka atap baja ringan akibat
                semakin langkanya kayu berkualitas.
              </p>
              <p>
                Berawal dari aplikator pada tahun 2001 dengan merek TJU TRUSS,
                kami bertransformasi pada 2010 dengan memproduksi profil secara
                mandiri. Langkah ini memastikan kontrol kualitas mutlak, harga
                kompetitif, dan jaminan garansi nyata bagi Anda.
              </p>
            </div>
          </div>

          {/* Right Column: Company Profile Video Card with CAD Software Look */}
          <div ref={videoCardRef} className="lg:col-span-5 flex justify-center">
            <div
              onClick={handleOpenVideo}
              className="group relative w-full max-w-[440px] aspect-4/3 rounded-2xl overflow-hidden bg-black border border-zinc-700/80 shadow-xl cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
            >
              {/* CAD Software Top Toolbar */}
              <div className="relative z-10 h-7 bg-[#2f2f33] border-b border-[#444] px-2.5 flex items-center justify-between select-none">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-red-500/80" />
                  <div className="h-2 w-2 rounded-full bg-amber-500/80" />
                  <div className="h-2 w-2 rounded-full bg-emerald-500/80" />
                  <span className="text-[10px] text-zinc-400 font-mono ml-1 hidden sm:inline">
                    CAD-TRUSS v4.2
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-1 bg-[#1e1e22] px-2 py-0.5 rounded text-[9px] font-mono text-zinc-300 border border-[#444]">
                    <span>ByLayer</span>
                    <ChevronDown className="w-2.5 h-2.5 text-zinc-400" />
                  </div>
                  <div className="flex items-center gap-1 bg-[#1e1e22] px-2 py-0.5 rounded text-[9px] font-mono text-zinc-300 border border-[#444]">
                    <span>0.00 mm</span>
                    <ChevronDown className="w-2.5 h-2.5 text-zinc-400" />
                  </div>
                </div>
              </div>

              {/* CAD Truss Viewport / Blueprint Canvas */}
              <div className="relative w-full h-[calc(100%-28px)] bg-black p-3 flex items-center justify-center overflow-hidden">
                {/* CAD Grid Lines */}
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, #444 1px, transparent 1px),
                      linear-gradient(to bottom, #444 1px, transparent 1px)
                    `,
                    backgroundSize: "22px 22px",
                  }}
                />

                {/* SVG Blueprint Illustration */}
                <svg
                  viewBox="0 0 420 250"
                  className="w-full h-full opacity-85 group-hover:opacity-100 transition-opacity"
                  fill="none"
                >
                  {/* Reference Red Axis Line */}
                  <line x1="20" y1="120" x2="400" y2="120" stroke="#ef4444" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                  {/* Green Vertical Centerline */}
                  <line x1="210" y1="20" x2="210" y2="210" stroke="#22c55e" strokeWidth="1" strokeDasharray="4 2" opacity="0.7" />

                  {/* Main Truss Geometry (White / Silver chords) */}
                  <polygon points="40,195 210,50 380,195" stroke="#FFFFFF" strokeWidth="2.5" />
                  <line x1="40" y1="195" x2="380" y2="195" stroke="#FFFFFF" strokeWidth="2.5" />

                  {/* King Post & Web Members (Cyan / White) */}
                  <line x1="210" y1="50" x2="210" y2="195" stroke="#38bdf8" strokeWidth="1.8" />
                  <line x1="125" y1="122" x2="125" y2="195" stroke="#38bdf8" strokeWidth="1.5" />
                  <line x1="295" y1="122" x2="295" y2="195" stroke="#38bdf8" strokeWidth="1.5" />
                  <line x1="40" y1="195" x2="125" y2="122" stroke="#38bdf8" strokeWidth="1.5" />
                  <line x1="125" y1="195" x2="210" y2="50" stroke="#38bdf8" strokeWidth="1.5" />
                  <line x1="210" y1="50" x2="295" y2="195" stroke="#38bdf8" strokeWidth="1.5" />
                  <line x1="295" y1="122" x2="380" y2="195" stroke="#38bdf8" strokeWidth="1.5" />

                  {/* Outer Dimension lines */}
                  <line x1="40" y1="212" x2="380" y2="212" stroke="#94a3b8" strokeWidth="1" />
                  <line x1="40" y1="205" x2="40" y2="218" stroke="#94a3b8" strokeWidth="1" />
                  <line x1="380" y1="205" x2="380" y2="218" stroke="#94a3b8" strokeWidth="1" />
                  <text x="210" y="210" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">SPAN 12.000 mm</text>

                  {/* CAD Member Schedule Table on Right */}
                  <g opacity="0.6" transform="translate(345, 30)">
                    <rect x="0" y="0" width="60" height="110" fill="#111" stroke="#333" strokeWidth="0.8" />
                    <line x1="20" y1="0" x2="20" y2="110" stroke="#333" strokeWidth="0.8" />
                    <text x="5" y="12" fill="#888" fontSize="6" fontFamily="monospace">ID</text>
                    <text x="25" y="12" fill="#888" fontSize="6" fontFamily="monospace">L (mm)</text>
                    <line x1="0" y1="16" x2="60" y2="16" stroke="#333" strokeWidth="0.8" />
                    <text x="5" y="28" fill="#aaa" fontSize="6" fontFamily="monospace">L1</text>
                    <text x="25" y="28" fill="#aaa" fontSize="6" fontFamily="monospace">6420</text>
                    <text x="5" y="42" fill="#aaa" fontSize="6" fontFamily="monospace">L2</text>
                    <text x="25" y="42" fill="#aaa" fontSize="6" fontFamily="monospace">6420</text>
                    <text x="5" y="56" fill="#aaa" fontSize="6" fontFamily="monospace">L3</text>
                    <text x="25" y="56" fill="#aaa" fontSize="6" fontFamily="monospace">12000</text>
                    <text x="5" y="70" fill="#aaa" fontSize="6" fontFamily="monospace">L4</text>
                    <text x="25" y="70" fill="#aaa" fontSize="6" fontFamily="monospace">2450</text>
                  </g>

                  {/* CAD Engineering Calculation Readout at Bottom */}
                  <text x="210" y="226" fill="#22c55e" fontSize="7.5" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
                    Mark: Ap NLS Qty = 12 | Analysis Status = Passed 100%
                  </text>
                  <text x="210" y="238" fill="#38bdf8" fontSize="6.5" textAnchor="middle" fontFamily="monospace">
                    FS=1.0000 AP=5300 AH=2973 | CV. TRI JAYA UTAMA
                  </text>
                </svg>

                {/* Play Button Overlay (Rounded Ring + White Play Icon + Label) */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[1px] group-hover:bg-black/30 transition-all">
                  <div className="flex h-15 w-15 sm:h-16 sm:w-16 items-center justify-center rounded-full border-2 border-white/90 bg-black/45 backdrop-blur-[2px] text-white shadow-2xl transition-transform duration-300 group-hover:scale-110">
                    <Play className="h-6 w-6 sm:h-7 sm:w-7 fill-white text-white ml-0.5" />
                  </div>
                  <span className="mt-3 text-xs sm:text-sm font-bold tracking-wider text-white drop-shadow-md">
                    Company Profile
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Area: 2 Architectural Photos with Accent Kotak-Kotak (Grid Background Only Here) */}
      <div className="relative w-full mt-12 sm:mt-16 pt-10 pb-14 sm:pt-14 sm:pb-20">
        {/* Subtle Architectural Blueprint Grid Background - KHUSUS DI AREA GAMBAR */}
        <div
          className="absolute inset-0 pointer-events-none opacity-70"
          style={{
            backgroundImage: `
              linear-gradient(to right, #E2E8F0 1.2px, transparent 1.2px),
              linear-gradient(to bottom, #E2E8F0 1.2px, transparent 1.2px)
            `,
            backgroundSize: "44px 44px",
            backgroundPosition: "center center",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            ref={imagesGridRef}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start"
          >
            {/* Image 1: Greenhouse / Truss Construction (Posisi agak atas / offset ke atas) */}
            <div className="relative aspect-16/10 rounded-2xl overflow-hidden shadow-lg border border-[#E2E4EB]/80 group bg-zinc-100 md:-mt-8 lg:-mt-12">
              <Image
                src="/images/gambar_1.JPG"
                alt="Proyek Rangka Atap Baja Ringan TJU Truss"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Image 2: Residential Housing Project with Circular Badge */}
            <div className="relative aspect-16/10 rounded-2xl overflow-visible shadow-lg border border-[#E2E4EB]/80 group bg-zinc-100">
              <div className="relative w-full h-full rounded-2xl overflow-hidden">
                <Image
                  src="/images/gambar_2.png"
                  alt="Proyek Klaster Perumahan Rangka Atap TJU Truss"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Orange Circular Badge: QUALITY CONTROL MUTLAK (Tanpa border putih) */}
              <div className="absolute -bottom-5 -right-3 sm:-bottom-6 sm:-right-4 z-20 flex h-24 w-24 sm:h-28 sm:w-28 flex-col items-center justify-center rounded-full bg-[#E76F1D] text-white p-2 text-center shadow-xl transition-transform hover:scale-105 duration-300">
                <span className="text-[11px] sm:text-xs font-black tracking-wider uppercase leading-tight">
                  QUALITY
                </span>
                <span className="text-[11px] sm:text-xs font-black tracking-wider uppercase leading-tight">
                  CONTROL
                </span>
                <span className="text-[10px] sm:text-[11px] font-black tracking-wider uppercase leading-tight text-white">
                  MUTLAK
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal Dialog */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={handleCloseVideo}
          />
          <div className="relative z-10 w-full max-w-4xl rounded-2xl overflow-hidden bg-black shadow-2xl border border-zinc-700 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-zinc-900 border-b border-zinc-800 text-white">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#E76F1D]" />
                <h4 className="text-sm font-bold">Company Profile - CV. Tri Jaya Utama (TJU Truss)</h4>
              </div>
              <button
                type="button"
                onClick={handleCloseVideo}
                className="rounded-lg p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Video Player */}
            <div className="relative aspect-video bg-black flex items-center justify-center">
              <video
                ref={videoRef}
                src="/video/compro_tju.mp4"
                controls
                autoPlay
                className="w-full h-full object-contain"
              >
                Browser Anda tidak mendukung pemutar video HTML5.
              </video>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
