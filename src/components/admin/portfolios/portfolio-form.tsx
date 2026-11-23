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
  MapPin,
  Eye,
  LayoutGrid,
  FileText,
  Sparkles,
  Building2,
  CheckCircle2,
  Video,
  Play,
  Upload,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/admin/image-upload";
import { GalleryUpload } from "@/components/admin/gallery-upload";
import { createPortfolio, updatePortfolio, PortfolioInput } from "@/actions/portfolios";
import { getPortfolioCategoriesAdmin } from "@/actions/portfolio-categories";
import { getVideoEmbedInfo } from "@/lib/video-helper";

const portfolioFormSchema = z.object({
  titleId: z.string().min(3, "Judul proyek wajib diisi minimal 3 karakter"),
  categoryPortfolioId: z.string().optional().nullable(),
  location: z.string().min(2, "Lokasi proyek wajib diisi (misal: Semarang, Jawa Tengah)"),
  coverImageUrl: z.string().min(1, "Cover gambar proyek wajib diunggah"),
  videoUrl: z.string().optional().nullable(),
  status: z.enum(["published", "draft"]).default("published"),
  galleryUrls: z.array(z.string()).default([]),
});

type PortfolioFormData = z.infer<typeof portfolioFormSchema>;

interface PortfolioFormProps {
  initialData?: any;
  portfolioId?: string;
  isEdit?: boolean;
}

export function PortfolioForm({ initialData, portfolioId, isEdit = false }: PortfolioFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [categories, setCategories] = React.useState<any[]>([]);
  const [previewMode, setPreviewMode] = React.useState<"card" | "detail">("card");
  const [activePreviewImage, setActivePreviewImage] = React.useState<string>("");

  const [isVideoUploading, setIsVideoUploading] = React.useState(false);
  const videoInputRef = React.useRef<HTMLInputElement>(null);

  const defaultValues: PortfolioFormData = {
    titleId: initialData?.titleI18n?.id || "",
    categoryPortfolioId: initialData?.categoryPortfolioId ? String(initialData.categoryPortfolioId) : "",
    location: initialData?.location || "Semarang, Jawa Tengah",
    coverImageUrl:
      initialData?.coverImageUrl ||
      "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80",
    videoUrl: initialData?.videoUrl || "",
    status: initialData?.status || "published",
    galleryUrls: initialData?.galleryUrls || [],
  };

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PortfolioFormData>({
    resolver: zodResolver(portfolioFormSchema) as any,
    defaultValues,
  });

  const handleUploadVideoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      toast.error("Berkas yang dipilih bukan format video yang didukung.");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      toast.error("Ukuran file video melebihi batas 50MB.");
      return;
    }

    setIsVideoUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "portfolio-videos");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setValue("videoUrl", data.url, { shouldValidate: true, shouldDirty: true });
        toast.success("Video berhasil diunggah");
      } else {
        toast.error(data.message || "Gagal mengunggah video");
      }
    } catch (err: any) {
      toast.error("Terjadi kesalahan saat mengunggah video: " + err.message);
    } finally {
      setIsVideoUploading(false);
      if (videoInputRef.current) videoInputRef.current.value = "";
    }
  };

  // Load portfolio categories for select dropdown
  React.useEffect(() => {
    async function loadCategories() {
      try {
        const res = await getPortfolioCategoriesAdmin();
        if (res.success && res.data) {
          setCategories(res.data);
        }
      } catch (e) {
        console.warn("Failed to load portfolio categories", e);
      }
    }
    loadCategories();
  }, []);

  // Real-time watched values for Live Preview
  const watchedTitle = watch("titleId");
  const watchedCategoryId = watch("categoryPortfolioId");
  const watchedLocation = watch("location");
  const watchedCoverImageUrl = watch("coverImageUrl");
  const watchedVideoUrl = watch("videoUrl");
  const watchedStatus = watch("status");
  const watchedGalleryUrls = watch("galleryUrls") || [];

  // Fallbacks for Live Preview
  const previewTitle = watchedTitle || "Instalasi Rangka Atap Baja Ringan Gudang Presisi";
  const previewLocation = watchedLocation || "Semarang, Jawa Tengah";
  const previewCover =
    watchedCoverImageUrl ||
    "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80";

  const selectedCategoryObj = categories.find((c) => String(c.id) === String(watchedCategoryId));
  const previewCategoryName =
    selectedCategoryObj?.nameI18n?.id || initialData?.categoryName || "KOMERSIAL";

  // Sync active detail preview image if cover changes
  React.useEffect(() => {
    setActivePreviewImage(previewCover);
  }, [previewCover]);

  const allPreviewImages = React.useMemo(() => {
    const list: string[] = [];
    if (previewCover) list.push(previewCover);
    watchedGalleryUrls.forEach((url) => {
      if (url && !list.includes(url)) list.push(url);
    });
    return list;
  }, [previewCover, watchedGalleryUrls]);

  const onSubmit = async (data: PortfolioFormData) => {
    setIsSubmitting(true);
    try {
      let res;
      if (isEdit && portfolioId) {
        res = await updatePortfolio(portfolioId, data as PortfolioInput);
      } else {
        res = await createPortfolio(data as PortfolioInput);
      }

      if (res.success) {
        toast.success(res.message || "Portofolio berhasil disimpan");
        router.push("/admin/portfolios");
        router.refresh();
      } else {
        toast.error("Gagal menyimpan: " + res.message);
      }
    } catch (err: any) {
      toast.error("Terjadi kesalahan: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1700px] mx-auto pb-12">
      {/* Top Sticky Header */}
      <div className="sticky top-0 z-30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#E2E4EB] bg-white/95 px-6 py-4 shadow-xs backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/portfolios"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2E4EB] bg-[#F9F9FB] text-[#62636C] hover:bg-[#EEF2FA] hover:text-[#20449A] transition-colors"
            title="Kembali ke Daftar Portofolio"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-[#1E1F24]">
                {isEdit ? "Edit Portofolio Proyek" : "Tambah Portofolio Proyek"}
              </h1>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                  watchedStatus === "published"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}
              >
                {watchedStatus === "published" ? "Siap Terbit" : "Draf"}
              </span>
            </div>
            <p className="text-xs text-[#62636C]">
              Isi data dalam Bahasa Indonesia. Sistem akan menerjemahkan ke EN & ZH secara otomatis.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/portfolios")}
            disabled={isSubmitting}
            className="font-medium"
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="orange"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="font-bold shadow-xs px-6"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {isEdit ? "Simpan Perubahan" : "Terbitkan Proyek"}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Two-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Controls (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Card 1: Informasi Proyek */}
            <div className="rounded-2xl border border-[#E2E4EB] bg-white p-6 shadow-xs space-y-5">
              <div className="flex items-center gap-2 border-b border-[#E2E4EB] pb-3">
                <Building2 className="h-5 w-5 text-[#20449A]" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#1E1F24]">
                  Informasi Utama Proyek
                </h2>
              </div>

              {/* Title Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E1F24]">
                  Judul Proyek (Bahasa Indonesia) *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Gedung Olahraga & Training Center UNNES"
                  {...register("titleId")}
                  className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-[#1E1F24] focus:outline-none focus:ring-2 focus:ring-[#20449A] ${
                    errors.titleId ? "border-red-500" : "border-[#E2E4EB]"
                  }`}
                />
                {errors.titleId && (
                  <p className="text-xs text-red-500">{errors.titleId.message}</p>
                )}
              </div>

              {/* Category & Location Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Category Dropdown */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E1F24]">
                    Kategori Portofolio *
                  </label>
                  <select
                    {...register("categoryPortfolioId")}
                    className="w-full rounded-xl border border-[#E2E4EB] bg-white px-3.5 py-2.5 text-sm text-[#1E1F24] focus:outline-none focus:ring-2 focus:ring-[#20449A]"
                  >
                    {categories.length > 0 ? (
                      categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.nameI18n?.id || "Kategori"}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value={1}>Komersial</option>
                        <option value={2}>Industrial</option>
                        <option value={3}>Residensial</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Location */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E1F24]">
                    Lokasi Proyek *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Semarang, Jawa Tengah"
                      {...register("location")}
                      className={`w-full rounded-xl border bg-white pl-10 pr-3.5 py-2.5 text-sm text-[#1E1F24] focus:outline-none focus:ring-2 focus:ring-[#20449A] ${
                        errors.location ? "border-red-500" : "border-[#E2E4EB]"
                      }`}
                    />
                  </div>
                  {errors.location && (
                    <p className="text-xs text-red-500">{errors.location.message}</p>
                  )}
                </div>
              </div>

              {/* Publication Status */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E1F24]">
                  Status Publikasi
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      watchedStatus === "published"
                        ? "border-[#20449A] bg-[#EEF2FA] text-[#20449A] font-bold"
                        : "border-[#E2E4EB] bg-white text-slate-600 hover:bg-[#F9F9FB]"
                    }`}
                  >
                    <input
                      type="radio"
                      value="published"
                      {...register("status")}
                      className="sr-only"
                    />
                    <div className="h-4 w-4 rounded-full border border-current flex items-center justify-center">
                      {watchedStatus === "published" && (
                        <div className="h-2 w-2 rounded-full bg-current" />
                      )}
                    </div>
                    <span className="text-sm">Publikasikan Langsung</span>
                  </label>

                  <label
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      watchedStatus === "draft"
                        ? "border-[#20449A] bg-[#EEF2FA] text-[#20449A] font-bold"
                        : "border-[#E2E4EB] bg-white text-slate-600 hover:bg-[#F9F9FB]"
                    }`}
                  >
                    <input
                      type="radio"
                      value="draft"
                      {...register("status")}
                      className="sr-only"
                    />
                    <div className="h-4 w-4 rounded-full border border-current flex items-center justify-center">
                      {watchedStatus === "draft" && (
                        <div className="h-2 w-2 rounded-full bg-current" />
                      )}
                    </div>
                    <span className="text-sm">Simpan Sebagai Draf</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Card 2: Cover Gambar Utama */}
            <div className="rounded-2xl border border-[#E2E4EB] bg-white p-6 shadow-xs space-y-4">
              <Controller
                control={control}
                name="coverImageUrl"
                render={({ field }) => (
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    label="Cover Gambar Utama Proyek *"
                    description="Foto utama resolusi tinggi (1200x800 px disarankan) yang tampil di kartu katalog dan header detail."
                    error={errors.coverImageUrl?.message}
                    aspectRatio="video"
                    folder="portfolios"
                  />
                )}
              />
            </div>

            {/* Card 3: Sematan Video Proyek (Opsional) */}
            <div className="rounded-2xl border border-[#E2E4EB] bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-bold text-[#1E1F24]">
                    Sematkan Video Dokumentasi Proyek (Opsional)
                  </label>
                  <p className="text-xs text-[#62636C] mt-0.5">
                    Mendukung tautan video YouTube, Vimeo, direct MP4 URL, atau unggah langsung file video (Maks. 50MB).
                  </p>
                </div>
                {watchedVideoUrl && (
                  <button
                    type="button"
                    onClick={() => setValue("videoUrl", "", { shouldDirty: true })}
                    className="inline-flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-semibold cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Hapus Video</span>
                  </button>
                )}
              </div>

              {/* Video URL Input & Upload Action */}
              <div className="space-y-3">
                <div className="rounded-xl border border-blue-200/80 bg-blue-50/70 p-3 text-xs text-blue-900 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-[#20449A]">
                    <Sparkles className="h-3.5 w-3.5 text-[#F48902]" />
                    <span>Panduan Best Practice Video:</span>
                  </div>
                  <div className="text-[11px] text-slate-700 space-y-0.5">
                    <p>• <strong>Rekomendasi Utama:</strong> Unggah video ke <strong>YouTube / Vimeo</strong> lalu tempel tautannya di bawah. Video berputar instan via CDN tanpa membebani hosting server.</p>
                    <p>• <strong>Jika Mengunggah File Langsung:</strong> Format <strong>MP4</strong>, resolusi 1080p, durasi ringkas 30–90 detik (Maks. 50MB).</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="relative flex-1">
                    <Video className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Tempel link YouTube/Vimeo (e.g. https://www.youtube.com/watch?v=...) atau URL MP4"
                      {...register("videoUrl")}
                      className="w-full rounded-xl border border-[#E2E4EB] bg-white pl-10 pr-3.5 py-2.5 text-sm text-[#1E1F24] focus:outline-none focus:ring-2 focus:ring-[#20449A]"
                    />
                  </div>
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime,video/ogg"
                    onChange={handleUploadVideoFile}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => videoInputRef.current?.click()}
                    disabled={isVideoUploading}
                    className="rounded-xl border-[#E2E4EB] text-slate-700 hover:bg-[#F9F9FB] shrink-0"
                  >
                    {isVideoUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin text-[#20449A]" />
                        <span>Mengunggah...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2 text-[#20449A]" />
                        <span>Unggah File Video</span>
                      </>
                    )}
                  </Button>
                </div>

                {/* Live Embedded Video Preview in Form */}
                {watchedVideoUrl && (() => {
                  const info = getVideoEmbedInfo(watchedVideoUrl);
                  return (
                    <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-200 aspect-video w-full max-w-xl mx-auto shadow-sm">
                      {info.type === "youtube" || info.type === "vimeo" ? (
                        <iframe
                          src={info.embedUrl}
                          title="Pratinjau Video Proyek"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full border-0"
                        />
                      ) : (
                        <video
                          src={info.embedUrl}
                          controls
                          className="w-full h-full object-contain"
                        />
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Card 4: Foto Galeri Tambahan */}
            <div className="rounded-2xl border border-[#E2E4EB] bg-white p-6 shadow-xs space-y-4">
              <Controller
                control={control}
                name="galleryUrls"
                render={({ field }) => (
                  <GalleryUpload
                    value={field.value || []}
                    onChange={field.onChange}
                    label="Foto Galeri Tambahan Proyek"
                    description="Unggah foto detail struktur atap, tampak interior, sudut kuda-kuda, dan tahap konstruksi (Maks. 12 foto)."
                    folder="portfolio-gallery"
                  />
                )}
              />
            </div>
          </form>
        </div>

        {/* Right Column: Sticky Live Preview Panel (5 cols on lg) */}
        <div className="lg:col-span-5 sticky top-24 space-y-4">
          <div className="rounded-2xl border border-[#E2E4EB] bg-white shadow-sm overflow-hidden">
            {/* Preview Toolbar */}
            <div className="flex items-center justify-between border-b border-[#E2E4EB] px-5 py-3.5 bg-[#F9F9FB]">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1E1F24]">
                <Eye className="h-4 w-4 text-[#20449A]" />
                <span>Live Pratinjau Tampilan</span>
              </div>

              {/* 2 Preview Modes Switcher */}
              <div className="flex rounded-lg bg-[#EAECEF] p-1 border border-[#E2E4EB]">
                <button
                  type="button"
                  onClick={() => setPreviewMode("card")}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                    previewMode === "card"
                      ? "bg-white text-[#20449A] shadow-xs"
                      : "text-[#62636C] hover:text-[#1E1F24]"
                  }`}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                  <span>Preview Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode("detail")}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                    previewMode === "detail"
                      ? "bg-white text-[#20449A] shadow-xs"
                      : "text-[#62636C] hover:text-[#1E1F24]"
                  }`}
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>Preview Detail</span>
                </button>
              </div>
            </div>

            {/* Preview Viewport Container */}
            <div className="p-5 bg-slate-50 min-h-[460px] flex items-center justify-center">
              {/* MODE 1: PREVIEW CARD (Landing Page & Grid Exact Match) */}
              {previewMode === "card" && (
                <div className="w-full max-w-md mx-auto">
                  <div className="text-center mb-3">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Tampilan Kartu di Halaman Portofolio
                    </span>
                  </div>

                  <div className="group relative overflow-hidden rounded-2xl bg-slate-900 shadow-xl h-[340px] sm:h-[380px] w-full block transition-transform">
                    {/* Cover Image */}
                    <Image
                      src={previewCover}
                      alt={previewTitle}
                      fill
                      sizes="400px"
                      className="object-cover object-center"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

                    {/* Content Overlay di Bawah */}
                    <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col items-start gap-2 z-10">
                      {/* Category Badge Orange */}
                      <span className="inline-block rounded-md bg-[#F48902] px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-xs">
                        {previewCategoryName}
                      </span>

                      {/* Judul Proyek */}
                      <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight line-clamp-2 leading-snug">
                        {previewTitle}
                      </h3>

                      {/* Location Pin */}
                      <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-medium pt-1">
                        <MapPin className="h-3.5 w-3.5 text-[#F48902] shrink-0" />
                        <span className="line-clamp-1">{previewLocation}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* MODE 2: PREVIEW DETAIL (Exact Match Single Portfolio Page) */}
              {previewMode === "detail" && (
                <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-md p-4 sm:p-6 space-y-4">
                  {/* Breadcrumb Centered */}
                  <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-center">
                    <span className="text-[#F48902]">Home</span>
                    <span className="text-slate-300">&gt;</span>
                    <span className="text-[#F48902]">Portofolio</span>
                    <span className="text-slate-300">&gt;</span>
                    <span className="text-slate-500 truncate max-w-[140px]">
                      {previewTitle}
                    </span>
                  </div>

                  {/* Title & Location Centered */}
                  <div className="text-center space-y-1.5">
                    <span className="inline-block rounded-md bg-[#20449A] px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                      {previewCategoryName}
                    </span>
                    <h2 className="text-lg sm:text-xl font-extrabold italic text-[#1E1F24] leading-tight">
                      {previewTitle}
                    </h2>
                    <div className="flex items-center justify-center gap-1 text-xs text-slate-500 font-medium">
                      <MapPin className="h-3.5 w-3.5 text-[#F48902]" />
                      <span>{previewLocation}</span>
                    </div>
                  </div>

                  {/* Main Active Media Box (Image or Video) */}
                  <div className="relative w-full h-[220px] sm:h-[260px] rounded-xl overflow-hidden bg-slate-900 shadow-md">
                    {activePreviewImage === "video" && watchedVideoUrl ? (
                      (() => {
                        const info = getVideoEmbedInfo(watchedVideoUrl);
                        return info.type === "youtube" || info.type === "vimeo" ? (
                          <iframe
                            src={info.embedUrl}
                            title="Preview Video"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full border-0"
                          />
                        ) : (
                          <video
                            src={info.embedUrl}
                            controls
                            className="w-full h-full object-contain"
                          />
                        );
                      })()
                    ) : (
                      <Image
                        src={activePreviewImage || previewCover}
                        alt={previewTitle}
                        fill
                        sizes="500px"
                        className="object-cover object-center"
                      />
                    )}
                  </div>

                  {/* Interactive Thumbnails Row */}
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 text-center">
                      Media Dokumentasi ({allPreviewImages.length + (watchedVideoUrl ? 1 : 0)})
                    </p>
                    <div className="flex items-center justify-center gap-2 overflow-x-auto py-1">
                      {/* Video Thumbnail Button if Video Exists */}
                      {watchedVideoUrl && (
                        <button
                          type="button"
                          onClick={() => setActivePreviewImage("video")}
                          className={`relative h-12 w-12 sm:h-14 sm:w-14 rounded-lg overflow-hidden shrink-0 border flex flex-col items-center justify-center bg-slate-900 text-white transition-all cursor-pointer ${
                            activePreviewImage === "video"
                              ? "ring-2 ring-[#F48902] border-transparent scale-105"
                              : "opacity-80 hover:opacity-100 border-slate-700"
                          }`}
                          title="Putar Video Dokumentasi"
                        >
                          <Play className="h-4 w-4 text-[#F48902] fill-[#F48902]" />
                          <span className="text-[9px] font-bold mt-0.5">Video</span>
                        </button>
                      )}

                      {allPreviewImages.slice(0, 5).map((imgUrl, idx) => {
                        const isActive = activePreviewImage !== "video" && (activePreviewImage || previewCover) === imgUrl;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setActivePreviewImage(imgUrl)}
                            className={`relative h-12 w-12 sm:h-14 sm:w-14 rounded-lg overflow-hidden shrink-0 border transition-all cursor-pointer ${
                              isActive
                                ? "ring-2 ring-[#20449A] border-transparent scale-105"
                                : "opacity-70 hover:opacity-100 border-slate-200"
                            }`}
                          >
                            <Image
                              src={imgUrl}
                              alt={`Thumb ${idx + 1}`}
                              fill
                              sizes="56px"
                              className="object-cover object-center"
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
