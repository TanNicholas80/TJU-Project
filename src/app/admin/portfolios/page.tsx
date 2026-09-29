"use client";

import * as React from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Briefcase,
  Loader2,
  MapPin,
  Globe,
  Images,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable, ColumnDef } from "@/components/admin/data-table";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import {
  getPortfoliosAdmin,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
  PortfolioInput,
} from "@/actions/portfolios";

const portfolioFormSchema = z.object({
  titleId: z.string().min(3, "Judul proyek Bahasa Indonesia minimal 3 karakter"),
  titleEn: z.string().optional(),
  titleZh: z.string().optional(),
  categoryPortfolioId: z.coerce.number().optional().nullable(),
  location: z.string().min(2, "Lokasi proyek wajib diisi (misal: Semarang, Jawa Tengah)"),
  coverImageUrl: z.string().min(1, "URL Cover gambar wajib diisi"),
  status: z.enum(["published", "draft"]).default("published"),
  galleryUrlsString: z.string().optional(),
});

type PortfolioFormData = z.infer<typeof portfolioFormSchema>;

export default function AdminPortfoliosPage() {
  const [portfolios, setPortfolios] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<any | null>(null);
  const [activeTab, setActiveTab] = React.useState<"id" | "en" | "zh">("id");

  // Delete dialog state
  const [deleteTarget, setDeleteTarget] = React.useState<any | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PortfolioFormData>({
    resolver: zodResolver(portfolioFormSchema) as any,
    defaultValues: {
      titleId: "",
      titleEn: "",
      titleZh: "",
      categoryPortfolioId: 1,
      location: "Semarang, Jawa Tengah",
      coverImageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1200&q=80",
      status: "published",
      galleryUrlsString: "",
    },
  });

  const loadPortfolios = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getPortfoliosAdmin();
      if (res.success && res.data) {
        setPortfolios(res.data);
      }
    } catch {
      toast.error("Gagal memuat data portofolio");
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadPortfolios();
  }, [loadPortfolios]);

  const handleOpenCreate = () => {
    setEditingItem(null);
    reset({
      titleId: "",
      titleEn: "",
      titleZh: "",
      categoryPortfolioId: 1,
      location: "Semarang, Jawa Tengah",
      coverImageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1200&q=80",
      status: "published",
      galleryUrlsString: "",
    });
    setActiveTab("id");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    reset({
      titleId: item.titleI18n?.id || "",
      titleEn: item.titleI18n?.en || "",
      titleZh: item.titleI18n?.zh || "",
      categoryPortfolioId: item.categoryPortfolioId || 1,
      location: item.location || "",
      coverImageUrl: item.coverImageUrl || "",
      status: item.status || "published",
      galleryUrlsString: item.images?.map((img: any) => img.imageUrl).join("\n") || "",
    });
    setActiveTab("id");
    setIsModalOpen(true);
  };

  const onSubmit = async (data: PortfolioFormData) => {
    setIsSubmitting(true);
    try {
      const galleryUrls = data.galleryUrlsString
        ? data.galleryUrlsString
            .split("\n")
            .map((u) => u.trim())
            .filter(Boolean)
        : [];

      const payload: PortfolioInput = {
        titleId: data.titleId,
        titleEn: data.titleEn,
        titleZh: data.titleZh,
        categoryPortfolioId: data.categoryPortfolioId,
        location: data.location,
        coverImageUrl: data.coverImageUrl,
        status: data.status,
        galleryUrls,
      };

      let res;
      if (editingItem) {
        res = await updatePortfolio(editingItem.id, payload);
      } else {
        res = await createPortfolio(payload);
      }

      if (res.success) {
        toast.success(res.message || "Berhasil menyimpan data");
        setIsModalOpen(false);
        loadPortfolios();
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
      const res = await deletePortfolio(deleteTarget.id);
      if (res.success) {
        toast.success("Berhasil menghapus data portofolio");
        setDeleteTarget(null);
        loadPortfolios();
      } else {
        toast.error("Gagal menghapus: " + res.message);
      }
    } catch {
      toast.error("Gagal menghapus portofolio");
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      header: "Proyek",
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
                <Briefcase className="h-5 w-5" />
              </div>
            )}
          </div>
          <div>
            <p className="font-bold text-[#1E1F24] line-clamp-1">
              {row.titleI18n?.id || "Tanpa Judul"}
            </p>
            <p className="text-xs text-[#62636C]">
              {row.categoryName || "Konstruksi Rangka Atap"}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Lokasi",
      cell: (row) => (
        <div className="flex items-center gap-1.5 text-xs text-[#62636C]">
          <MapPin className="h-3.5 w-3.5 text-[#F48902] shrink-0" />
          <span>{row.location}</span>
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
      header: "Aksi",
      className: "text-right",
      cell: (row) => (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => handleOpenEdit(row)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E2E4EB] bg-white text-[#20449A] hover:bg-[#EEF2FA] transition-colors"
            title="Edit Portofolio"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget(row)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-white text-red-600 hover:bg-red-50 transition-colors"
            title="Hapus Portofolio"
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
            Manajemen Portofolio Proyek
          </h2>
          <p className="text-sm text-[#62636C]">
            Kelola dokumentasi proyek konstruksi rangka atap, lokasi, dan foto hasil pekerjaan.
          </p>
        </div>

        <Button
          variant="orange"
          size="default"
          onClick={handleOpenCreate}
          className="font-semibold shadow-xs shrink-0"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Tambah Portofolio Baru
        </Button>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-[#E2E4EB] bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-[#20449A]" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={portfolios}
          searchPlaceholder="Cari nama proyek atau lokasi..."
          emptyTitle="Belum ada portofolio proyek"
          emptyDescription="Mulai tambahkan hasil pekerjaan proyek rangka atap Anda untuk ditampilkan di galeri utama."
          addNewLabel="Tambah Portofolio Baru"
          onAddNew={handleOpenCreate}
        />
      )}

      {/* Create / Edit Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="relative my-8 w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-[#E2E4EB] max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#E2E4EB] px-6 py-4 bg-[#F9F9FB]">
              <div>
                <h3 className="text-lg font-bold text-[#1E1F24]">
                  {editingItem ? "Edit Portofolio Proyek" : "Tambah Portofolio Proyek Baru"}
                </h3>
                <p className="text-xs text-[#62636C]">
                  Masukkan informasi proyek, lokasi, dan gambar utama
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

            {/* Modal Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex-1 overflow-y-auto p-6 space-y-6"
            >
              {/* Language Switcher Tabs */}
              <div className="flex items-center gap-2 border-b border-[#E2E4EB] pb-3">
                <Globe className="h-4 w-4 text-[#20449A] mr-1" />
                <span className="text-xs font-bold text-[#1E1F24] mr-2">
                  Bahasa Judul:
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

              {/* Title per Tab */}
              {activeTab === "id" && (
                <div className="space-y-1.5">
                  <label htmlFor="portfolio-title-id" className="block text-xs font-semibold uppercase tracking-wider text-[#1E1F24]">
                    Judul Proyek (ID) *
                  </label>
                  <input
                    id="portfolio-title-id"
                    type="text"
                    placeholder="Contoh: Universitas Negeri Semarang (UNNES)"
                    {...register("titleId")}
                    className={`w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-[#1E1F24] ${
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
                  <label htmlFor="portfolio-title-en" className="block text-xs font-semibold uppercase tracking-wider text-[#1E1F24]">
                    Project Title (EN)
                  </label>
                  <input
                    id="portfolio-title-en"
                    type="text"
                    placeholder="Project title in English..."
                    {...register("titleEn")}
                    className="w-full rounded-lg border border-[#E2E4EB] bg-white px-3.5 py-2 text-sm text-[#1E1F24]"
                  />
                </div>
              )}

              {activeTab === "zh" && (
                <div className="space-y-1.5">
                  <label htmlFor="portfolio-title-zh" className="block text-xs font-semibold uppercase tracking-wider text-[#1E1F24]">
                    项目名称 (ZH)
                  </label>
                  <input
                    id="portfolio-title-zh"
                    type="text"
                    placeholder="中文项目名称..."
                    {...register("titleZh")}
                    className="w-full rounded-lg border border-[#E2E4EB] bg-white px-3.5 py-2 text-sm text-[#1E1F24]"
                  />
                </div>
              )}

              {/* Location & Status Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="portfolio-location" className="block text-xs font-semibold uppercase tracking-wider text-[#1E1F24]">
                    Lokasi Proyek *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#62636C]" />
                    <input
                      id="portfolio-location"
                      type="text"
                      placeholder="Contoh: Semarang, Jawa Tengah"
                      {...register("location")}
                      className={`w-full rounded-lg border bg-white pl-9 pr-3.5 py-2 text-sm text-[#1E1F24] ${
                        errors.location ? "border-red-500" : "border-[#E2E4EB]"
                      }`}
                    />
                  </div>
                  {errors.location && (
                    <p className="text-xs text-red-500">{errors.location.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="portfolio-status" className="block text-xs font-semibold uppercase tracking-wider text-[#1E1F24]">
                    Status Publikasi
                  </label>
                  <select
                    id="portfolio-status"
                    {...register("status")}
                    className="w-full rounded-lg border border-[#E2E4EB] bg-white px-3 py-2 text-sm text-[#1E1F24]"
                  >
                    <option value="published">Tayang (Published)</option>
                    <option value="draft">Draft (Disembunyikan)</option>
                  </select>
                </div>
              </div>

              {/* Cover Image URL */}
              <div className="space-y-1.5">
                <label htmlFor="portfolio-cover" className="block text-xs font-semibold uppercase tracking-wider text-[#1E1F24]">
                  URL Gambar Utama (Cover Image) *
                </label>
                <input
                  id="portfolio-cover"
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  {...register("coverImageUrl")}
                  className={`w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-[#1E1F24] ${
                    errors.coverImageUrl ? "border-red-500" : "border-[#E2E4EB]"
                  }`}
                />
                {errors.coverImageUrl && (
                  <p className="text-xs text-red-500">{errors.coverImageUrl.message}</p>
                )}
              </div>

              {/* Gallery Image URLs */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Images className="h-4 w-4 text-[#20449A]" />
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E1F24]">
                    Foto Galeri Tambahan (One-to-Many Relasi)
                  </label>
                </div>
                <textarea
                  rows={3}
                  placeholder="Masukkan 1 URL per baris untuk galeri foto pendukung..."
                  {...register("galleryUrlsString")}
                  className="w-full rounded-lg border border-[#E2E4EB] bg-white px-3.5 py-2 text-sm text-[#1E1F24] font-mono text-xs"
                />
                <p className="text-[11px] text-[#62636C]">
                  Pisahkan beberapa URL dengan menekan enter (satu baris satu link gambar).
                </p>
              </div>

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
                  ) : editingItem ? (
                    "Simpan Perubahan"
                  ) : (
                    "Tambah Portofolio"
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
        title="Hapus Portofolio Proyek"
        description={`Apakah Anda yakin ingin menghapus portofolio "${deleteTarget?.titleI18n?.id}"? Semua galeri foto terkait juga akan dihapus.`}
        confirmLabel="Hapus Portofolio"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
