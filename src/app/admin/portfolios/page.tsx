"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  Briefcase,
  Loader2,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable, ColumnDef } from "@/components/admin/data-table";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { getPortfoliosAdmin, deletePortfolio } from "@/actions/portfolios";

export default function AdminPortfoliosPage() {
  const router = useRouter();
  const [portfolios, setPortfolios] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Delete dialog state
  const [deleteTarget, setDeleteTarget] = React.useState<any | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

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

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await deletePortfolio(deleteTarget.id);
      if (res.success) {
        toast.success("Berhasil menghapus portofolio");
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
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-[#20449A] font-medium">
                {row.categoryName || "Konstruksi Rangka Atap"}
              </span>
              {row.titleI18n?.en && (
                <span className="text-[10px] bg-zinc-100 text-zinc-500 rounded px-1.5 py-0.2">
                  EN: {row.titleI18n.en}
                </span>
              )}
            </div>
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
          <Link
            href={`/portofolio/${row.id}`}
            target="_blank"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E2E4EB] bg-white text-slate-500 hover:bg-[#EEF2FA] hover:text-[#20449A] transition-colors"
            title="Lihat Halaman Publik"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
          <button
            type="button"
            onClick={() => router.push(`/admin/portfolios/${row.id}/edit`)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E2E4EB] bg-white text-[#20449A] hover:bg-[#EEF2FA] transition-colors cursor-pointer"
            title="Edit Portofolio"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget(row)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-white text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
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
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1E1F24]">
            Portofolio Proyek
          </h1>
          <p className="text-sm text-[#62636C]">
            Kelola dokumentasi proyek rangka atap baja ringan, foto galeri, dan lokasi proyek untuk showcase publik.
          </p>
        </div>

        <Button
          variant="orange"
          size="default"
          onClick={() => router.push("/admin/portfolios/create")}
          className="font-semibold shadow-xs shrink-0"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Tambah Portofolio
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
          data={portfolios}
          searchPlaceholder="Cari judul proyek, kategori, atau lokasi..."
          emptyTitle="Belum ada portofolio"
          emptyDescription="Mulai tambahkan dokumentasi proyek baru untuk menampilkan portofolio di website publik."
          addNewLabel="Tambah Portofolio Baru"
          onAddNew={() => router.push("/admin/portfolios/create")}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Hapus Data Portofolio"
        description={`Apakah Anda yakin ingin menghapus portofolio "${deleteTarget?.titleI18n?.id || "ini"}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Hapus Portofolio"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
