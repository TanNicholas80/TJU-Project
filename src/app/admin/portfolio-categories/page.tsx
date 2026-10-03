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
  FolderTree,
  Loader2,
  Globe,
  Layers,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable, ColumnDef } from "@/components/admin/data-table";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { ImageUpload } from "@/components/admin/image-upload";
import {
  getPortfolioCategoriesAdmin,
  createPortfolioCategory,
  updatePortfolioCategory,
  deletePortfolioCategory,
  PortfolioCategoryInput,
} from "@/actions/portfolio-categories";

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

const categoryFormSchema = z.object({
  nameId: z.string().min(2, "Nama kategori (Bahasa Indonesia) wajib diisi"),
  nameEn: z.string().optional(),
  nameZh: z.string().optional(),
  slug: z.string().min(2, "Slug kategori wajib diisi"),
  descriptionId: z.string().optional(),
  descriptionEn: z.string().optional(),
  descriptionZh: z.string().optional(),
  coverImageUrl: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categoryFormSchema>;

export default function AdminPortfolioCategoriesPage() {
  const [items, setItems] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<any | null>(null);
  const [activeTab, setActiveTab] = React.useState<"id" | "en" | "zh">("id");

  const [deleteTarget, setDeleteTarget] = React.useState<any | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema) as any,
    defaultValues: {
      nameId: "",
      nameEn: "",
      nameZh: "",
      slug: "",
      descriptionId: "",
      descriptionEn: "",
      descriptionZh: "",
      coverImageUrl: "",
    },
  });

  const loadData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getPortfolioCategoriesAdmin();
      if (res.success && res.data) {
        setItems(res.data);
      }
    } catch {
      toast.error("Gagal memuat kategori portofolio");
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setActiveTab("id");
    reset({
      nameId: "",
      nameEn: "",
      nameZh: "",
      slug: "",
      descriptionId: "",
      descriptionEn: "",
      descriptionZh: "",
      coverImageUrl: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setActiveTab("id");
    reset({
      nameId: item.nameI18n?.id || "",
      nameEn: item.nameI18n?.en || "",
      nameZh: item.nameI18n?.zh || "",
      slug: item.slug || "",
      descriptionId: item.descriptionI18n?.id || "",
      descriptionEn: item.descriptionI18n?.en || "",
      descriptionZh: item.descriptionI18n?.zh || "",
      coverImageUrl: item.coverImageUrl || "",
    });
    setIsModalOpen(true);
  };

  // Auto-generate slug when nameId changes if creating new item
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue("nameId", val, { shouldValidate: true });
    if (!editingItem) {
      setValue("slug", slugify(val), { shouldValidate: true });
    }
  };

  const onSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true);
    try {
      let res;
      if (editingItem) {
        res = await updatePortfolioCategory(editingItem.id, data as PortfolioCategoryInput);
      } else {
        res = await createPortfolioCategory(data as PortfolioCategoryInput);
      }

      if (res.success) {
        toast.success(res.message || "Berhasil menyimpan kategori");
        setIsModalOpen(false);
        loadData();
      } else {
        toast.error("Gagal: " + res.message);
      }
    } catch (err: any) {
      toast.error("Terjadi kesalahan: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await deletePortfolioCategory(deleteTarget.id);
      if (res.success) {
        toast.success("Berhasil menghapus kategori portofolio");
        setDeleteTarget(null);
        loadData();
      } else {
        toast.error("Gagal menghapus: " + res.message);
      }
    } catch {
      toast.error("Gagal menghapus kategori");
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      header: "Kategori & Gambar Cover",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-lg bg-zinc-900 border border-[#E2E4EB]">
            {row.coverImageUrl ? (
              <Image
                src={row.coverImageUrl}
                alt="Cover"
                fill
                sizes="80px"
                className="object-cover"
              />
            ) : (
              <Layers className="h-5 w-5 text-zinc-500 m-auto" />
            )}
          </div>
          <div>
            <p className="font-bold text-[#1E1F24] line-clamp-1">
              {row.nameI18n?.id || "Tanpa Nama"}
            </p>
            <p className="text-xs font-mono text-[#20449A]">
              /{row.slug}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Deskripsi Singkat",
      cell: (row) => (
        <p className="text-xs text-[#62636C] max-w-sm line-clamp-2">
          {row.descriptionI18n?.id || "-"}
        </p>
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
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E2E4EB] bg-white text-[#20449A] hover:bg-[#EEF2FA] transition-colors cursor-pointer"
            title="Edit Kategori"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget(row)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-white text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            title="Hapus Kategori"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1E1F24]">
            Kategori Portofolio
          </h2>
          <p className="text-sm text-[#62636C]">
            Atur segmen dan skala proyek (Industrial, Commercial, Residential) yang ditampilkan di kartu Tentang Kami dan filter galeri.
          </p>
        </div>

        <Button
          variant="orange"
          size="default"
          onClick={handleOpenCreate}
          className="font-semibold shadow-xs shrink-0"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Tambah Kategori
        </Button>
      </div>

      {/* Main Content / Table */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-[#E2E4EB] bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-[#20449A]" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={items}
          searchPlaceholder="Cari nama atau slug kategori..."
          emptyTitle="Belum ada kategori portofolio"
          emptyDescription="Mulai tambahkan kategori portofolio untuk menampilkan kartu proyek di halaman Tentang Kami."
          addNewLabel="Tambah Kategori Baru"
          onAddNew={handleOpenCreate}
        />
      )}

      {/* Create / Edit Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="relative my-8 w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-[#E2E4EB] max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#E2E4EB] px-6 py-4 bg-[#F9F9FB]">
              <div>
                <h3 className="text-lg font-bold text-[#1E1F24]">
                  {editingItem ? "Edit Kategori Portofolio" : "Tambah Kategori Baru"}
                </h3>
                <p className="text-xs text-[#62636C]">
                  Lengkapi nama, deskripsi singkat, dan cover background kartu
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-[#62636C] hover:bg-[#E2E4EB] transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex-1 overflow-y-auto p-6 space-y-5"
            >
              {/* Language Switcher */}
              <div className="flex items-center justify-between border-b border-[#E2E4EB] pb-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#62636C]">
                  <Globe className="h-4 w-4 text-[#20449A]" />
                  <span>Bahasa Teks:</span>
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

              {/* Name Field per Tab */}
              {activeTab === "id" && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E1F24]">
                    Nama Kategori (Bahasa Indonesia) *
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Industrial"
                    {...register("nameId")}
                    onChange={handleNameChange}
                    className={`w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-[#1E1F24] focus:outline-none focus:ring-2 focus:ring-[#20449A] ${
                      errors.nameId ? "border-red-500" : "border-[#E2E4EB]"
                    }`}
                  />
                  {errors.nameId && (
                    <p className="text-xs text-red-500">{errors.nameId.message}</p>
                  )}
                </div>
              )}

              {activeTab === "en" && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E1F24]">
                    Category Name (English)
                  </label>
                  <input
                    type="text"
                    placeholder="E.g. Industrial"
                    {...register("nameEn")}
                    className="w-full rounded-lg border border-[#E2E4EB] bg-white px-3.5 py-2 text-sm text-[#1E1F24] focus:outline-none focus:ring-2 focus:ring-[#20449A]"
                  />
                </div>
              )}

              {activeTab === "zh" && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E1F24]">
                    分类名称 (中文)
                  </label>
                  <input
                    type="text"
                    placeholder="例如: 工业设施"
                    {...register("nameZh")}
                    className="w-full rounded-lg border border-[#E2E4EB] bg-white px-3.5 py-2 text-sm text-[#1E1F24] focus:outline-none focus:ring-2 focus:ring-[#20449A]"
                  />
                </div>
              )}

              {/* Slug Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E1F24]">
                  Slug URL Kategori *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#62636C]">
                    /kategori/
                  </span>
                  <input
                    type="text"
                    placeholder="industrial"
                    {...register("slug")}
                    className={`w-full rounded-lg border bg-white pl-20 pr-3.5 py-2 text-sm text-[#1E1F24] font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#20449A] ${
                      errors.slug ? "border-red-500" : "border-[#E2E4EB]"
                    }`}
                  />
                </div>
                {errors.slug && (
                  <p className="text-xs text-red-500">{errors.slug.message}</p>
                )}
              </div>

              {/* Description Field (Standard Textarea - no Tiptap as requested) */}
              {activeTab === "id" && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E1F24]">
                    Deskripsi Singkat (Bahasa Indonesia)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Contoh: Pabrik, Gudang, Fasilitas Produksi Skala Besar"
                    {...register("descriptionId")}
                    className="w-full rounded-lg border border-[#E2E4EB] bg-white px-3.5 py-2 text-sm text-[#1E1F24] focus:outline-none focus:ring-2 focus:ring-[#20449A]"
                  />
                </div>
              )}

              {activeTab === "en" && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E1F24]">
                    Short Description (English)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="E.g. Factories, Warehouses, Large Scale Production Facilities"
                    {...register("descriptionEn")}
                    className="w-full rounded-lg border border-[#E2E4EB] bg-white px-3.5 py-2 text-sm text-[#1E1F24] focus:outline-none focus:ring-2 focus:ring-[#20449A]"
                  />
                </div>
              )}

              {activeTab === "zh" && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E1F24]">
                    简短描述 (中文)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="例如: 厂房、仓库、大型生产设施"
                    {...register("descriptionZh")}
                    className="w-full rounded-lg border border-[#E2E4EB] bg-white px-3.5 py-2 text-sm text-[#1E1F24] focus:outline-none focus:ring-2 focus:ring-[#20449A]"
                  />
                </div>
              )}

              {/* Cover Image Upload / URL */}
              <div className="pt-2">
                <Controller
                  control={control}
                  name="coverImageUrl"
                  render={({ field }) => (
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      label="Cover Image Background Kartu (1200x800 px)"
                      description="Foto proyek beresolusi tinggi sebagai latar belakang kartu di bagian 'Menangani Berbagai Skala Proyek'."
                      error={errors.coverImageUrl?.message}
                      aspectRatio="video"
                    />
                  )}
                />
              </div>

              {/* Modal Actions */}
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
                  ) : editingItem ? (
                    "Simpan Perubahan"
                  ) : (
                    "Tambah Kategori"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Hapus Kategori Portofolio"
        description="Apakah Anda yakin ingin menghapus kategori ini? Kartu kategori ini tidak akan lagi ditampilkan di halaman Tentang Kami."
        confirmLabel="Hapus Kategori"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
