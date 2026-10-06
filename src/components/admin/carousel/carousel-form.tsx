"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  ArrowLeft,
  Save,
  Loader2,
  Sparkles,
  MessageSquare,
  Monitor,
  Tablet,
  Smartphone,
  Layers,
  Type,
  Sliders,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/admin/image-upload";
import { createCarousel, updateCarousel, CarouselInput } from "@/actions/carousel";

const carouselFormSchema = z.object({
  imageUrl: z.string().min(1, "Gambar banner wajib diunggah"),
  subheaderId: z.string().optional(),
  titleId: z.string().min(3, "Judul banner wajib diisi minimal 3 karakter"),
  descriptionId: z.string().optional(),
  loadingTitleId: z.string().optional(),
  ctaTextId: z.string().optional(),
  ctaLink: z.string().optional(),
  sortOrder: z.coerce.number().default(1),
  isActive: z.boolean().default(true),
});

type CarouselFormData = z.infer<typeof carouselFormSchema>;

interface CarouselFormProps {
  initialData?: any;
  carouselId?: number;
  isEdit?: boolean;
}

export function CarouselForm({ initialData, carouselId, isEdit = false }: CarouselFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [previewDevice, setPreviewDevice] = React.useState<"desktop" | "tablet" | "mobile">("desktop");

  const defaultValues: CarouselFormData = {
    imageUrl: initialData?.imageUrl || "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1920&q=80",
    subheaderId: initialData?.subheaderI18n?.id || "SOLUSI TERINTEGRASI",
    titleId: initialData?.titleI18n?.id || "",
    descriptionId: initialData?.descriptionI18n?.id || initialData?.subtitleI18n?.id || "",
    loadingTitleId: initialData?.loadingTitleI18n?.id || "Structure",
    ctaTextId: initialData?.ctaTextI18n?.id || "Konsultasi Proyek",
    ctaLink: initialData?.ctaLink || "#contact",
    sortOrder: initialData?.sortOrder ?? 1,
    isActive: initialData?.isActive !== undefined ? Boolean(initialData.isActive) : true,
  };

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<CarouselFormData>({
    resolver: zodResolver(carouselFormSchema) as any,
    defaultValues,
  });

  // Watch values for real-time live preview
  const watchedImageUrl = watch("imageUrl");
  const watchedSubheaderId = watch("subheaderId");
  const watchedTitleId = watch("titleId");
  const watchedDescriptionId = watch("descriptionId");
  const watchedLoadingTitleId = watch("loadingTitleId");
  const watchedCtaTextId = watch("ctaTextId");
  const watchedSortOrder = watch("sortOrder");
  const watchedIsActive = watch("isActive");

  // Fallbacks for live preview
  const previewSubheader = watchedSubheaderId || "SOLUSI TERINTEGRASI";
  const previewTitle = watchedTitleId || "Solusi Rangka Atap Baja Ringan Presisi & Terpercaya";
  const previewDescription =
    watchedDescriptionId ||
    "Didukung tim aplikator bersertifikat nasional dan material baja mutu tinggi bergaransi.";
  const previewLoadingTitle = watchedLoadingTitleId || "Structure";

  const onSubmit = async (data: CarouselFormData) => {
    setIsSubmitting(true);
    try {
      let res;
      if (isEdit && carouselId) {
        res = await updateCarousel(carouselId, data as CarouselInput);
      } else {
        res = await createCarousel(data as CarouselInput);
      }

      if (res.success) {
        toast.success(res.message || (isEdit ? "Banner berhasil diperbarui" : "Banner baru berhasil dibuat"));
        router.push("/admin/carousel");
        router.refresh();
      } else {
        toast.error("Gagal menyimpan data: " + res.message);
      }
    } catch (err: any) {
      toast.error("Terjadi kesalahan: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Top Header & Single Action Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E4EB]">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/carousel"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2E4EB] bg-white text-[#20449A] hover:bg-[#EEF2FA] transition-all shadow-xs"
            title="Kembali ke Daftar Carousel"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-[#EEF2FA] px-2 py-0.5 text-[11px] font-bold text-[#20449A]">
                <Layers className="h-3 w-3" /> Hero Carousel
              </span>
              <span className="text-zinc-300">•</span>
              <span className="text-xs font-semibold text-[#62636C]">
                {isEdit ? `Edit Slide #${carouselId}` : "Slide Baru"}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-[#1E1F24] tracking-tight">
              {isEdit ? "Edit Slide Hero Carousel" : "Tambah Slide Hero Carousel Baru"}
            </h1>
          </div>
        </div>

        {/* Action Buttons (Hanya 1 kali di header atas) */}
        <div className="flex items-center gap-3">
          <Link href="/admin/carousel">
            <Button variant="outline" size="default" type="button" className="font-semibold text-xs h-10">
              Batal
            </Button>
          </Link>
          <Button
            variant="orange"
            size="default"
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="font-semibold text-xs h-10 shadow-sm min-w-[140px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-1.5" />
                {isEdit ? "Simpan Perubahan" : "Terbitkan Slide"}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Grid: Form (Left 5 cols) & Sticky Live Preview (Right 7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start w-full">
        {/* ======================================================== */}
        {/* LEFT COLUMN: Modern Input Form                           */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 xl:col-span-5 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* 1. SECTION UPLOAD GAMBAR */}
            <div className="rounded-2xl border border-[#E2E4EB] bg-white p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F0F2F6]">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EEF2FA] text-[#20449A]">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1E1F24]">Gambar Background Hero</h3>
                    <p className="text-[11px] text-[#62636C]">
                      Resolusi ideal: 1920 × 1080 piksel (format WebP atau JPG landscape)
                    </p>
                  </div>
                </div>
              </div>

              <Controller
                control={control}
                name="imageUrl"
                render={({ field }) => (
                  <ImageUpload
                    value={field.value}
                    onChange={(url) => field.onChange(url)}
                    label="Unggah File Gambar Slide"
                    description="Tarik file gambar ke sini atau klik untuk memilih file (Maks. 5MB)"
                    error={errors.imageUrl?.message}
                    aspectRatio="wide"
                    folder="carousel"
                  />
                )}
              />
            </div>

            {/* 2. SECTION KONTEN TEKS */}
            <div className="rounded-2xl border border-[#E2E4EB] bg-white p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#F0F2F6]">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EEF2FA] text-[#20449A]">
                  <Type className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1E1F24]">Konten Teks Banner</h3>
                  <p className="text-[11px] text-[#62636C]">
                    Teks judul, subheader, deskripsi, dan label navigasi slide
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1E1F24] mb-1.5">
                    Subheader (Eyebrow Tag) <span className="text-[#F48902] font-normal">• Disertai Garis Oranye</span>
                  </label>
                  <input
                    type="text"
                    {...register("subheaderId")}
                    placeholder="Contoh: SOLUSI TERINTEGRASI atau REKAYASA STRUKTURAL"
                    className="w-full rounded-xl border border-[#E2E4EB] bg-white px-3.5 py-2.5 text-sm text-[#1E1F24] focus:border-[#20449A] focus:ring-3 focus:ring-[#20449A]/10 transition-all font-medium"
                  />
                  <p className="mt-1 text-[11px] text-[#62636C]">
                    Teks aksen kapital kecil di atas judul utama banner.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1E1F24] mb-1.5">
                    Judul Banner Utama (Headline) <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    {...register("titleId")}
                    placeholder="Contoh: Konstruksi Tangguh dengan Garansi Struktural 10 Tahun"
                    className="w-full rounded-xl border border-[#E2E4EB] bg-white px-3.5 py-2.5 text-sm font-semibold text-[#1E1F24] focus:border-[#20449A] focus:ring-3 focus:ring-[#20449A]/10 transition-all"
                  />
                  {errors.titleId && (
                    <p className="mt-1 text-xs text-red-500 font-medium">{errors.titleId.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1E1F24] mb-1.5">
                    Deskripsi Banner (Subtitle)
                  </label>
                  <textarea
                    rows={3}
                    {...register("descriptionId")}
                    placeholder="Contoh: Didukung tim aplikator bersertifikat nasional dan material baja Galvalum Zincalume G550 mutu tinggi anti-karat."
                    className="w-full rounded-xl border border-[#E2E4EB] bg-white px-3.5 py-2.5 text-sm text-[#1E1F24] focus:border-[#20449A] focus:ring-3 focus:ring-[#20449A]/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1E1F24] mb-1.5">
                    Nama Tab Bawah (Bottom Loading Tab)
                  </label>
                  <input
                    type="text"
                    {...register("loadingTitleId")}
                    placeholder="Contoh: Strength, Structure, atau Balance"
                    className="w-full rounded-xl border border-[#E2E4EB] bg-white px-3.5 py-2.5 text-sm text-[#1E1F24] focus:border-[#20449A] focus:ring-3 focus:ring-[#20449A]/10 transition-all font-medium"
                  />
                  <p className="mt-1 text-[11px] text-[#62636C]">
                    Label tombol rotasi slide di bagian bawah beranda dengan indikator progress bar.
                  </p>
                </div>
              </div>
            </div>

            {/* 3. SECTION PENGATURAN DISPLAY & TOMBOL */}
            <div className="rounded-2xl border border-[#E2E4EB] bg-white p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#F0F2F6]">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EEF2FA] text-[#20449A]">
                  <Sliders className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1E1F24]">Pengaturan Publikasi & Tombol CTA</h3>
                  <p className="text-[11px] text-[#62636C]">Urutan rotasi slider, status tayang, dan tautan aksi</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1E1F24] mb-1.5">
                    Nomor Urutan (Sort Order)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    {...register("sortOrder")}
                    className="w-full rounded-xl border border-[#E2E4EB] bg-white px-3.5 py-2.5 text-sm font-semibold text-[#1E1F24] focus:border-[#20449A] focus:ring-3 focus:ring-[#20449A]/10 transition-all"
                  />
                  <p className="mt-1 text-[11px] text-[#62636C]">Nomor lebih kecil tampil lebih awal</p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1E1F24] mb-1.5">
                    Status Tayang
                  </label>
                  <label className="flex items-center gap-3 p-2.5 rounded-xl border border-[#E2E4EB] bg-[#F9F9FB] cursor-pointer hover:bg-[#EEF2FA]/50 transition-colors">
                    <input
                      type="checkbox"
                      {...register("isActive")}
                      className="h-4.5 w-4.5 rounded border-[#E2E4EB] text-[#20449A] focus:ring-[#20449A] cursor-pointer"
                    />
                    <div>
                      <span className="text-xs font-bold text-[#1E1F24] block">
                        {watchedIsActive ? "Aktif di Beranda" : "Non-aktif (Disembunyikan)"}
                      </span>
                      <span className="text-[10px] text-[#62636C]">
                        {watchedIsActive ? "Slide muncul di rotasi slider beranda" : "Slide tidak ditampilkan ke publik"}
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1E1F24] mb-1.5">
                    Teks Tombol Aksi (CTA)
                  </label>
                  <input
                    type="text"
                    {...register("ctaTextId")}
                    placeholder="Konsultasi Proyek"
                    className="w-full rounded-xl border border-[#E2E4EB] bg-white px-3.5 py-2.5 text-sm text-[#1E1F24] focus:border-[#20449A] focus:ring-3 focus:ring-[#20449A]/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1E1F24] mb-1.5">
                    Tautan Tombol Aksi (CTA Link)
                  </label>
                  <input
                    type="text"
                    {...register("ctaLink")}
                    placeholder="/contact atau #contact"
                    className="w-full rounded-xl border border-[#E2E4EB] bg-white px-3.5 py-2.5 text-sm text-[#1E1F24] focus:border-[#20449A] focus:ring-3 focus:ring-[#20449A]/10 transition-all"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: Sticky Real-Time Live Landing Page Preview */}
        {/* ======================================================== */}
        <div className="lg:col-span-7 xl:col-span-7 sticky top-4 space-y-3">
          {/* Preview Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-[#1E1F24] text-white px-4 py-2.5 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2">
              <div className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold tracking-wide uppercase text-white/90">
                Live Landing Page Preview
              </span>
            </div>

            {/* Device Switcher */}
            <div className="flex items-center bg-black/40 rounded-lg p-0.5 border border-white/10">
              <button
                type="button"
                onClick={() => setPreviewDevice("desktop")}
                className={`p-1 rounded transition-colors ${
                  previewDevice === "desktop" ? "bg-[#20449A] text-white" : "text-white/60 hover:text-white"
                }`}
                title="Tampilan Desktop"
              >
                <Monitor className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice("tablet")}
                className={`p-1 rounded transition-colors ${
                  previewDevice === "tablet" ? "bg-[#20449A] text-white" : "text-white/60 hover:text-white"
                }`}
                title="Tampilan Tablet"
              >
                <Tablet className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice("mobile")}
                className={`p-1 rounded transition-colors ${
                  previewDevice === "mobile" ? "bg-[#20449A] text-white" : "text-white/60 hover:text-white"
                }`}
                title="Tampilan Mobile"
              >
                <Smartphone className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Browser Mockup Wrapper */}
          <div className="rounded-2xl border border-[#D0D5DD] bg-zinc-950 shadow-2xl overflow-hidden">
            {/* Browser Header Bar */}
            <div className="bg-[#14161F] px-4 py-2 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/80 inline-block" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80 inline-block" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80 inline-block" />
                <span className="text-[11px] text-white/40 font-mono ml-2">tjutruss.com</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    watchedIsActive
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-zinc-700 text-zinc-300"
                  }`}
                >
                  {watchedIsActive ? "Tayang Aktif" : "Slide Non-aktif"}
                </span>
                <span className="text-[10px] text-white/50 font-mono">
                  Order #{watchedSortOrder || 1}
                </span>
              </div>
            </div>

            {/* Inner Hero Section Box (Scales based on device) */}
            <div
              className={`transition-all duration-300 mx-auto ${
                previewDevice === "mobile"
                  ? "max-w-[340px] my-3 border border-white/15 rounded-xl overflow-hidden shadow-lg"
                  : previewDevice === "tablet"
                  ? "max-w-[560px] my-2 border border-white/10 rounded-lg overflow-hidden"
                  : "w-full"
              }`}
            >
              <div className="relative w-full aspect-16/10 sm:aspect-16/9 min-h-[400px] sm:min-h-[480px] lg:min-h-[520px] flex flex-col justify-between overflow-hidden bg-[#0c121e] p-6 sm:p-8 lg:p-10 select-none">
                {/* Background Image with Cinematic Dark Overlays */}
                {watchedImageUrl ? (
                  <Image
                    src={watchedImageUrl}
                    alt="Hero Preview"
                    fill
                    sizes="(max-width: 1024px) 100vw, 1000px"
                    className="object-cover object-center scale-102 transition-all duration-700 ease-out"
                    unoptimized={watchedImageUrl.startsWith("http://localhost") || watchedImageUrl.startsWith("/")}
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-950 flex items-center justify-center">
                    <p className="text-white/40 text-xs">Pilih atau unggah gambar background</p>
                  </div>
                )}

                {/* Cinematic Overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/60 pointer-events-none" />
                <div className="absolute inset-0 bg-[#0c121e]/45 pointer-events-none" />

                {/* Live Content Overlay */}
                <div className="relative z-10 flex flex-col justify-center h-full max-w-xl space-y-4 pt-4">
                  {/* Eyebrow / Subheader */}
                  <div className="flex items-center gap-2.5">
                    <span className="h-[3px] w-9 rounded-full bg-[#F48902] inline-block shrink-0 shadow-xs" />
                    <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-white/95 drop-shadow-sm">
                      {previewSubheader}
                    </span>
                  </div>

                  {/* Headline Title */}
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-extrabold text-white tracking-tight leading-[1.2] drop-shadow-md">
                    {previewTitle}
                  </h2>

                  {/* Description Subtitle */}
                  <p className="text-xs sm:text-sm md:text-base text-white/80 leading-relaxed font-normal line-clamp-3 max-w-md drop-shadow-sm">
                    {previewDescription}
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex flex-wrap items-center gap-2.5 pt-2">
                    <div className="inline-flex items-center gap-2 rounded-md bg-[#20449A] text-white px-4 py-2 font-bold text-xs shadow-md">
                      <MessageSquare className="h-3.5 w-3.5 fill-white/20" />
                      <span>{watchedCtaTextId || "Konsultasi Proyek"}</span>
                    </div>

                    <div className="inline-flex items-center justify-center rounded-md border border-white/70 bg-black/25 text-white px-4 py-2 font-semibold text-xs backdrop-blur-xs">
                      <span>Pelajari Sistem TJU</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Loading Tabs & Animated Progress Bar */}
                <div className="relative z-10 mt-6 pt-4 border-t border-white/10 flex items-end gap-6 sm:gap-8">
                  {/* Tab 1: Active (Current Slide Preview) */}
                  <div className="flex flex-col items-start text-left cursor-default">
                    <div className="relative h-[3px] w-16 sm:w-24 bg-white/20 rounded-full overflow-hidden mb-1.5">
                      <div className="h-full w-2/3 bg-[#F48902] rounded-full animate-pulse" />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
                      {previewLoadingTitle}
                    </span>
                  </div>

                  {/* Tab 2: Dummy Inactive */}
                  <div className="flex flex-col items-start text-left opacity-40">
                    <div className="h-[3px] w-12 sm:w-16 bg-white/20 rounded-full mb-1.5" />
                    <span className="text-xs sm:text-sm font-medium text-white">
                      Structure
                    </span>
                  </div>

                  {/* Tab 3: Dummy Inactive */}
                  <div className="flex flex-col items-start text-left opacity-40">
                    <div className="h-[3px] w-12 sm:w-16 bg-white/20 rounded-full mb-1.5" />
                    <span className="text-xs sm:text-sm font-medium text-white">
                      Balance
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
