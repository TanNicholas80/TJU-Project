"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ChevronRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { markViewIntent } from "@/lib/view-tracker";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface PortfolioDetailGalleryImage {
  id: number;
  imageUrl: string;
}

export interface RelatedPortfolioProject {
  id: number;
  title: string;
  categoryName: string;
  coverImageUrl: string;
  location?: string;
}

interface PortfolioDetailContentProps {
  id: number | string;
  title: string;
  location: string;
  categoryBadge: string;
  coverImageUrl: string;
  galleryImages: PortfolioDetailGalleryImage[];
  otherProjects: RelatedPortfolioProject[];
}

export function PortfolioDetailContent({
  id,
  title,
  location,
  categoryBadge,
  coverImageUrl,
  galleryImages,
  otherProjects,
}: PortfolioDetailContentProps) {
  // Ensure we have at least 4 thumbnails for the gallery row (fallback with cover + high quality roof shots if fewer)
  const defaultFallbacks = [
    coverImageUrl,
    "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80",
    "/images/gambar_1.JPG",
    "https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=1200&q=80",
  ];

  const allGalleryImages = React.useMemo(() => {
    const list: string[] = [];
    if (coverImageUrl) list.push(coverImageUrl);
    if (galleryImages && galleryImages.length > 0) {
      galleryImages.forEach((img) => {
        if (!list.includes(img.imageUrl)) list.push(img.imageUrl);
      });
    }
    // Pad to 4 images if fewer
    let i = 0;
    while (list.length < 4 && i < defaultFallbacks.length) {
      if (!list.includes(defaultFallbacks[i])) {
        list.push(defaultFallbacks[i]);
      }
      i++;
    }
    return list.slice(0, 4);
  }, [coverImageUrl, galleryImages]);

  const [activeImage, setActiveImage] = React.useState<string>(allGalleryImages[0] || coverImageUrl);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const headerRef = React.useRef<HTMLDivElement>(null);
  const mainImageRef = React.useRef<HTMLDivElement>(null);
  const thumbnailsRef = React.useRef<HTMLDivElement>(null);
  const relatedSectionRef = React.useRef<HTMLDivElement>(null);
  const gridRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Header elements entrance
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.children,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.1,
            ease: "power3.out",
          }
        );
      }

      // 2. Main preview image scale-in
      if (mainImageRef.current) {
        gsap.fromTo(
          mainImageRef.current,
          { opacity: 0, scale: 0.96, y: 25 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.85,
            delay: 0.2,
            ease: "power2.out",
          }
        );
      }

      // 3. Thumbnails row stagger
      if (thumbnailsRef.current) {
        gsap.fromTo(
          thumbnailsRef.current.children,
          { opacity: 0, y: 15, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            delay: 0.4,
            stagger: 0.08,
            ease: "back.out(1.4)",
          }
        );
      }

      // 4. Related Projects Grid on scroll
      if (gridRef.current) {
        gsap.fromTo(
          gridRef.current.children,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 82%",
              once: true,
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleSelectImage = (imgUrl: string) => {
    if (imgUrl === activeImage) return;
    if (mainImageRef.current) {
      gsap.to(mainImageRef.current, {
        opacity: 0.4,
        scale: 0.98,
        duration: 0.15,
        onComplete: () => {
          setActiveImage(imgUrl);
          gsap.to(mainImageRef.current, {
            opacity: 1,
            scale: 1,
            duration: 0.35,
            ease: "power2.out",
          });
        },
      });
    } else {
      setActiveImage(imgUrl);
    }
  };

  return (
    <div ref={containerRef} className="w-full bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header Section: Breadcrumb, Title & Location */}
        <div ref={headerRef} className="space-y-3 mb-6 md:mb-8 text-center">
          {/* Breadcrumb Navigation Centered: Home > Portofolio > Title */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold">
            <Link href="/" className="text-[#F48902] hover:underline">
              Home
            </Link>
            <span className="text-slate-300 font-normal">&gt;</span>
            <Link href="/portofolio" className="text-[#F48902] hover:underline">
              Portofolio
            </Link>
            <span className="text-slate-300 font-normal">&gt;</span>
            <span className="text-slate-500 font-normal truncate max-w-[200px] sm:max-w-md">
              {title}
            </span>
          </div>

          {/* Project Title Centered Italic Bold */}
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold italic text-[#1E1F24] tracking-tight text-center max-w-4xl mx-auto leading-tight md:leading-[1.2]">
            {title}
          </h1>

          {/* Location Centered */}
          <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm text-slate-500 font-medium">
            <MapPin className="h-4 w-4 text-[#F48902] shrink-0" />
            <span>{location}</span>
          </div>
        </div>

        {/* Featured Large Image Box */}
        <div
          ref={mainImageRef}
          className="relative w-full h-[340px] sm:h-[460px] md:h-[540px] lg:h-[600px] rounded-2xl md:rounded-3xl overflow-hidden shadow-xl bg-slate-900 mb-6"
        >
          <Image
            src={activeImage}
            alt={title}
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1200px"
            className="object-cover object-center"
          />
        </div>

        {/* Interactive Gallery Thumbnails Row */}
        <div
          ref={thumbnailsRef}
          className="flex items-center justify-center gap-3 sm:gap-4 mb-16 sm:mb-20"
        >
          {allGalleryImages.map((imgUrl, idx) => {
            const isActive = imgUrl === activeImage;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectImage(imgUrl)}
                className={`relative h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 ${
                  isActive
                    ? "ring-3 ring-[#20449A] ring-offset-2 scale-105 shadow-md"
                    : "opacity-75 hover:opacity-100 hover:scale-102 border border-slate-200"
                }`}
                aria-label={`Lihat foto ${idx + 1}`}
              >
                <Image
                  src={imgUrl}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  sizes="96px"
                  className="object-cover object-center"
                />
              </button>
            );
          })}
        </div>

        {/* Section: Proyek Kami Lainnya */}
        <div ref={relatedSectionRef} className="space-y-8 sm:space-y-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold italic text-[#1E1F24] tracking-tight text-center">
            Proyek Kami Lainnya
          </h2>

          {/* 2x2 Grid of 4 Cards */}
          {otherProjects && otherProjects.length > 0 && (
            <div
              ref={gridRef}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8"
            >
              {otherProjects.map((item) => (
                <Link
                  key={item.id}
                  href={`/portofolio/${item.id}`}
                  onClick={() => markViewIntent("portfolio", item.id)}
                  className="group relative overflow-hidden rounded-2xl sm:rounded-3xl bg-slate-900 shadow-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 h-[260px] sm:h-[300px] md:h-[340px] block cursor-pointer"
                >
                  {/* Gambar Portofolio */}
                  <Image
                    src={item.coverImageUrl || "/images/core_background.png"}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-106"
                  />

                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10 transition-opacity duration-300 group-hover:from-black/90 group-hover:via-black/45" />

                  {/* Content Overlay di pojok kiri bawah (Badge Orange + Judul Putih Tebal) */}
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 flex flex-col items-start gap-2 z-10">
                    <span className="inline-block rounded-md bg-[#F48902] px-3.5 py-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white shadow-sm">
                      {item.categoryName || "KOMERSIAL"}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-extrabold italic text-white tracking-tight line-clamp-2 drop-shadow-sm group-hover:text-blue-100 transition-colors">
                      {item.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Centered Button: Lihat Lebih Banyak > */}
          <div className="flex justify-center pt-2 sm:pt-4">
            <Link
              href="/portofolio"
              className="inline-flex items-center gap-2 rounded-xl border border-[#E2E4EB] bg-white px-7 py-3 text-sm font-bold text-[#1E1F24] hover:bg-slate-50 hover:border-[#20449A] hover:text-[#20449A] transition-all shadow-xs group"
            >
              <span>Lihat Lebih Banyak</span>
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
