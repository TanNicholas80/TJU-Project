"use client";

import * as React from "react";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  FileText,
  Loader2,
  Calendar,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable, ColumnDef } from "@/components/admin/data-table";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import {
  getPostsAdmin,
  createPost,
  updatePost,
  deletePost,
  PostInput,
} from "@/actions/posts";

const postFormSchema = z.object({
  titleId: z.string().min(3, "Judul Bahasa Indonesia minimal 3 karakter"),
  titleEn: z.string().optional(),
  titleZh: z.string().optional(),
  categoryPostId: z.coerce.number().optional().nullable(),
  excerptId: z.string().optional(),
  excerptEn: z.string().optional(),
  excerptZh: z.string().optional(),
  contentHtmlId: z.string().min(5, "Konten artikel wajib diisi"),
  contentHtmlEn: z.string().optional(),
  contentHtmlZh: z.string().optional(),
  coverImageUrl: z.string().min(1, "URL Cover gambar wajib diisi"),
  status: z.enum(["published", "draft"]).default("published"),
});

type PostFormData = z.infer<typeof postFormSchema>;

export default function AdminPostsPage() {
  const [posts, setPosts] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [editingPost, setEditingPost] = React.useState<any | null>(null);
  const [activeTab, setActiveTab] = React.useState<"id" | "en" | "zh">("id");

  // Delete dialog state
  const [deleteTarget, setDeleteTarget] = React.useState<any | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(postFormSchema) as any,
    defaultValues: {
      titleId: "",
      titleEn: "",
      titleZh: "",
      categoryPostId: 1,
      excerptId: "",
      excerptEn: "",
      excerptZh: "",
      contentHtmlId: "<p>Tulis artikel lengkap di sini...</p>",
      contentHtmlEn: "",
      contentHtmlZh: "",
      coverImageUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
      status: "published",
    },
  });

  const loadPosts = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getPostsAdmin();
      if (res.success && res.data) {
        setPosts(res.data);
      }
    } catch {
      toast.error("Gagal memuat data artikel");
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleOpenCreate = () => {
    setEditingPost(null);
    reset({
      titleId: "",
      titleEn: "",
      titleZh: "",
      categoryPostId: 1,
      excerptId: "",
      excerptEn: "",
      excerptZh: "",
      contentHtmlId: "<p></p>",
      contentHtmlEn: "",
      contentHtmlZh: "",
      coverImageUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
      status: "published",
    });
    setActiveTab("id");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingPost(item);
    reset({
      titleId: item.titleI18n?.id || "",
      titleEn: item.titleI18n?.en || "",
      titleZh: item.titleI18n?.zh || "",
      categoryPostId: item.categoryPostId || 1,
      excerptId: item.excerptI18n?.id || "",
      excerptEn: item.excerptI18n?.en || "",
      excerptZh: item.excerptI18n?.zh || "",
      contentHtmlId: item.contentHtmlI18n?.id || "<p></p>",
      contentHtmlEn: item.contentHtmlI18n?.en || "",
      contentHtmlZh: item.contentHtmlI18n?.zh || "",
      coverImageUrl: item.coverImageUrl || "",
      status: item.status || "published",
    });
    setActiveTab("id");
    setIsModalOpen(true);
  };

  const onSubmit = async (data: PostFormData) => {
    setIsSubmitting(true);
    try {
      let res;
      if (editingPost) {
        res = await updatePost(editingPost.id, data as PostInput);
      } else {
        res = await createPost(data as PostInput);
      }

      if (res.success) {
        toast.success(res.message || "Berhasil menyimpan data");
        setIsModalOpen(false);
        loadPosts();
      } else {
        toast.error("Gagal, terjadi kesalahan", {
          description: res.message,
        });
      }
    } catch (err: any) {
      toast.error("Gagal, terjadi kesalahan: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await deletePost(deleteTarget.id);
      if (res.success) {
        toast.success("Berhasil menghapus artikel");
        setDeleteTarget(null);
        loadPosts();
      } else {
        toast.error("Gagal menghapus data: " + res.message);
      }
    } catch {
      toast.error("Gagal menghapus artikel");
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      header: "Artikel",
      className: "min-w-[280px]",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-zinc-100 border border-[#E2E4EB]">
            {row.coverImageUrl ? (
              <Image
                src={row.coverImageUrl}
                alt={row.titleI18n?.id || "Cover"}
                fill
                sizes="64px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-zinc-400">
                <FileText className="h-5 w-5" />
              </div>
            )}
          </div>
          <div>
            <p className="font-bold text-[#1E1F24] line-clamp-1">
              {row.titleI18n?.id || "Tanpa Judul"}
            </p>
            <p className="text-xs text-[#62636C]">
              Kategori: {row.categoryName || "Engineering"}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      cell: (row) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
            row.status === "published"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-zinc-100 text-zinc-600 border border-zinc-200"
          }`}
        >
          {row.status === "published" ? "Tayang" : "Draft"}
        </span>
      ),
    },
    {
      header: "Tanggal Buat",
      cell: (row) => (
        <span className="text-xs text-[#62636C]">
          {new Date(row.createdAt || Date.now()).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      header: "Aksi",
      className: "text-right",
      cell: (row) => (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => handleOpenEdit(row)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E2E4EB] bg-white text-[#20449A] hover:bg-[#EEF2FA] transition-colors"
            title="Edit Artikel"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget(row)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-white text-red-600 hover:bg-red-50 transition-colors"
            title="Hapus Artikel"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1E1F24]">
            Manajemen Blog & Artikel
          </h2>
          <p className="text-sm text-[#62636C]">
            Publikasikan artikel edukasi dan wawasan rekayasa dengan editor teks lengkap.
          </p>
        </div>

        <Button
          variant="orange"
          size="default"
          onClick={handleOpenCreate}
          className="font-semibold shadow-xs shrink-0"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Tulis Artikel Baru
        </Button>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-[#E2E4EB] bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-[#20449A]" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={posts}
          searchPlaceholder="Cari judul artikel..."
          emptyTitle="Belum ada artikel blog"
          emptyDescription="Tulis artikel pertama Anda untuk mengedukasi pengunjung tentang baja ringan."
          addNewLabel="Tulis Artikel Baru"
          onAddNew={handleOpenCreate}
        />
      )}

      {/* Create / Edit Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="relative my-8 w-full max-w-4xl rounded-2xl bg-white shadow-2xl border border-[#E2E4EB] max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#E2E4EB] px-6 py-4 bg-[#F9F9FB]">
              <div>
                <h3 className="text-lg font-bold text-[#1E1F24]">
                  {editingPost ? "Edit Artikel Blog" : "Tambah Artikel Baru"}
                </h3>
                <p className="text-xs text-[#62636C]">
                  Gunakan tab bahasa untuk menginput teks lokalisasi (ID, EN, ZH)
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-[#62636C] hover:bg-[#E2E4EB] hover:text-[#1E1F24]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex-1 overflow-y-auto p-6 space-y-6"
            >
              {/* Language Switcher Tabs */}
              <div className="flex items-center gap-2 border-b border-[#E2E4EB] pb-3">
                <Globe className="h-4 w-4 text-[#20449A] mr-1" />
                <span className="text-xs font-bold text-[#1E1F24] mr-2">
                  Bahasa Konten:
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTab("id")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                    activeTab === "id"
                      ? "bg-[#20449A] text-white"
                      : "bg-[#EEF2FA] text-[#20449A] hover:bg-[#DCE5F5]"
                  }`}
                >
                  🇮🇩 Indonesia (Utama)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("en")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                    activeTab === "en"
                      ? "bg-[#20449A] text-white"
                      : "bg-[#EEF2FA] text-[#20449A] hover:bg-[#DCE5F5]"
                  }`}
                >
                  🇬🇧 English
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("zh")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                    activeTab === "zh"
                      ? "bg-[#20449A] text-white"
                      : "bg-[#EEF2FA] text-[#20449A] hover:bg-[#DCE5F5]"
                  }`}
                >
                  🇨🇳 中文 (Mandarin)
                </button>
              </div>

              {/* Cover Image & Category & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E1F24]">
                    URL Cover Gambar *
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    {...register("coverImageUrl")}
                    className={`w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-[#1E1F24] ${
                      errors.coverImageUrl ? "border-red-500" : "border-[#E2E4EB]"
                    }`}
                  />
                  {errors.coverImageUrl && (
                    <p className="text-xs text-red-500">{errors.coverImageUrl.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E1F24]">
                    Status Publikasi
                  </label>
                  <select
                    {...register("status")}
                    className="w-full rounded-lg border border-[#E2E4EB] bg-white px-3 py-2 text-sm text-[#1E1F24]"
                  >
                    <option value="published">Tayang (Published)</option>
                    <option value="draft">Draft (Disembunyikan)</option>
                  </select>
                </div>
              </div>

              {/* Tab: Indonesian */}
              {activeTab === "id" && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E1F24]">
                      Judul Artikel (ID) *
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Mengenal Perhitungan Software HAKI pada Desain Rangka Atap"
                      {...register("titleId")}
                      className={`w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-[#1E1F24] ${
                        errors.titleId ? "border-red-500" : "border-[#E2E4EB]"
                      }`}
                    />
                    {errors.titleId && (
                      <p className="text-xs text-red-500">{errors.titleId.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E1F24]">
                      Ringkasan / Excerpt Singkat (ID)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Ringkasan 1-2 kalimat untuk preview card..."
                      {...register("excerptId")}
                      className="w-full rounded-lg border border-[#E2E4EB] bg-white px-3.5 py-2 text-sm text-[#1E1F24]"
                    />
                  </div>

                  {/* Tiptap RichTextEditor for ID */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E1F24]">
                      Isi Konten Artikel Lengkap (Tiptap Rich Text Editor) *
                    </label>
                    <Controller
                      name="contentHtmlId"
                      control={control}
                      render={({ field }) => (
                        <RichTextEditor
                          content={field.value}
                          onChange={field.onChange}
                          placeholder="Mulai menulis konten artikel dengan format heading, list, gambar..."
                        />
                      )}
                    />
                    {errors.contentHtmlId && (
                      <p className="text-xs text-red-500">
                        {errors.contentHtmlId.message}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Tab: English */}
              {activeTab === "en" && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E1F24]">
                      Article Title (EN)
                    </label>
                    <input
                      type="text"
                      placeholder="Article title in English..."
                      {...register("titleEn")}
                      className="w-full rounded-lg border border-[#E2E4EB] bg-white px-3.5 py-2 text-sm text-[#1E1F24]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E1F24]">
                      Excerpt (EN)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Short summary in English..."
                      {...register("excerptEn")}
                      className="w-full rounded-lg border border-[#E2E4EB] bg-white px-3.5 py-2 text-sm text-[#1E1F24]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E1F24]">
                      Content HTML (EN)
                    </label>
                    <Controller
                      name="contentHtmlEn"
                      control={control}
                      render={({ field }) => (
                        <RichTextEditor
                          content={field.value || ""}
                          onChange={field.onChange}
                          placeholder="Write English version of the article..."
                        />
                      )}
                    />
                  </div>
                </div>
              )}

              {/* Tab: Mandarin (ZH) */}
              {activeTab === "zh" && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E1F24]">
                      文章标题 (ZH)
                    </label>
                    <input
                      type="text"
                      placeholder="中文文章标题..."
                      {...register("titleZh")}
                      className="w-full rounded-lg border border-[#E2E4EB] bg-white px-3.5 py-2 text-sm text-[#1E1F24]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E1F24]">
                      文章简介 (ZH)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="中文简述..."
                      {...register("excerptZh")}
                      className="w-full rounded-lg border border-[#E2E4EB] bg-white px-3.5 py-2 text-sm text-[#1E1F24]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E1F24]">
                      文章内容 (ZH)
                    </label>
                    <Controller
                      name="contentHtmlZh"
                      control={control}
                      render={({ field }) => (
                        <RichTextEditor
                          content={field.value || ""}
                          onChange={field.onChange}
                          placeholder="编写中文文章内容..."
                        />
                      )}
                    />
                  </div>
                </div>
              )}

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2E4EB]">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  variant="orange"
                  disabled={isSubmitting}
                  className="font-bold"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Menyimpan...
                    </>
                  ) : editingPost ? (
                    "Simpan Perubahan"
                  ) : (
                    "Publikasikan Artikel"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Alert Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Hapus Artikel Blog"
        description={`Apakah Anda yakin ingin menghapus artikel "${deleteTarget?.titleI18n?.id}"? Data yang dihapus tidak dapat dipulihkan.`}
        confirmLabel="Hapus Artikel"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
