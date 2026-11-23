"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Images, Loader2, Sparkles, ExternalLink, Clock, Check, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable, ColumnDef } from "@/components/admin/data-table";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { getCarouselsAdmin, deleteCarousel, getCarouselInterval, updateCarouselInterval } from "@/actions/carousel";
import { MediaGuideCard } from "@/components/admin/media-guide-card";

export default function AdminCarouselPage() {
  const router = useRouter();
  const [items, setItems] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [deleteTarget, setDeleteTarget] = React.useState<any | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [carouselInterval, setCarouselInterval] = React.useState<number>(6);
  const [isSavingInterval, setIsSavingInterval] = React.useState(false);

  const loadData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const [res, intervalRes] = await Promise.all([
        getCarouselsAdmin(),
        getCarouselInterval(),
      ]);
      if (res.success && res.data) {
        setItems(res.data);
      }
      if (intervalRes.success && intervalRes.interval) {
        setCarouselInterval(intervalRes.interval);
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

  const handleSaveInterval = async (val?: number) => {
    const targetVal = val !== undefined ? val : carouselInterval;
    setIsSavingInterval(true);
    try {
      const res = await updateCarouselInterval(targetVal);
      if (res.success) {
        toast.success(res.message);
        setCarouselInterval(targetVal);
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Gagal menyimpan durasi slider");
    } finally {
      setIsSavingInterval(false);
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

      {/* 1. Best Practice Media Guide */}
      <MediaGuideCard type="carousel" />

      {/* 2. Pengaturan Waktu Jeda Rotasi Slider */}
      <div className="rounded-2xl border border-[#E2E4EB] bg-white p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EEF2FA] text-[#20449A]">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#1E1F24]">
                  Waktu Jeda Penggantian Carousel (Durasi Tayang)
                </h3>
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                  Aktif: {carouselInterval} Detik
                </span>
              </div>
              <p className="text-xs text-[#62636C] mt-0.5">
                Atur berapa lama setiap slide banner ditampilkan di beranda sebelum otomatis berotasi ke slide berikutnya (Rekomendasi: 6–8 detik).
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:self-end lg:self-center">
            {/* Quick Preset Buttons */}
            <div className="inline-flex items-center rounded-xl border border-[#E2E4EB] bg-[#F9F9FB] p-1">
              {[4, 6, 8, 10].map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => {
                    setCarouselInterval(sec);
                    handleSaveInterval(sec);
                  }}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    carouselInterval === sec
                      ? "bg-[#20449A] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {sec}s {sec === 6 ? "(Standar)" : ""}
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div className="flex items-center gap-2">
              <div className="relative w-24">
                <input
                  type="number"
                  min={3}
                  max={30}
                  value={carouselInterval}
                  onChange={(e) => setCarouselInterval(Math.max(3, Math.min(30, Number(e.target.value) || 6)))}
                  className="w-full rounded-xl border border-[#E2E4EB] px-3 py-1.5 text-xs font-bold text-center text-[#1E1F24] focus:border-[#20449A] focus:outline-none"
                />
                <span className="absolute right-2.5 top-2 text-[10px] text-slate-400 font-semibold pointer-events-none">
                  dtk
                </span>
              </div>

              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={() => handleSaveInterval()}
                disabled={isSavingInterval}
                className="h-8.5 rounded-xl text-xs font-bold bg-[#20449A] hover:bg-[#1A3880]"
              >
                {isSavingInterval ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <>
                    <Save className="h-3.5 w-3.5 mr-1" />
                    Simpan
                  </>
                )}
              </Button>
            </div>
          </div>
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
