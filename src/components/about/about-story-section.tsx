"use client";

import * as React from "react";
import Image from "next/image";
import gsap from "gsap";
import { Play, X, ShieldAlert, Award } from "lucide-react";

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
          { opacity: 0, x: -30 },
          { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }
        );
      }
      if (videoCardRef.current) {
        gsap.fromTo(
          videoCardRef.current,
          { opacity: 0, x: 30 },
          { opacity: 1, x: 0, duration: 0.8, ease: "power2.out", delay: 0.2 }
        );
      }
      if (imagesGridRef.current) {
        gsap.fromTo(
          imagesGridRef.current.children,
          { opacity: 0, y: 35 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power2.out", delay: 0.3 }
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
      className="relative w-full py-16 sm:py-20 lg:py-24 bg-white overflow-hidden"
    >
      {/* Subtle Architectural Blueprint Grid Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #20449A 1px, transparent 1px),
            linear-gradient(to bottom, #20449A 1px, transparent 1px)
          `,
          backgroundSize: "36px 36px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Top Split: Story Text & Video Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Story Text */}
          <div ref={textColRef} className="lg:col-span-7 space-y-6">
            <div className="inline-block">
              <span className="text-xs sm:text-sm font-black tracking-wider uppercase text-[#E76F1D]">
                TENTANG KAMI
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1E1F24] leading-tight sm:leading-snug">
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

          {/* Right Column: Company Profile Video Card */}
          <div ref={videoCardRef} className="lg:col-span-5 flex justify-center">
            <div
              onClick={handleOpenVideo}
              className="group relative w-full max-w-[420px] aspect-4/3 rounded-2xl overflow-hidden bg-zinc-900 border-2 border-zinc-800 shadow-xl cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
            >
              {/* Blueprint / Truss Simulation Preview */}
              <div
                className="absolute inset-0 bg-[#0f172a] opacity-90 flex items-center justify-center p-4"
                style={{
                  backgroundImage: `
                    radial-gradient(circle at center, rgba(32,68,154,0.3) 0%, transparent 70%),
                    linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)
                  `,
                  backgroundSize: "100% 100%, 20px 20px, 20px 20px",
                }}
              >
                {/* SVG Blueprint Illustration */}
                <svg
                  viewBox="0 0 400 240"
                  className="w-full h-auto opacity-75 group-hover:opacity-90 transition-opacity"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="1.8"
                >
                  {/* Roof Truss geometry */}
                  <polygon points="40,200 200,40 360,200" stroke="#38bdf8" strokeWidth="2.5" />
                  <line x1="40" y1="200" x2="360" y2="200" stroke="#38bdf8" strokeWidth="2.5" />
                  <line x1="200" y1="40" x2="200" y2="200" stroke="#34d399" strokeDasharray="3 3" />
                  <line x1="120" y1="120" x2="120" y2="200" stroke="#38bdf8" />
                  <line x1="280" y1="120" x2="280" y2="200" stroke="#38bdf8" />
                  <line x1="40" y1="200" x2="120" y2="120" stroke="#38bdf8" />
                  <line x1="120" y1="200" x2="200" y2="40" stroke="#38bdf8" />
                  <line x1="200" y1="40" x2="280" y2="200" stroke="#38bdf8" />
                  <line x1="280" y1="120" x2="360" y2="200" stroke="#38bdf8" />
                  {/* Grid Crosshair */}
                  <line x1="200" y1="20" x2="200" y2="220" stroke="#22c55e" strokeWidth="1" strokeDasharray="2 2" />
                  <line x1="20" y1="120" x2="380" y2="120" stroke="#22c55e" strokeWidth="1" strokeDasharray="2 2" />
                  <text x="200" y="225" fill="#22c55e" fontSize="10" textAnchor="middle" fontFamily="monospace">
                    CAD-ENGINEERED TRUSS
                  </text>
                </svg>
              </div>

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/35 backdrop-blur-[1px] group-hover:bg-black/25 transition-all">
                <div className="flex h-16 w-16 sm:h-18 sm:w-18 items-center justify-center rounded-full bg-white/95 text-[#20449A] shadow-2xl transition-transform duration-300 group-hover:scale-110">
                  <Play className="h-7 w-7 fill-current ml-1 text-[#20449A]" />
                </div>
                <span className="mt-3.5 text-xs sm:text-sm font-bold tracking-wider text-white uppercase drop-shadow-md">
                  Company Profile
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Grid: 2 Architectural Photos with QUALITY CONTROL MUTLAK Badge */}
        <div ref={imagesGridRef} className="relative pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-center">
            {/* Image 1: Greenhouse / Truss Construction */}
            <div className="relative aspect-16/10 rounded-2xl overflow-hidden shadow-lg border border-[#E2E4EB] group bg-zinc-100">
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
            <div className="relative aspect-16/10 rounded-2xl overflow-visible shadow-lg border border-[#E2E4EB] group bg-zinc-100">
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

              {/* Orange Circular Badge: QUALITY CONTROL MUTLAK */}
              <div className="absolute -bottom-5 -right-3 sm:-bottom-6 sm:-right-4 z-20 flex h-24 w-24 sm:h-28 sm:w-28 flex-col items-center justify-center rounded-full bg-[#E76F1D] text-white p-2 text-center shadow-xl border-4 border-white transition-transform hover:scale-105 duration-300">
                <span className="text-[10px] sm:text-[11px] font-black tracking-wider uppercase leading-tight">
                  QUALITY
                </span>
                <span className="text-[10px] sm:text-[11px] font-black tracking-wider uppercase leading-tight">
                  CONTROL
                </span>
                <span className="text-[9px] sm:text-[10px] font-extrabold tracking-wider uppercase leading-tight text-white/90">
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
