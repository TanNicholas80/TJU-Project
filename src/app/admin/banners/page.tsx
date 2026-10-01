"use client";

import * as React from "react";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  Bookmark,
  Loader2,
  Globe,
  Save,
  Eye,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/admin/image-upload";
import { getBannerBySlug, saveBanner, BannerInput } from "@/actions/banners";

const bannerFormSchema = z.object({
  pageSlug: z.string().min(1, "Slug halaman wajib diisi"),
  titleId: z.string().min(2, "Judul banner (Bahasa Indonesia) wajib diisi"),
  titleEn: z.string().optional(),
  titleZh: z.string().optional(),
  breadcrumbId: z.string().optional(),
  breadcrumbEn: z.string().optional(),
  breadcrumbZh: z.string().optional(),
  backgroundImageUrl: z.string().min(1, "URL Background banner wajib diisi"),
});

type BannerFormData = z.infer<typeof bannerFormSchema>;

export default function AdminBannersPage() {
  const [activeTab, setActiveTab] = React.useState<"id" | "en" | "zh">("id");
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<BannerFormData>({
    resolver: zodResolver(bannerFormSchema) as any,
    defaultValues: {
      pageSlug: "about-us",
      titleId: "",
      titleEn: "",
      titleZh: "",
      breadcrumbId: "Home > About US",
      breadcrumbEn: "Home > About US",
      breadcrumbZh: "首页 > 关于我们",
      backgroundImageUrl: "",
    },
  });

  const watchedValues = watch();

  const loadData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getBannerBySlug("about-us");
      if (res.success && res.data) {
        const item = res.data;
        reset({
          pageSlug: item.pageSlug || "about-us",
          titleId: item.titleI18n?.id || "",
          titleEn: item.titleI18n?.en || "",
          titleZh: item.titleI18n?.zh || "",
          breadcrumbId: item.breadcrumbI18n?.id || "Home > About US",
          breadcrumbEn: item.breadcrumbI18n?.en || "Home > About US",
          breadcrumbZh: item.breadcrumbI18n?.zh || "首页 > 关于我们",
          backgroundImageUrl: item.backgroundImageUrl || "",
        });
      }
    } catch {
      toast.error("Gagal memuat banner");
    } finally {
      setIsLoading(false);
    }
  }, [reset]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const onSubmit = async (data: BannerFormData) => {
    setIsSubmitting(true);
    try {
      const res = await saveBanner(data as BannerInput);
      if (res.success) {
        toast.success(res.message || "Banner About Us berhasil disimpan!");
      } else {
        toast.error("Gagal: " + res.message);
      }
    } catch (err: any) {
      toast.error("Terjadi kesalahan: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Preview computed title & breadcrumb based on active tab
  const previewTitle =
    activeTab === "en"
      ? watchedValues.titleEn || watchedValues.titleId || "About Us"
      : activeTab === "zh"
      ? watchedValues.titleZh || watchedValues.titleId || "关于我们"
      : watchedValues.titleId || "About Us";

  const previewBreadcrumb =
    activeTab === "en"
      ? watchedValues.breadcrumbEn || "Home > About US"
      : activeTab === "zh"
      ? watchedValues.breadcrumbZh || "首页 > 关于我们"
      : watchedValues.breadcrumbId || "Home > About US";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Bookmark className="h-6 w-6 text-[#20449A]" />
            <h2 className="text-2xl font-extrabold text-[#1E1F24]">
              Banner Halaman: About Us
            </h2>
          </div>
          <p className="text-sm text-[#62636C] mt-1">
            Kelola judul banner header, breadcrumb navigasi, dan gambar background untuk halaman publik Tentang Kami.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="orange"
            size="default"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting || isLoading}
            className="font-bold shadow-sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Simpan Perubahan
              </>
            )}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-72 items-center justify-center rounded-2xl border border-[#E2E4EB] bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-[#20449A]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Form Fields (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E2E4EB] p-6 sm:p-8 shadow-xs space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Language Switcher Tabs */}
              <div className="flex items-center justify-between border-b border-[#E2E4EB] pb-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#62636C]">
                  <Globe className="h-4 w-4 text-[#20449A]" />
                  <span>Bahasa Teks Konten:</span>
                </div>
                <div className="flex rounded-lg bg-[#F9F9FB] p-1 border border-[#E2E4EB]">
                  <button
                    type="button"
                    onClick={() => setActiveTab("id")}
                    className={`rounded-md px-3 py-1 text-xs font-bold transition-all ${
                      activeTab === "id"
                        ? "bg-[#20449A] text-white shadow-xs"
                        : "text-[#62636C] hover:text-[#1E1F24]"
                    }`}
                  >
                    🇮🇩 ID
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("en")}
                    className={`rounded-md px-3 py-1 text-xs font-bold transition-all ${
                      activeTab === "en"
                        ? "bg-[#20449A] text-white shadow-xs"
                        : "text-[#62636C] hover:text-[#1E1F24]"
                    }`}
                  >
                    🇬🇧 EN
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("zh")}
                    className={`rounded-md px-3 py-1 text-xs font-bold transition-all ${
                      activeTab === "zh"
                        ? "bg-[#20449A] text-white shadow-xs"
                        : "text-[#62636C] hover:text-[#1E1F24]"
                    }`}
                  >
                    🇨🇳 ZH
                  </button>
                </div>
              </div>

              {/* Title Field (Tabbed) */}
              {activeTab === "id" && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E1F24]">
                    Judul Banner (Bahasa Indonesia) *
                  </label>
                  <input
                    type="text"
                    placeholder="About Us"
                    {...register("titleId")}
                    className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-[#1E1F24] focus:outline-none focus:ring-2 focus:ring-[#20449A] ${
                      errors.titleId ? "border-red-500" : "border-[#E2E4EB]"
                    }`}
                  />
                  {errors.titleId && (
                    <p className="text-xs text-red-500">{errors.titleId.message}</p>
                  )}
                </div>
              )}

              {activeTab === "en" && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E1F24]">
                    Banner Title (English)
                  </label>
                  <input
                    type="text"
                    placeholder="About Us"
                    {...register("titleEn")}
                    className="w-full rounded-lg border border-[#E2E4EB] bg-white px-3.5 py-2.5 text-sm text-[#1E1F24] focus:outline-none focus:ring-2 focus:ring-[#20449A]"
                  />
                </div>
              )}

              {activeTab === "zh" && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E1F24]">
                    横幅标题 (中文)
                  </label>
                  <input
                    type="text"
                    placeholder="关于我们"
                    {...register("titleZh")}
                    className="w-full rounded-lg border border-[#E2E4EB] bg-white px-3.5 py-2.5 text-sm text-[#1E1F24] focus:outline-none focus:ring-2 focus:ring-[#20449A]"
                  />
                </div>
              )}

              {/* Breadcrumb Field (Tabbed) */}
              {activeTab === "id" && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E1F24]">
                    Teks Breadcrumb (Bahasa Indonesia)
                  </label>
                  <input
                    type="text"
                    placeholder="Home > About US"
                    {...register("breadcrumbId")}
                    className="w-full rounded-lg border border-[#E2E4EB] bg-white px-3.5 py-2.5 text-sm text-[#1E1F24] focus:outline-none focus:ring-2 focus:ring-[#20449A]"
                  />
                  <p className="text-[11px] text-[#62636C]">
                    Format referensi: Home &gt; About US
                  </p>
                </div>
              )}

              {activeTab === "en" && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E1F24]">
                    Breadcrumb Text (English)
                  </label>
                  <input
                    type="text"
                    placeholder="Home > About US"
                    {...register("breadcrumbEn")}
                    className="w-full rounded-lg border border-[#E2E4EB] bg-white px-3.5 py-2.5 text-sm text-[#1E1F24] focus:outline-none focus:ring-2 focus:ring-[#20449A]"
                  />
                </div>
              )}

              {activeTab === "zh" && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E1F24]">
                    面包屑导航 (中文)
                  </label>
                  <input
                    type="text"
                    placeholder="首页 > 关于我们"
                    {...register("breadcrumbZh")}
                    className="w-full rounded-lg border border-[#E2E4EB] bg-white px-3.5 py-2.5 text-sm text-[#1E1F24] focus:outline-none focus:ring-2 focus:ring-[#20449A]"
                  />
                </div>
              )}

              {/* Background Image Upload / URL */}
              <div className="pt-2">
                <Controller
                  control={control}
                  name="backgroundImageUrl"
                  render={({ field }) => (
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      label="Background Image Banner (1920x600 px) *"
                      description="Pilih foto struktur rangka atap atau baja ringan untuk latar belakang hero banner."
                      error={errors.backgroundImageUrl?.message}
                      aspectRatio="wide"
                    />
                  )}
                />
              </div>

              {/* Hidden pageSlug */}
              <input type="hidden" {...register("pageSlug")} />
            </form>
          </div>

          {/* Right: Live Preview Card (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#62636C]">
              <Eye className="h-4 w-4 text-[#20449A]" />
              <span>Pratinjau Live Banner Publik</span>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-[#E2E4EB] bg-zinc-950 h-[260px] flex items-center justify-center p-6 text-center">
              {/* Background Image */}
              {watchedValues.backgroundImageUrl ? (
                <Image
                  src={watchedValues.backgroundImageUrl}
                  alt="Banner Preview"
                  fill
                  className="object-cover object-center filter brightness-[0.45] contrast-110"
                />
              ) : (
                <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center text-zinc-600 text-xs">
                  (Belum ada gambar background)
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/75" />

              {/* Text Preview */}
              <div className="relative z-10 space-y-2 max-w-sm">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
                  {previewTitle}
                </h3>
                <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-white/90">
                  <span className="text-[#E76F1D]">Home</span>
                  <ChevronRight className="h-3 w-3 text-zinc-300" />
                  <span>{previewBreadcrumb.split(">").pop()?.trim() || "About US"}</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-[#EEF2FA] p-4 border border-blue-100 flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-[#20449A] shrink-0 mt-0.5" />
              <p className="text-xs text-[#20449A] leading-relaxed">
                Setiap kali Anda menekan tombol <strong>Simpan Perubahan</strong>, sistem otomatis menginvaliasi cache Redis dan memutakhirkan halaman publik <span className="font-mono">/about</span> secara instan.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
