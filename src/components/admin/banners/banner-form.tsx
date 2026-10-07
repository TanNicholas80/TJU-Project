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
  Monitor,
  Tablet,
  Smartphone,
  Bookmark,
  ChevronRight,
  Compass,
  FileText,
  Building2,
  Phone,
  Layers,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/admin/image-upload";
import { createBanner, updateBanner, BannerInput } from "@/actions/banners";

const PAGE_PRESETS = [
  {
    slug: "about-us",
    name: "Tentang Kami (About Us)",
    defaultTitle: "About Us",
    defaultBreadcrumb: "About US",
    icon: Building2,
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    slug: "blog",
    name: "Blog & Artikel",
    defaultTitle: "Blog & Artikel",
    defaultBreadcrumb: "Blog",
    icon: FileText,
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
  },
  {
    slug: "portofolio",
    name: "Portofolio Proyek",
    defaultTitle: "Rekam Jejak TJU TRUSS",
    defaultBreadcrumb: "Portofolio",
    icon: Layers,
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    slug: "contact",
    name: "Hubungi Kami (Contact Us)",
    defaultTitle: "Hubungi Kami",
    defaultBreadcrumb: "Kontak",
    icon: Phone,
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
  },
];

const bannerFormSchema = z.object({
  pageSlug: z.string().min(1, "Slug / key halaman wajib diisi"),
  titleId: z.string().min(2, "Judul banner wajib diisi minimal 2 karakter"),
  breadcrumbId: z.string().min(1, "Teks breadcrumb halaman wajib diisi"),
  backgroundImageUrl: z.string().min(1, "Gambar background banner wajib diunggah"),
});

type BannerFormData = z.infer<typeof bannerFormSchema>;

interface BannerFormProps {
  initialData?: any;
  bannerId?: string;
  isEdit?: boolean;
}

export function BannerForm({ initialData, bannerId, isEdit = false }: BannerFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [previewDevice, setPreviewDevice] = React.useState<"desktop" | "tablet" | "mobile">("desktop");
  const [isCustomSlug, setIsCustomSlug] = React.useState(false);

  // Normalisasi breadcrumb awal (hapus prefix 'Home > ' jika tersimpan lengkap di DB)
  const rawBreadcrumb =
    initialData?.breadcrumbI18n?.id ||
    initialData?.titleI18n?.id ||
    "About US";
  const cleanInitialBreadcrumb = rawBreadcrumb.replace(/^Home\s*>\s*/i, "").trim();

  const initialSlug = initialData?.pageSlug || "about-us";
  const isPresetSlug = PAGE_PRESETS.some((p) => p.slug === initialSlug);

  const defaultValues: BannerFormData = {
    pageSlug: initialSlug,
    titleId: initialData?.titleI18n?.id || "About Us",
    breadcrumbId: cleanInitialBreadcrumb || "About US",
    backgroundImageUrl: initialData?.backgroundImageUrl || "/images/core_background.png",
  };

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BannerFormData>({
    resolver: zodResolver(bannerFormSchema) as any,
    defaultValues,
  });

  React.useEffect(() => {
    if (!isPresetSlug && initialSlug) {
      setIsCustomSlug(true);
    }
  }, [isPresetSlug, initialSlug]);

  // Watch values for real-time live preview
  const watchedPageSlug = watch("pageSlug");
  const watchedTitleId = watch("titleId");
  const watchedBreadcrumbId = watch("breadcrumbId");
  const watchedBackgroundImageUrl = watch("backgroundImageUrl");

  // Format live preview values
  const previewTitle = watchedTitleId || "Judul Banner Halaman";
  const previewBreadcrumbText = (watchedBreadcrumbId || "Halaman").replace(/^Home\s*>\s*/i, "").trim();

  const handleSelectPreset = (preset: typeof PAGE_PRESETS[0]) => {
    setIsCustomSlug(false);
    setValue("pageSlug", preset.slug, { shouldValidate: true });
    // Berikan saran judul dan breadcrumb jika belum diubah
    if (!watchedTitleId || watchedTitleId === "Judul Banner Halaman" || PAGE_PRESETS.some(p => p.defaultTitle === watchedTitleId)) {
      setValue("titleId", preset.defaultTitle, { shouldValidate: true });
    }
    if (!watchedBreadcrumbId || PAGE_PRESETS.some(p => p.defaultBreadcrumb === watchedBreadcrumbId)) {
      setValue("breadcrumbId", preset.defaultBreadcrumb, { shouldValidate: true });
    }
  };

  const onSubmit = async (data: BannerFormData) => {
    setIsSubmitting(true);
    try {
      // Simpan breadcrumb dalam format standar "Home > [Nama Halaman]"
      const cleanLabel = data.breadcrumbId.replace(/^Home\s*>\s*/i, "").trim();
      const payload: BannerInput = {
        pageSlug: data.pageSlug.trim().toLowerCase(),
        titleId: data.titleId.trim(),
        breadcrumbId: `Home > ${cleanLabel}`,
        backgroundImageUrl: data.backgroundImageUrl,
      };

      let res;
      if (isEdit && bannerId) {
        res = await updateBanner(bannerId, payload);
      } else {
        res = await createBanner(payload);
      }

      if (res.success) {
        toast.success(res.message || (isEdit ? "Banner berhasil diperbarui" : "Banner baru berhasil dibuat"));
        router.push("/admin/banners");
        router.refresh();
      } else {
        toast.error("Gagal menyimpan banner: " + res.message);
      }
    } catch (err: any) {
      toast.error("Terjadi kesalahan: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Top Header & Navigation (Single Action Buttons) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E4EB]">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/banners"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2E4EB] bg-white text-[#20449A] hover:bg-[#EEF2FA] transition-all shadow-xs"
            title="Kembali ke Daftar Banner Halaman"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-[#EEF2FA] px-2 py-0.5 text-[11px] font-bold text-[#20449A]">
                <Bookmark className="h-3 w-3" /> Banner Halaman
              </span>
              <span className="text-zinc-300">•</span>
              <span className="text-xs font-semibold text-[#62636C]">
                {isEdit ? `Edit Banner #${bannerId}` : "Tambah Banner Baru"}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-[#1E1F24] tracking-tight">
              {isEdit ? "Edit Banner Halaman" : "Tambah Banner Halaman Baru"}
            </h1>
          </div>
        </div>

        {/* Action Buttons (Hanya 1 kali di header atas) */}
        <div className="flex items-center gap-3">
          <Link href="/admin/banners">
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
                {isEdit ? "Simpan Perubahan" : "Terbitkan Banner"}
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
            {/* 1. SECTION TARGET HALAMAN (PAGE KEY / SLUG) */}
            <div className="rounded-2xl border border-[#E2E4EB] bg-white p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#F0F2F6]">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EEF2FA] text-[#20449A]">
                  <Compass className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1E1F24]">Target Halaman Banner</h3>
                  <p className="text-[11px] text-[#62636C]">
                    Tentukan halaman website yang akan menggunakan banner ini
                  </p>
                </div>
              </div>

              {/* Preset Cards Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1E1F24] mb-2">
                  Pilih Halaman <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {PAGE_PRESETS.map((preset) => {
                    const isSelected = !isCustomSlug && watchedPageSlug === preset.slug;
                    const Icon = preset.icon;
                    return (
                      <button
                        key={preset.slug}
                        type="button"
                        onClick={() => handleSelectPreset(preset)}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? "border-[#20449A] bg-[#EEF2FA]/70 ring-2 ring-[#20449A]/20 shadow-xs"
                            : "border-[#E2E4EB] bg-white hover:border-[#20449A]/50 hover:bg-[#F9F9FB]"
                        }`}
                      >
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                            isSelected ? "bg-[#20449A] text-white" : "bg-[#F0F2F6] text-[#62636C]"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-[#1E1F24] truncate">{preset.name}</p>
                          <span className="text-[10px] text-[#62636C] font-mono block">/{preset.slug}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Slug Toggle & Input */}
              <div className="pt-1">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-[#62636C]">Ingin gunakan halaman kustom lainnya?</span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomSlug(!isCustomSlug);
                      if (!isCustomSlug) setValue("pageSlug", "");
                    }}
                    className="text-xs text-[#20449A] font-semibold hover:underline cursor-pointer"
                  >
                    {isCustomSlug ? "Gunakan Halaman Preset" : "Input Slug Kustom"}
                  </button>
                </div>

                {isCustomSlug && (
                  <div className="space-y-1 mt-2 animate-in fade-in-50 duration-200">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-400">
                        /
                      </span>
                      <input
                        type="text"
                        {...register("pageSlug")}
                        placeholder="contoh: layanan, karir, faq"
                        className="w-full rounded-xl border border-[#E2E4EB] bg-white pl-6 pr-3.5 py-2 text-xs font-mono text-[#1E1F24] focus:border-[#20449A] focus:ring-3 focus:ring-[#20449A]/10"
                      />
                    </div>
                    {errors.pageSlug && (
                      <p className="text-xs text-red-500 font-medium">{errors.pageSlug.message}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* 2. SECTION GAMBAR BACKGROUND */}
            <div className="rounded-2xl border border-[#E2E4EB] bg-white p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#F0F2F6]">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EEF2FA] text-[#20449A]">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1E1F24]">Gambar Background Banner</h3>
                  <p className="text-[11px] text-[#62636C]">
                    Resolusi ideal: 1920 × 600 piksel (format WebP atau JPG landscape)
                  </p>
                </div>
              </div>

              <Controller
                control={control}
                name="backgroundImageUrl"
                render={({ field }) => (
                  <ImageUpload
                    value={field.value}
                    onChange={(url) => field.onChange(url)}
                    label="Unggah Background Banner"
                    description="Tarik file gambar ke sini atau klik untuk memilih file (Maks. 5MB)"
                    error={errors.backgroundImageUrl?.message}
                    aspectRatio="wide"
                    folder="banners"
                  />
                )}
              />
            </div>

            {/* 3. SECTION KONTEN TEKS & BREADCRUMB */}
            <div className="rounded-2xl border border-[#E2E4EB] bg-white p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#F0F2F6]">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EEF2FA] text-[#20449A]">
                  <Bookmark className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1E1F24]">Konten Judul & Navigasi Breadcrumb</h3>
                  <p className="text-[11px] text-[#62636C]">
                    Teks yang tampil di tengah banner halaman publik
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1E1F24] mb-1.5">
                    Judul Banner Utama (Headline) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("titleId")}
                    placeholder="Contoh: About Us atau Rekam Jejak TJU TRUSS"
                    className="w-full rounded-xl border border-[#E2E4EB] bg-white px-3.5 py-2.5 text-sm font-semibold text-[#1E1F24] focus:border-[#20449A] focus:ring-3 focus:ring-[#20449A]/10 transition-all"
                  />
                  {errors.titleId && (
                    <p className="mt-1 text-xs text-red-500 font-medium">{errors.titleId.message}</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#1E1F24]">
                      Teks Breadcrumb (Halaman Aktif) <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[11px] text-[#62636C] font-mono">
                      Format: Home &gt; [Teks]
                    </span>
                  </div>

                  <div className="relative flex items-center">
                    <div className="absolute left-3 flex items-center gap-1.5 text-xs font-semibold text-[#F48902] pointer-events-none select-none">
                      <span>Home</span>
                      <ChevronRight className="h-3.5 w-3.5 text-zinc-400" />
                    </div>
                    <input
                      type="text"
                      {...register("breadcrumbId")}
                      placeholder="Contoh: About US atau Portofolio"
                      className="w-full rounded-xl border border-[#E2E4EB] bg-white pl-20 pr-3.5 py-2.5 text-sm font-semibold text-[#1E1F24] focus:border-[#20449A] focus:ring-3 focus:ring-[#20449A]/10 transition-all"
                    />
                  </div>
                  {errors.breadcrumbId && (
                    <p className="mt-1 text-xs text-red-500 font-medium">{errors.breadcrumbId.message}</p>
                  )}
                  <p className="mt-1 text-[11px] text-[#62636C]">
                    Tautan <span className="text-[#F48902] font-semibold">Home</span> otomatis terhubung ke halaman beranda (/). Anda cukup mengisi nama label halaman ini.
                  </p>
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
                <span className="text-[11px] text-white/40 font-mono ml-2">
                  tjutruss.com/{watchedPageSlug || "about-us"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-mono">
                  Target: /{watchedPageSlug || "about-us"}
                </span>
              </div>
            </div>

            {/* Inner Banner Section Box (Scales based on device) */}
            <div
              className={`transition-all duration-300 mx-auto ${
                previewDevice === "mobile"
                  ? "max-w-[340px] my-3 border border-white/15 rounded-xl overflow-hidden shadow-lg"
                  : previewDevice === "tablet"
                  ? "max-w-[560px] my-2 border border-white/10 rounded-lg overflow-hidden"
                  : "w-full"
              }`}
            >
              <div className="relative w-full h-[260px] sm:h-[300px] md:h-[340px] flex items-center justify-center overflow-hidden bg-slate-950 select-none">
                {/* Background Image with Vignette Overlay (Persis PageHeroBanner) */}
                {watchedBackgroundImageUrl ? (
                  <Image
                    src={watchedBackgroundImageUrl}
                    alt={previewTitle}
                    fill
                    sizes="(max-width: 1024px) 100vw, 1000px"
                    className="object-cover object-center filter grayscale brightness-[0.4] contrast-125 scale-102 transition-all duration-500"
                    unoptimized={
                      watchedBackgroundImageUrl.startsWith("http://localhost") ||
                      watchedBackgroundImageUrl.startsWith("/")
                    }
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-950 flex items-center justify-center">
                    <p className="text-white/40 text-xs">Pilih atau unggah gambar background</p>
                  </div>
                )}

                {/* Dark Vignette Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/50 to-black/80 pointer-events-none" />

                {/* Content Container: Headline Title & Breadcrumb */}
                <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 text-center space-y-3">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
                    {previewTitle}
                  </h2>

                  {/* Breadcrumb Navigation: Home (Orange Link) > Page Label (White) */}
                  <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold tracking-wide">
                    <Link
                      href="/"
                      target="_blank"
                      className="text-[#F48902] hover:text-[#FFA633] hover:underline transition-colors flex items-center gap-1 cursor-pointer"
                      title="Klik untuk membuka beranda publik"
                    >
                      Home
                    </Link>
                    <ChevronRight className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                    <span className="text-white drop-shadow-sm font-semibold">
                      {previewBreadcrumbText}
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
