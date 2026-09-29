"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Award, Loader2, ShieldCheck, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable, ColumnDef } from "@/components/admin/data-table";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import {
  getStandardsAdmin,
  createStandard,
  updateStandard,
  deleteStandard,
  StandardInput,
} from "@/actions/standards";

const standardFormSchema = z.object({
  iconName: z.string().min(1, "Pilih nama ikon"),
  titleId: z.string().min(3, "Judul pilar mutu wajib diisi"),
  titleEn: z.string().optional(),
  titleZh: z.string().optional(),
  descriptionId: z.string().min(5, "Deskripsi pilar mutu wajib diisi"),
  descriptionEn: z.string().optional(),
  descriptionZh: z.string().optional(),
  sortOrder: z.coerce.number().default(0),
  isActive: z.boolean().default(true),
});

type StandardFormData = z.infer<typeof standardFormSchema>;

export default function AdminStandardsPage() {
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
  } = useForm<StandardFormData>({
    resolver: zodResolver(standardFormSchema) as any,
    defaultValues: {
      iconName: "ShieldCheck",
      titleId: "",
      titleEn: "",
      titleZh: "",
      descriptionId: "",
      descriptionEn: "",
      descriptionZh: "",
      sortOrder: 1,
      isActive: true,
    },
  });

  const loadData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getStandardsAdmin();
      if (res.success && res.data) {
        setItems(res.data);
      }
    } catch {
      toast.error("Gagal memuat standar mutu");
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
      iconName: "ShieldCheck",
      titleId: "",
      titleEn: "",
      titleZh: "",
      descriptionId: "",
      descriptionEn: "",
      descriptionZh: "",
      sortOrder: items.length + 1,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    reset({
      iconName: item.iconName || "ShieldCheck",
      titleId: item.titleI18n?.id || "",
      titleEn: item.titleI18n?.en || "",
      titleZh: item.titleI18n?.zh || "",
      descriptionId: item.descriptionI18n?.id || "",
      descriptionEn: item.descriptionI18n?.en || "",
      descriptionZh: item.descriptionI18n?.zh || "",
      sortOrder: item.sortOrder || 1,
      isActive: Boolean(item.isActive),
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (data: StandardFormData) => {
    setIsSubmitting(true);
    try {
      let res;
      if (editingItem) {
        res = await updateStandard(editingItem.id, data as StandardInput);
      } else {
        res = await createStandard(data as StandardInput);
      }

      if (res.success) {
        toast.success(res.message || "Berhasil menyimpan standar mutu");
        setIsModalOpen(false);
        loadData();
      } else {
        toast.error("Gagal: " + res.message);
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
      const res = await deleteStandard(deleteTarget.id);
      if (res.success) {
        toast.success("Berhasil menghapus standar kualitas");
        setDeleteTarget(null);
        loadData();
      } else {
        toast.error("Gagal menghapus: " + res.message);
      }
    } catch {
      toast.error("Gagal menghapus standar");
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      header: "Standar Mutu",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EEF2FA] text-[#20449A]">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <p className="font-bold text-[#1E1F24]">
              {row.titleI18n?.id || "Tanpa Judul"}
            </p>
            <p className="text-xs text-[#62636C] line-clamp-1">
              {row.descriptionI18n?.id || ""}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Ikon",
      cell: (row) => (
        <span className="rounded bg-zinc-100 px-2.5 py-1 text-xs font-mono text-zinc-700">
          {row.iconName}
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
            title="Edit Standar"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget(row)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-white text-red-600 hover:bg-red-50 transition-colors"
            title="Hapus Standar"
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
            Standar Kualitas & Rekayasa
          </h2>
          <p className="text-sm text-[#62636C]">
            Atur pilar keunggulan teknis, sertifikasi SNI, dan standar software komputasi atap.
          </p>
        </div>

        <Button
          variant="orange"
          size="default"
          onClick={handleOpenCreate}
          className="font-semibold shadow-xs shrink-0"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Tambah Standar Mutu
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
          searchPlaceholder="Cari standar mutu..."
          emptyTitle="Belum ada standar mutu"
          emptyDescription="Tambahkan pilar jaminan kualitas untuk meningkatkan kepercayaan calon pembeli."
          addNewLabel="Tambah Standar Mutu"
          onAddNew={handleOpenCreate}
        />
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="relative my-8 w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-[#E2E4EB] max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#E2E4EB] px-6 py-4 bg-[#F9F9FB]">
              <h3 className="text-lg font-bold text-[#1E1F24]">
                {editingItem ? "Edit Standar Kualitas" : "Tambah Standar Mutu Baru"}
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
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase text-[#1E1F24]">
                  Ikon Lucide
                </label>
                <select
                  {...register("iconName")}
                  className="w-full rounded-lg border border-[#E2E4EB] bg-white px-3 py-2 text-sm text-[#1E1F24]"
                >
                  <option value="ShieldCheck">ShieldCheck (Perlindungan/SNI)</option>
                  <option value="Calculator">Calculator (Analisis Software)</option>
                  <option value="Award">Award (Garansi & K3)</option>
                  <option value="Cpu">Cpu (Teknologi/Komputasi)</option>
                  <option value="CheckCircle2">CheckCircle2 (Terverifikasi)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase text-[#1E1F24]">
                  Judul Standar Mutu (ID) *
                </label>
                <input
                  type="text"
                  placeholder="Standar Baja Cold-Formed G550..."
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
                <label className="block text-xs font-semibold uppercase text-[#1E1F24]">
                  Deskripsi Keunggulan Teknis (ID) *
                </label>
                <textarea
                  rows={3}
                  placeholder="Penjelasan kuat tarik, lapisan pelindung anti-karat AZ100..."
                  {...register("descriptionId")}
                  className={`w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-[#1E1F24] ${
                    errors.descriptionId ? "border-red-500" : "border-[#E2E4EB]"
                  }`}
                />
                {errors.descriptionId && (
                  <p className="text-xs text-red-500">
                    {errors.descriptionId.message}
                  </p>
                )}
              </div>

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
                    id="isStandardActive"
                    {...register("isActive")}
                    className="h-4 w-4 rounded border-zinc-300 text-[#20449A] focus:ring-[#20449A]"
                  />
                  <label
                    htmlFor="isStandardActive"
                    className="text-sm font-semibold text-[#1E1F24]"
                  >
                    Tampilkan di Grid Beranda
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
                    "Tambah Standar"
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
        title="Hapus Standar Mutu"
        description="Apakah Anda yakin ingin menghapus standar kualitas ini?"
        confirmLabel="Hapus Standar"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
