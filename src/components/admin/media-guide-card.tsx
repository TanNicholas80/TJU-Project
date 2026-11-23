"use client";

import * as React from "react";
import {
  Info,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Video,
  FileCheck,
  Sparkles,
  ExternalLink,
} from "lucide-react";

interface MediaGuideCardProps {
  type?: "image" | "video" | "carousel" | "all";
  defaultOpen?: boolean;
}

export function MediaGuideCard({ type = "all", defaultOpen = false }: MediaGuideCardProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className="rounded-2xl border border-blue-200/80 bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-white p-4 sm:p-5 shadow-xs transition-all">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#20449A] text-white shadow-xs">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#1E1F24]">
              Panduan Best Practice Upload Foto & Video
            </h4>
            <p className="text-xs text-[#62636C]">
              Standar spesifikasi agar website tetap cepat, responsif, dan gambar tajam
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-1 rounded-xl border border-blue-200 bg-white px-3 py-1.5 text-xs font-bold text-[#20449A] hover:bg-blue-50/80 transition-colors cursor-pointer shadow-xs"
        >
          <span>{isOpen ? "Tutup Panduan" : "Lihat Panduan"}</span>
          {isOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-blue-100/80 space-y-4 text-xs text-[#3B3D45]">
          {/* Grid Kategori Media */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {/* 1. Hero Carousel */}
            {(type === "all" || type === "carousel" || type === "image") && (
              <div className="rounded-xl border border-white bg-white/90 p-3.5 shadow-xs space-y-1.5">
                <div className="flex items-center gap-1.5 text-[#20449A] font-bold">
                  <ImageIcon className="h-4 w-4 text-[#F48902]" />
                  <span>Hero Carousel (Beranda)</span>
                </div>
                <ul className="space-y-1 text-slate-600">
                  <li>• <strong>Rasio:</strong> 16:9 (Landscape)</li>
                  <li>• <strong>Resolusi:</strong> 1920 × 1080 px (FHD)</li>
                  <li>• <strong>Format:</strong> WebP atau JPG terkompresi</li>
                  <li>• <strong>Ukuran:</strong> Disarankan &lt; 800 KB</li>
                  <li className="text-[11px] text-slate-500 italic">
                    Tips: Beri ruang kosong di sisi kiri untuk teks headline.
                  </li>
                </ul>
              </div>
            )}

            {/* 2. Portofolio & Proyek */}
            {(type === "all" || type === "image") && (
              <div className="rounded-xl border border-white bg-white/90 p-3.5 shadow-xs space-y-1.5">
                <div className="flex items-center gap-1.5 text-[#20449A] font-bold">
                  <FileCheck className="h-4 w-4 text-[#F48902]" />
                  <span>Foto Portofolio & Galeri</span>
                </div>
                <ul className="space-y-1 text-slate-600">
                  <li>• <strong>Cover:</strong> 1200 × 800 px (16:9 atau 4:3)</li>
                  <li>• <strong>Galeri:</strong> Maksimal 12 foto dokumentasi</li>
                  <li>• <strong>Format:</strong> WebP / JPG (&lt; 500 KB/foto)</li>
                  <li className="text-[11px] text-slate-500 italic">
                    Tips: Foto terang dengan fokus jelas pada detail sambungan baja.
                  </li>
                </ul>
              </div>
            )}

            {/* 3. Video Proyek */}
            {(type === "all" || type === "video") && (
              <div className="rounded-xl border border-white bg-white/90 p-3.5 shadow-xs space-y-1.5">
                <div className="flex items-center gap-1.5 text-[#20449A] font-bold">
                  <Video className="h-4 w-4 text-emerald-600" />
                  <span>Video Proyek & Dokumentasi</span>
                </div>
                <ul className="space-y-1 text-slate-600">
                  <li>• <strong>Rekomendasi Utama:</strong> Tautan <strong>YouTube / Vimeo</strong></li>
                  <li>• <strong>Keuntungan Link:</strong> Bebas beban server & loading instan</li>
                  <li>• <strong>Upload Langsung:</strong> Format MP4 (H.264), maks. 50MB</li>
                  <li className="text-[11px] text-slate-500 italic">
                    Tips: Video 30-90 detik (timelapse atau drone aerial).
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Tools Kompresi Rekomendasi */}
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-blue-100/60 px-3.5 py-2 text-[11px] text-[#20449A]">
            <span className="font-medium">
              💡 <strong>Alat Gratis Rekomendasi:</strong> Kompres gambar via <strong>TinyPNG</strong> atau <strong>Squoosh.app</strong> untuk hasil WebP tanpa penurunan kualitas.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
