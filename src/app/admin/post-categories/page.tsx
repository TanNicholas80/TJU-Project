"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Tags,
  Loader2,
  Sparkles,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable, ColumnDef } from "@/components/admin/data-table";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import {
  getPostCategoriesAdmin,
  createPostCategory,
  updatePostCategory,
  deletePostCategory,
  PostCategoryInput,
} from "@/actions/post-categories";

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

const postCategoryFormSchema = z.object({
  nameId: z.string().min(2, "Nama kategori (Bahasa Indonesia) wajib diisi minimal 2 karakter"),
  nameEn: z.string().optional(),
  nameZh: z.string().optional(),
  slug: z.string().min(2, "Slug kategori wajib diisi"),
});

type PostCategoryFormData = z.infer<typeof postCategoryFormSchema>;

export default function AdminPostCategoriesPage() {
  const [items, setItems] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<any | null>(null);

  const [deleteTarget, setDeleteTarget] = React.useState<any | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<PostCategoryFormData>({
    resolver: zodResolver(postCategoryFormSchema) as any,
    defaultValues: {
      nameId: "",
      nameEn: "",
      nameZh: "",
      slug: "",
    },
  });

  const loadData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getPostCategoriesAdmin();
      if (res.success && res.data) {
        setItems(res.data);
      }
    } catch {
      toast.error("Gagal memuat kategori artikel blog");
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenCreate = () => {
    setEditingItem(null);
    reset({
      nameId: "",
      nameEn: "",
      nameZh: "",
      slug: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    reset({
      nameId: item.nameI18n?.id || "",
      nameEn: item.nameI18n?.en || "",
      nameZh: item.nameI18n?.zh || "",
      slug: item.slug || "",
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

  const onSubmit = async (data: PostCategoryFormData) => {
    setIsSubmitting(true);
    try {
      let res;
      if (editingItem) {
        res = await updatePostCategory(editingItem.id, data as PostCategoryInput);
      } else {
        res = await createPostCategory(data as PostCategoryInput);
      }

      if (res.success) {
        toast.success(res.message || "Berhasil menyimpan kategori artikel");
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
      const res = await deletePostCategory(deleteTarget.id);
      if (res.success) {
        toast.success("Berhasil menghapus kategori artikel");
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
      header: "Kategori & Slug",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EEF2FA] text-[#20449A]">
            <Tags className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-bold text-[#1E1F24]">
                {row.nameI18n?.id || "Tanpa Nama"}
              </p>
              {row.nameI18n?.en && (
                <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-600">
                  EN: {row.nameI18n.en}
                </span>
              )}
            </div>
            <p className="text-xs font-mono text-[#20449A]">
              /{row.slug}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Terjemahan Bahasa Lain",
      cell: (row) => (
        <div className="flex flex-col gap-1 text-xs text-[#62636C]">
          <div>
            <span className="font-semibold text-zinc-500">English:</span>{" "}
            {row.nameI18n?.en || "-"}
          </div>
          <div>
            <span className="font-semibold text-zinc-500">中文 (Mandarin):</span>{" "}
            {row.nameI18n?.zh || "-"}
          </div>
        </div>
      ),
    },
    {
      header: "Tanggal Dibuat",
      cell: (row) => {
        const dateStr = row.createdAt
          ? new Date(row.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
          : "-";
        return (
          <div className="flex items-center gap-1.5 text-xs text-[#62636C]">
            <Calendar className="h-3.5 w-3.5 text-zinc-400" />
            <span>{dateStr}</span>
          </div>
        );
      },
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
            Kategori Blog & Artikel
          </h2>
          <p className="text-sm text-[#62636C]">
            Atur klasifikasi topik dan kategori artikel blog (Engineering, Tips, Berita) untuk filter artikel publik.
          </p>
        </div>

        <Button
          variant="orange"
          size="default"
          onClick={handleOpenCreate}
          className="font-semibold shadow-xs shrink-0"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Tambah Kategori Blog
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
          emptyTitle="Belum ada kategori blog"
          emptyDescription="Mulai tambahkan kategori artikel untuk mengelompokkan konten edukasi di halaman blog."
          addNewLabel="Tambah Kategori Blog"
          onAddNew={handleOpenCreate}
        />
      )}

      {/* Create / Edit Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="relative my-8 w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-[#E2E4EB] max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#E2E4EB] px-6 py-4 bg-[#F9F9FB]">
              <div>
                <h3 className="text-lg font-bold text-[#1E1F24]">
                  {editingItem ? "Edit Kategori Blog" : "Tambah Kategori Blog Baru"}
                </h3>
                <p className="text-xs text-[#62636C]">
                  {editingItem
                    ? "Perbarui nama kategori atau slug topik blog."
                    : "Tambahkan klasifikasi kategori artikel baru."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E1F24]">
                  Nama Kategori (Bahasa Indonesia) *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Engineering & Struktur"
                  value={watch("nameId")}
                  onChange={handleNameChange}
                  className={`w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-[#1E1F24] placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#20449A]/30 focus:border-[#20449A] ${
                    errors.nameId ? "border-red-500" : "border-[#E2E4EB]"
                  }`}
                />
                {errors.nameId && (
                  <p className="text-xs text-red-500">{errors.nameId.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E1F24]">
                  Slug URL Kategori *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-zinc-400 font-mono">
                    /
                  </span>
                  <input
                    type="text"
                    placeholder="engineering-struktur"
                    {...register("slug")}
                    className={`w-full rounded-lg border bg-white pl-7 pr-3.5 py-2 text-sm font-mono text-[#1E1F24] placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#20449A]/30 focus:border-[#20449A] ${
                      errors.slug ? "border-red-500" : "border-[#E2E4EB]"
                    }`}
                  />
                </div>
                {errors.slug && (
                  <p className="text-xs text-red-500">{errors.slug.message}</p>
                )}
                <p className="text-[11px] text-[#62636C]">
                  Digunakan untuk filter kategori di blog. Karakter otomatis diubah ke huruf kecil dan strip.
                </p>
              </div>

              {/* Tip info */}
              <div className="flex items-start gap-2.5 rounded-xl bg-[#EEF2FA] p-3 text-xs text-[#20449A] border border-blue-100">
                <Sparkles className="h-4 w-4 shrink-0 mt-0.5" />
                <p>
                  Kategori yang Anda simpan akan langsung tersedia sebagai opsi pilihan kategori saat membuat atau mengedit artikel blog.
                </p>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E4EB]">
                <Button
                  type="button"
                  variant="outline"
                  size="default"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  variant="orange"
                  size="default"
                  disabled={isSubmitting}
                  className="font-bold shadow-xs"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Menyimpan...
                    </>
                  ) : editingItem ? (
                    "Perbarui Kategori"
                  ) : (
                    "Simpan Kategori"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Hapus Kategori Blog?"
        description={`Apakah Anda yakin ingin menghapus kategori "${deleteTarget?.nameI18n?.id || "ini"}"? Artikel yang menggunakan kategori ini akan dialihkan ke kategori default.`}
        confirmLabel="Ya, Hapus Kategori"
        cancelLabel="Batal"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
