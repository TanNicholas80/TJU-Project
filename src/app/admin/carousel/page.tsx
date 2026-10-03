"use client";

import * as React from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Images, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable, ColumnDef } from "@/components/admin/data-table";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import {
  getCarouselsAdmin,
  createCarousel,
  updateCarousel,
  deleteCarousel,
  CarouselInput,
} from "@/actions/carousel";

const carouselFormSchema = z.object({
  imageUrl: z.string().min(1, "URL Gambar banner wajib diisi"),
  subheaderId: z.string().optional(),
  titleId: z.string().min(3, "Judul banner wajib diisi"),
  descriptionId: z.string().optional(),
  loadingTitleId: z.string().optional(),
  sortOrder: z.coerce.number().default(0),
  isActive: z.boolean().default(true),
});

type CarouselFormData = z.infer<typeof carouselFormSchema>;

export default function AdminCarouselPage() {
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
    reset,
    formState: { errors },
  } = useForm<CarouselFormData>({
    resolver: zodResolver(carouselFormSchema) as any,
    defaultValues: {
      imageUrl: "",
      subheaderId: "SOLUSI TERINTEGRASI",
      titleId: "",
      descriptionId: "",
      loadingTitleId: "Balance",
      sortOrder: 1,
      isActive: true,
    },
  });

  const loadData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getCarouselsAdmin();
      if (res.success && res.data) {
        setItems(res.data);
      }
    } catch {
      toast.error("Gagal memuat banner carousel");
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
      imageUrl: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1920&q=80",
      subheaderId: "SOLUSI TERINTEGRASI",
      titleId: "",
      descriptionId: "",
      loadingTitleId: "Balance",
      sortOrder: items.length + 1,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    reset({
      imageUrl: item.imageUrl || "",
      subheaderId: item.subheaderI18n?.id || item.subheaderI18n?.en || "SOLUSI TERINTEGRASI",
      titleId: item.titleI18n?.id || "",
      descriptionId: item.descriptionI18n?.id || item.subtitleI18n?.id || "",
      loadingTitleId: item.loadingTitleI18n?.id || item.loadingTitleI18n?.en || "",
      sortOrder: item.sortOrder || 1,
      isActive: Boolean(item.isActive),
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (data: CarouselFormData) => {
    setIsSubmitting(true);
    try {
      let res;
      if (editingItem) {
        res = await updateCarousel(editingItem.id, data as CarouselInput);
      } else {
        res = await createCarousel(data as CarouselInput);
      }

      if (res.success) {
        toast.success(res.message || "Berhasil menyimpan banner");
        setIsModalOpen(false);
        loadData();
      } else {
        toast.error("Gagal, terjadi kesalahan: " + res.message);
      }
    } catch (err: any) {
      toast.error("Gagal menyimpan data: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await deleteCarousel(deleteTarget.id);
      if (res.success) {
        toast.success("Berhasil menghapus banner");
        setDeleteTarget(null);
        loadData();
      } else {
        toast.error("Gagal menghapus: " + res.message);
      }
    } catch {
      toast.error("Gagal menghapus banner");
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      header: "Banner Slide",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-lg bg-zinc-900 border border-[#E2E4EB]">
            {row.imageUrl ? (
              <Image
                src={row.imageUrl}
                alt="Banner"
                fill
                sizes="80px"
                className="object-cover"
              />
            ) : (
              <Images className="h-6 w-6 text-white m-auto" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#F48902]">
                {row.subheaderI18n?.id || "SOLUSI"}
              </span>
              <span className="text-zinc-300">•</span>
              <span className="text-[11px] font-semibold text-[#20449A]">
                Tab: {row.loadingTitleI18n?.id || "Strength/Structure/Balance"}
              </span>
            </div>
            <p className="font-bold text-[#1E1F24] line-clamp-1">
              {row.titleI18n?.id || "Tanpa Judul"}
            </p>
            <p className="text-xs text-[#62636C] line-clamp-1">
              {row.descriptionI18n?.id || row.subtitleI18n?.id || ""}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Tab Bawah",
      cell: (row) => (
        <span className="inline-flex items-center rounded-md bg-[#EEF2FA] px-2.5 py-1 text-xs font-bold text-[#20449A]">
          {row.loadingTitleI18n?.id || "-"}
        </span>
      ),
    },
    {
      header: "Urutan",
      cell: (row) => (
        <span className="font-semibold text-xs text-[#20449A]">
          #{row.sortOrder}
        </span>
      ),
    },
    {
      header: "Status",
      cell: (row) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
            row.isActive
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-zinc-100 text-zinc-600 border border-zinc-200"
          }`}
        >
          {row.isActive ? "Aktif" : "Non-aktif"}
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
            title="Edit Slide"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget(row)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-white text-red-600 hover:bg-red-50 transition-colors"
            title="Hapus Slide"
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
            Hero Carousel Slider
          </h2>
          <p className="text-sm text-[#62636C]">
            Atur slider gambar banner utama (gambar, title, subheader, description, dan loading title) pada beranda.
          </p>
        </div>

        <Button
          variant="orange"
          size="default"
          onClick={handleOpenCreate}
          className="font-semibold shadow-xs shrink-0"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Tambah Slide Baru
        </Button>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-[#E2E4EB] bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-[#20449A]" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={items}
          searchPlaceholder="Cari judul slide..."
          emptyTitle="Belum ada slide carousel"
          emptyDescription="Tambahkan slide banner untuk menyapa calon klien di beranda."
          addNewLabel="Tambah Slide Baru"
          onAddNew={handleOpenCreate}
        />
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="relative my-8 w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-[#E2E4EB] max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#E2E4EB] px-6 py-4 bg-[#F9F9FB]">
              <h3 className="text-lg font-bold text-[#1E1F24]">
                {editingItem ? "Edit Slide Carousel" : "Tambah Slide Baru"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-[#62636C] hover:bg-[#E2E4EB]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex-1 overflow-y-auto p-6 space-y-4"
            >
              {/* URL GAMBAR */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase text-[#1E1F24]">
                  URL Gambar Banner (1920x1080) *
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  {...register("imageUrl")}
                  className={`w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-[#1E1F24] ${
                    errors.imageUrl ? "border-red-500" : "border-[#E2E4EB]"
                  }`}
                />
                {errors.imageUrl && (
                  <p className="text-xs text-red-500">{errors.imageUrl.message}</p>
                )}
              </div>

              {/* SUBHEADER & LOADING TITLE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase text-[#1E1F24]">
                    Subheader (Sebelah Garis Oranye)
                  </label>
                  <input
                    type="text"
                    placeholder="SOLUSI TERINTEGRASI"
                    {...register("subheaderId")}
                    className="w-full rounded-lg border border-[#E2E4EB] bg-white px-3.5 py-2 text-sm text-[#1E1F24]"
                  />
                  <p className="text-[11px] text-zinc-500">
                    Contoh: SOLUSI TERINTEGRASI, REKAYASA STRUKTURAL
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase text-[#1E1F24]">
                    Loading Title (Tab Bawah dengan Progress Bar)
                  </label>
                  <input
                    type="text"
                    placeholder="Balance / Strength / Structure"
                    {...register("loadingTitleId")}
                    className="w-full rounded-lg border border-[#E2E4EB] bg-white px-3.5 py-2 text-sm text-[#1E1F24]"
                  />
                  <p className="text-[11px] text-zinc-500">
                    Nama singkat tab di bagian bawah banner
                  </p>
                </div>
              </div>

              {/* TITLE */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase text-[#1E1F24]">
                  Headline / Title Utama *
                </label>
                <input
                  type="text"
                  placeholder="Solusi Optimal. Efisiensi & Estetika."
                  {...register("titleId")}
                  className={`w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-[#1E1F24] ${
                    errors.titleId ? "border-red-500" : "border-[#E2E4EB]"
                  }`}
                />
                {errors.titleId && (
                  <p className="text-xs text-red-500">{errors.titleId.message}</p>
                )}
              </div>

              {/* DESCRIPTION */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase text-[#1E1F24]">
                  Description / Paragraf Deskripsi *
                </label>
                <textarea
                  rows={3}
                  placeholder="Menyeimbangkan efisiensi biaya, kecepatan pemasangan, dan keindahan arsitektural..."
                  {...register("descriptionId")}
                  className="w-full rounded-lg border border-[#E2E4EB] bg-white px-3.5 py-2 text-sm text-[#1E1F24]"
                />
              </div>

              {/* SORT ORDER & ACTIVE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase text-[#1E1F24]">
                    Nomor Urut Tampil
                  </label>
                  <input
                    type="number"
                    {...register("sortOrder")}
                    className="w-full rounded-lg border border-[#E2E4EB] bg-white px-3.5 py-2 text-sm text-[#1E1F24]"
                  />
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="isActive"
                    {...register("isActive")}
                    className="h-4 w-4 rounded border-zinc-300 text-[#20449A] focus:ring-[#20449A]"
                  />
                  <label
                    htmlFor="isActive"
                    className="text-sm font-semibold text-[#1E1F24]"
                  >
                    Tampilkan Slide di Beranda
                  </label>
                </div>
              </div>

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
                    "Tambah Slide"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Hapus Slide Banner"
        description="Apakah Anda yakin ingin menghapus banner ini dari slider beranda?"
        confirmLabel="Hapus Banner"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
