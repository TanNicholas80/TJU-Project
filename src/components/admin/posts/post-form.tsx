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
  Eye,
  LayoutGrid,
  FileText,
  BookOpen,
  Calendar,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/admin/image-upload";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { createPost, updatePost, PostInput } from "@/actions/posts";
import { getPostCategoriesAdmin } from "@/actions/post-categories";

const postFormSchema = z.object({
  titleId: z.string().min(3, "Judul artikel wajib diisi minimal 3 karakter"),
  categoryPostId: z.string().optional().nullable(),
  coverImageUrl: z.string().min(1, "Cover gambar artikel wajib diunggah"),
  status: z.enum(["published", "draft"]).default("published"),
  excerptId: z.string().optional(),
  contentHtmlId: z.string().min(5, "Konten artikel wajib diisi"),
});

type PostFormData = z.infer<typeof postFormSchema>;

interface PostFormProps {
  initialData?: any;
  postId?: string;
  isEdit?: boolean;
}

export function PostForm({ initialData, postId, isEdit = false }: PostFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [categories, setCategories] = React.useState<any[]>([]);
  const [previewMode, setPreviewMode] = React.useState<"card" | "detail">("card");

  const defaultValues: PostFormData = {
    titleId: initialData?.titleI18n?.id || "",
    categoryPostId: initialData?.categoryPostId ? String(initialData.categoryPostId) : "",
    coverImageUrl:
      initialData?.coverImageUrl ||
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
    status: initialData?.status || "published",
    excerptId: initialData?.excerptI18n?.id || "",
    contentHtmlId:
      initialData?.contentHtmlI18n?.id ||
      "<p>Konstruksi rangka atap baja ringan kini menjadi standar utama dalam pembangunan modern karena kekuatan struktural, ketahanan karat, dan presisi perakitan.</p>",
  };

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(postFormSchema) as any,
    defaultValues,
  });

  // Load post categories for dropdown
  React.useEffect(() => {
    async function loadCategories() {
      try {
        const res = await getPostCategoriesAdmin();
        if (res.success && res.data) {
          setCategories(res.data);
        }
      } catch (e) {
        console.warn("Failed to load post categories", e);
      }
    }
    loadCategories();
  }, []);

  // Real-time watched values for Live Preview
  const watchedTitle = watch("titleId");
  const watchedCategoryId = watch("categoryPostId");
  const watchedCoverImageUrl = watch("coverImageUrl");
  const watchedStatus = watch("status");
  const watchedExcerpt = watch("excerptId");
  const watchedContentHtml = watch("contentHtmlId");

  // Fallbacks for Live Preview
  const previewTitle =
    watchedTitle || "Panduan Memilih Baja Ringan Mutu Tinggi G550 Berstandar SNI";
  const previewExcerpt =
    watchedExcerpt ||
    "Pelajari kriteria mutu baja ringan G550, lapisan anti-karat Galvalume AZ100, dan sertifikasi SNI resmi untuk keamanan struktur jangka panjang.";
  const previewCover =
    watchedCoverImageUrl ||
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80";

  const selectedCategoryObj = categories.find((c) => String(c.id) === String(watchedCategoryId));
  const previewCategoryName =
    selectedCategoryObj?.nameI18n?.id || initialData?.categoryName || "Engineering";

  const previewDateStr = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const onSubmit = async (data: PostFormData) => {
    setIsSubmitting(true);
    try {
      let res;
      if (isEdit && postId) {
        res = await updatePost(postId, data as PostInput);
      } else {
        res = await createPost(data as PostInput);
      }

      if (res.success) {
        toast.success(res.message || "Artikel berhasil disimpan");
        router.push("/admin/posts");
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
            href="/admin/posts"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2E4EB] bg-[#F9F9FB] text-[#62636C] hover:bg-[#EEF2FA] hover:text-[#20449A] transition-colors"
            title="Kembali ke Daftar Artikel"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-[#1E1F24]">
                {isEdit ? "Edit Artikel Blog" : "Tulis Artikel Blog Baru"}
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
              Tulis konten artikel dalam Bahasa Indonesia. Sistem akan menerjemahkan ke EN & ZH secara otomatis.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/posts")}
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
                {isEdit ? "Simpan Perubahan" : "Terbitkan Artikel"}
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
            {/* Card 1: Metadata Artikel */}
            <div className="rounded-2xl border border-[#E2E4EB] bg-white p-6 shadow-xs space-y-5">
              <div className="flex items-center gap-2 border-b border-[#E2E4EB] pb-3">
                <BookOpen className="h-5 w-5 text-[#20449A]" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#1E1F24]">
                  Informasi Artikel
                </h2>
              </div>

              {/* Title Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E1F24]">
                  Judul Blog / Artikel (Bahasa Indonesia) *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Tips Memilih Baja Ringan Mutu Tinggi G550 untuk Konstruksi Rangka Atap"
                  {...register("titleId")}
                  className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-[#1E1F24] focus:outline-none focus:ring-2 focus:ring-[#20449A] ${
                    errors.titleId ? "border-red-500" : "border-[#E2E4EB]"
                  }`}
                />
                {errors.titleId && (
                  <p className="text-xs text-red-500">{errors.titleId.message}</p>
                )}
              </div>

              {/* Category & Status Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Category Dropdown */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E1F24]">
                    Kategori Blog *
                  </label>
                  <select
                    {...register("categoryPostId")}
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
                        <option value={1}>Engineering</option>
                        <option value={2}>Edukasi & Tips</option>
                        <option value={3}>Berita & Proyek</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Publication Status */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E1F24]">
                    Status Publikasi
                  </label>
                  <select
                    {...register("status")}
                    className="w-full rounded-xl border border-[#E2E4EB] bg-white px-3.5 py-2.5 text-sm text-[#1E1F24] focus:outline-none focus:ring-2 focus:ring-[#20449A]"
                  >
                    <option value="published">Tayang / Diterbitkan</option>
                    <option value="draft">Draf (Disimpan Sementara)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Card 2: Cover Gambar */}
            <div className="rounded-2xl border border-[#E2E4EB] bg-white p-6 shadow-xs space-y-4">
              <Controller
                control={control}
                name="coverImageUrl"
                render={({ field }) => (
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    label="Cover Gambar Artikel (1200x800 px) *"
                    description="Pilih foto berkualitas tinggi yang relevan dengan topik artikel untuk banner utama dan thumbnail kartu."
                    error={errors.coverImageUrl?.message}
                    aspectRatio="video"
                    folder="posts"
                  />
                )}
              />
            </div>

            {/* Card 3: Ringkasan Artikel (Excerpt) */}
            <div className="rounded-2xl border border-[#E2E4EB] bg-white p-6 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-[#E2E4EB] pb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E1F24]">
                  Ringkasan Singkat Blog (Excerpt)
                </label>
                <span className="text-[11px] text-[#62636C]">
                  Ditampilkan pada kartu artikel & snippet Google
                </span>
              </div>
              <textarea
                rows={3}
                placeholder="Tulis ringkasan singkat artikel dalam 1-3 kalimat yang menarik pembaca..."
                {...register("excerptId")}
                className="w-full rounded-xl border border-[#E2E4EB] bg-white px-4 py-2.5 text-sm text-[#1E1F24] focus:outline-none focus:ring-2 focus:ring-[#20449A]"
              />
            </div>

            {/* Card 4: Content Blog (TipTap Rich Text Editor) */}
            <div className="rounded-2xl border border-[#E2E4EB] bg-white p-6 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-[#E2E4EB] pb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E1F24]">
                  Konten Lengkap Artikel (TipTap Rich Text Editor) *
                </label>
                <span className="text-[11px] text-[#62636C]">
                  Mendukung heading, format teks, list, quote & gambar
                </span>
              </div>

              <Controller
                control={control}
                name="contentHtmlId"
                render={({ field }) => (
                  <RichTextEditor
                    content={field.value || ""}
                    onChange={field.onChange}
                    placeholder="Mulai tulis isi artikel blog di sini..."
                    className="min-h-[350px]"
                  />
                )}
              />
              {errors.contentHtmlId && (
                <p className="text-xs text-red-500">{errors.contentHtmlId.message}</p>
              )}
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
                <span>Live Pratinjau Artikel</span>
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
              {/* MODE 1: PREVIEW CARD (Grid / Landing Exact Match) */}
              {previewMode === "card" && (
                <div className="w-full max-w-sm mx-auto">
                  <div className="text-center mb-3">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Tampilan Kartu di Halaman Blog
                    </span>
                  </div>

                  <article className="group flex flex-col overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-md transition-all">
                    {/* Thumbnail Image Container with Badge Overlaid */}
                    <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                      <Image
                        src={previewCover}
                        alt={previewTitle}
                        fill
                        sizes="400px"
                        className="object-cover object-center"
                      />

                      {/* Category Pill Overlaid at Top-Left */}
                      <div className="absolute top-3 left-3 z-10">
                        <span className="inline-block rounded-full bg-[#1E1F24]/90 backdrop-blur-xs px-3 py-0.5 text-[10px] font-semibold text-white shadow-xs">
                          {previewCategoryName}
                        </span>
                      </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-5 flex flex-1 flex-col justify-between space-y-3">
                      <div className="space-y-2">
                        {/* Title */}
                        <h3 className="text-base font-bold text-[#1E1F24] leading-snug line-clamp-2">
                          {previewTitle}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-xs text-[#62636C] leading-relaxed line-clamp-2">
                          {previewExcerpt}
                        </p>
                      </div>

                      {/* Read More Link */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-bold text-[#20449A] hover:text-[#F48902] transition-colors">
                          Baca Selengkapnya &rarr;
                        </span>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400">
                          <Calendar className="h-3 w-3" />
                          <span>{previewDateStr}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                </div>
              )}

              {/* MODE 2: PREVIEW DETAIL (Exact Match Single Article Page) */}
              {previewMode === "detail" && (
                <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-md p-5 sm:p-6 space-y-4 max-h-[600px] overflow-y-auto">
                  {/* Category Badge & Back row */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="inline-block rounded-md bg-[#20449A] px-3.5 py-1 text-xs font-semibold text-white shadow-xs">
                      {previewCategoryName}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{previewDateStr}</span>
                  </div>

                  {/* Title Centered Italic Bold */}
                  <h2 className="text-lg sm:text-2xl font-extrabold italic text-[#1E1F24] leading-tight text-center">
                    {previewTitle}
                  </h2>

                  {/* Hero Cover Image */}
                  <div className="relative w-full h-[200px] sm:h-[240px] rounded-xl overflow-hidden bg-slate-900 shadow-sm">
                    <Image
                      src={previewCover}
                      alt={previewTitle}
                      fill
                      sizes="500px"
                      className="object-cover object-center"
                    />
                  </div>

                  {/* Excerpt Highlight Box */}
                  {previewExcerpt && (
                    <div className="p-3.5 bg-[#EEF2FA] rounded-xl border border-blue-100">
                      <p className="text-xs font-medium text-[#20449A] leading-relaxed italic">
                        &ldquo;{previewExcerpt}&rdquo;
                      </p>
                    </div>
                  )}

                  {/* TipTap Rich HTML Content */}
                  <div className="border-t border-slate-100 pt-3">
                    <div
                      className="prose prose-sm prose-zinc max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html:
                          watchedContentHtml ||
                          "<p>Konten artikel akan ditampilkan di sini sesuai format yang Anda ketik di editor...</p>",
                      }}
                    />
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
