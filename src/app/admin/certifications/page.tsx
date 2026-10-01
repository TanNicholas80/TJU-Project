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
  Award,
  Loader2,
  Globe,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable, ColumnDef } from "@/components/admin/data-table";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { ImageUpload } from "@/components/admin/image-upload";
import {
  getCertificationsAdmin,
  createCertification,
  updateCertification,
  deleteCertification,
  CertificationInput,
} from "@/actions/certifications";

const certificationFormSchema = z.object({
  titleId: z.string().min(2, "Nama sertifikat Bahasa Indonesia wajib diisi"),
  titleEn: z.string().optional(),
  titleZh: z.string().optional(),
  imageUrl: z.string().min(1, "Logo / gambar sertifikasi wajib diisi"),
  sortOrder: z.coerce.number().default(0),
  isActive: z.boolean().default(true),
});

type CertificationFormData = z.infer<typeof certificationFormSchema>;

export default function AdminCertificationsPage() {
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
    reset,
    control,
    formState: { errors },
  } = useForm<CertificationFormData>({
    resolver: zodResolver(certificationFormSchema) as any,
    defaultValues: {
      titleId: "",
      titleEn: "",
      titleZh: "",
      imageUrl: "",
      sortOrder: 1,
      isActive: true,
    },
  });

  const loadData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getCertificationsAdmin();
      if (res.success && res.data) {
        setItems(res.data);
      }
    } catch {
      toast.error("Gagal memuat sertifikasi");
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
      titleId: "",
      titleEn: "",
      titleZh: "",
      imageUrl: "",
      sortOrder: items.length + 1,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setActiveTab("id");
    reset({
      titleId: item.titleI18n?.id || "",
      titleEn: item.titleI18n?.en || "",
      titleZh: item.titleI18n?.zh || "",
      imageUrl: item.imageUrl || "",
      sortOrder: item.sortOrder || 1,
      isActive: Boolean(item.isActive ?? true),
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (data: CertificationFormData) => {
    setIsSubmitting(true);
    try {
      let res;
      if (editingItem) {
        res = await updateCertification(editingItem.id, data as CertificationInput);
      } else {
        res = await createCertification(data as CertificationInput);
      }

      if (res.success) {
        toast.success(res.message || "Berhasil menyimpan sertifikasi");
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
      const res = await deleteCertification(deleteTarget.id);
      if (res.success) {
        toast.success("Berhasil menghapus sertifikasi");
        setDeleteTarget(null);
        loadData();
      } else {
        toast.error("Gagal menghapus: " + res.message);
      }
    } catch {
      toast.error("Gagal menghapus sertifikasi");
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      header: "Logo & Sertifikat",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <div className="relative flex h-14 w-16 shrink-0 items-center justify-center rounded-xl bg-[#20449A]/10 p-2 border border-[#E2E4EB]">
            {row.imageUrl ? (
              <Image
                src={row.imageUrl}
                alt="Logo"
                width={50}
                height={50}
                className="max-h-10 w-auto object-contain"
              />
            ) : (
              <ShieldCheck className="h-6 w-6 text-[#20449A]" />
            )}
          </div>
          <div>
            <p className="font-bold text-[#1E1F24] line-clamp-1">
              {row.titleI18n?.id || "Tanpa Judul"}
            </p>
            <p className="text-xs text-[#62636C] line-clamp-1">
              EN: {row.titleI18n?.en || "-"} | ZH: {row.titleI18n?.zh || "-"}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Urutan",
      cell: (row) => (
        <span className="font-bold text-xs text-[#20449A] bg-[#EEF2FA] px-2.5 py-1 rounded-md">
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
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E2E4EB] bg-white text-[#20449A] hover:bg-[#EEF2FA] transition-colors cursor-pointer"
            title="Edit Sertifikasi"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget(row)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-white text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            title="Hapus Sertifikasi"
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
            Sertifikasi & Standar Mutu
          </h2>
          <p className="text-sm text-[#62636C]">
            Kelola logo akreditasi dan sertifikasi (HAKI, ISO, SNI, TKDN, dll) yang ditampilkan di halaman Tentang Kami.
          </p>
        </div>

        <Button
          variant="orange"
          size="default"
          onClick={handleOpenCreate}
          className="font-semibold shadow-xs shrink-0"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Tambah Sertifikasi
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
          searchPlaceholder="Cari nama sertifikasi..."
          emptyTitle="Belum ada logo sertifikasi"
          emptyDescription="Mulai tambahkan logo sertifikasi dan standar mutu resmi untuk membangun kepercayaan pelanggan di halaman publik."
          addNewLabel="Tambah Sertifikasi Baru"
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
                  {editingItem ? "Edit Sertifikasi" : "Tambah Sertifikasi Baru"}
                </h3>
                <p className="text-xs text-[#62636C]">
                  Lengkapi nama sertifikasi dalam multibahasa dan unggah logo
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
                  <span>Bahasa Nama Sertifikat:</span>
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

              {/* Title Inputs per Tab */}
              {activeTab === "id" && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E1F24]">
                    Nama Sertifikat (Bahasa Indonesia) *
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Standar Nasional Indonesia SNI 8399:2017"
                    {...register("titleId")}
                    className={`w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-[#1E1F24] focus:outline-none focus:ring-2 focus:ring-[#20449A] ${
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
                    Certificate Name (English)
                  </label>
                  <input
                    type="text"
                    placeholder="E.g. Indonesian National Standard SNI 8399:2017"
                    {...register("titleEn")}
                    className="w-full rounded-lg border border-[#E2E4EB] bg-white px-3.5 py-2 text-sm text-[#1E1F24] focus:outline-none focus:ring-2 focus:ring-[#20449A]"
                  />
                </div>
              )}

              {activeTab === "zh" && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E1F24]">
                    证书名称 (中文)
                  </label>
                  <input
                    type="text"
                    placeholder="例如: 印度尼西亚国家标准 SNI 8399:2017"
                    {...register("titleZh")}
                    className="w-full rounded-lg border border-[#E2E4EB] bg-white px-3.5 py-2 text-sm text-[#1E1F24] focus:outline-none focus:ring-2 focus:ring-[#20449A]"
                  />
                </div>
              )}

              {/* Logo Upload / URL */}
              <div className="pt-2">
                <Controller
                  control={control}
                  name="imageUrl"
                  render={({ field }) => (
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      label="Logo Sertifikasi (SVG atau PNG Transparan) *"
                      description="Gunakan logo putih atau transparan untuk kontras optimal di atas latar belakang biru."
                      error={errors.imageUrl?.message}
                      aspectRatio="square"
                    />
                  )}
                />
              </div>

              {/* Sort Order & Active Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E1F24]">
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
                    id="cert-isActive"
                    {...register("isActive")}
                    className="h-4 w-4 rounded border-zinc-300 text-[#20449A] focus:ring-[#20449A]"
                  />
                  <label
                    htmlFor="cert-isActive"
                    className="text-sm font-semibold text-[#1E1F24]"
                  >
                    Aktifkan di Halaman Publik
                  </label>
                </div>
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
                    "Tambah Sertifikasi"
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
        title="Hapus Logo Sertifikasi"
        description="Apakah Anda yakin ingin menghapus sertifikasi ini? Perubahan akan langsung tercermin di halaman publik Tentang Kami."
        confirmLabel="Hapus Sertifikasi"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
