"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Images, Loader2, Sparkles, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable, ColumnDef } from "@/components/admin/data-table";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { getCarouselsAdmin, deleteCarousel } from "@/actions/carousel";

export default function AdminCarouselPage() {
  const router = useRouter();
  const [items, setItems] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [deleteTarget, setDeleteTarget] = React.useState<any | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

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
          <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded-xl bg-zinc-950 border border-[#E2E4EB] shadow-xs">
            {row.imageUrl ? (
              <Image
                src={row.imageUrl}
                alt="Banner"
                fill
                sizes="96px"
                className="object-cover"
                unoptimized={row.imageUrl.startsWith("http://localhost") || row.imageUrl.startsWith("/")}
              />
            ) : (
              <Images className="h-6 w-6 text-white/50 m-auto" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#F48902]">
                {row.subheaderI18n?.id || "SOLUSI"}
              </span>
              <span className="text-zinc-300">•</span>
              <span className="text-[11px] font-semibold text-[#20449A]">
                Tab: {row.loadingTitleI18n?.id || "Strength"}
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
        <span className="inline-flex items-center rounded-lg bg-[#EEF2FA] px-2.5 py-1 text-xs font-bold text-[#20449A]">
          {row.loadingTitleI18n?.id || "-"}
        </span>
      ),
    },
    {
      header: "Urutan",
      cell: (row) => (
        <span className="font-bold text-xs text-[#20449A]">
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
          <Link
            href={`/admin/carousel/${row.id}/edit`}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E2E4EB] bg-white text-[#20449A] hover:bg-[#EEF2FA] hover:border-[#20449A]/30 transition-colors shadow-xs"
            title="Edit Slide (Halaman Terpisah)"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Link>
          <button
            type="button"
            onClick={() => setDeleteTarget(row)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-white text-red-600 hover:bg-red-50 transition-colors shadow-xs"
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
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-md bg-[#EEF2FA] px-2 py-0.5 text-[11px] font-bold text-[#20449A]">
              <Sparkles className="h-3 w-3 text-[#F48902]" /> Manajemen Beranda
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-[#1E1F24] tracking-tight mt-1">
            Hero Carousel Slider
          </h2>
          <p className="text-sm text-[#62636C]">
            Atur slider gambar banner utama (gambar, title, subheader, description, dan loading tab) dengan Live Preview interaktif.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/" target="_blank">
            <Button
              variant="outline"
              size="default"
              className="text-xs font-semibold h-10 border-[#E2E4EB]"
            >
              <ExternalLink className="h-3.5 w-3.5 mr-1.5 text-[#62636C]" />
              Lihat Beranda
            </Button>
          </Link>
          <Link href="/admin/carousel/create">
            <Button
              variant="orange"
              size="default"
              className="font-semibold text-xs h-10 shadow-xs shrink-0"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Tambah Slide Baru
            </Button>
          </Link>
        </div>
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
          emptyDescription="Tambahkan slide banner untuk menyapa calon klien di beranda dengan visual memukau."
          addNewLabel="Tambah Slide Baru"
          onAddNew={() => router.push("/admin/carousel/create")}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
        title="Hapus Slide Carousel"
        description={`Apakah Anda yakin ingin menghapus slide "${
          deleteTarget?.titleI18n?.id || "ini"
        }"? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Hapus Slide"
        cancelLabel="Batal"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
