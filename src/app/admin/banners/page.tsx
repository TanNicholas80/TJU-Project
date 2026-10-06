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
  Bookmark,
  Loader2,
  ExternalLink,
  Building2,
  FileText,
  Layers,
  Phone,
  Globe,
  ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable, ColumnDef } from "@/components/admin/data-table";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { getAllBannersAdmin, deleteBanner } from "@/actions/banners";

export default function AdminBannersPage() {
  const router = useRouter();
  const [items, setItems] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [deleteTarget, setDeleteTarget] = React.useState<any | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const loadData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getAllBannersAdmin();
      if (res.success && res.data) {
        setItems(res.data);
      }
    } catch {
      toast.error("Gagal memuat daftar banner halaman");
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
      const res = await deleteBanner(deleteTarget.id);
      if (res.success) {
        toast.success("Berhasil menghapus banner halaman");
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

  const getPageBadge = (slug: string) => {
    switch (slug) {
      case "about-us":
      case "about":
        return {
          label: "About Us",
          color: "bg-blue-50 text-blue-700 border-blue-200",
          publicUrl: "/about",
        };
      case "blog":
        return {
          label: "Blog & Artikel",
          color: "bg-purple-50 text-purple-700 border-purple-200",
          publicUrl: "/blog",
        };
      case "portofolio":
      case "portfolio":
        return {
          label: "Portofolio Proyek",
          color: "bg-emerald-50 text-emerald-700 border-emerald-200",
          publicUrl: "/portofolio",
        };
      case "contact":
        return {
          label: "Contact Us",
          color: "bg-amber-50 text-amber-700 border-amber-200",
          publicUrl: "/contact",
        };
      default:
        return {
          label: slug,
          color: "bg-zinc-50 text-zinc-700 border-zinc-200",
          publicUrl: `/${slug}`,
        };
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      header: "Banner Preview",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="relative h-14 w-28 shrink-0 overflow-hidden rounded-xl bg-zinc-950 border border-[#E2E4EB] shadow-xs">
            {row.backgroundImageUrl ? (
              <Image
                src={row.backgroundImageUrl}
                alt="Banner"
                fill
                sizes="112px"
                className="object-cover filter brightness-75"
                unoptimized={
                  row.backgroundImageUrl.startsWith("http://localhost") ||
                  row.backgroundImageUrl.startsWith("/")
                }
              />
            ) : (
              <ImageIcon className="h-6 w-6 text-white/50 m-auto" />
            )}
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center p-1">
              <span className="text-[10px] font-bold text-white text-center line-clamp-1 drop-shadow-sm">
                {row.titleI18n?.id || "Banner"}
              </span>
            </div>
          </div>
          <div>
            <p className="font-bold text-[#1E1F24] line-clamp-1">
              {row.titleI18n?.id || "Tanpa Judul"}
            </p>
            <p className="text-xs text-[#62636C] font-mono">
              Key: /{row.pageSlug}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Target Halaman",
      cell: (row) => {
        const badge = getPageBadge(row.pageSlug);
        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold border ${badge.color}`}
          >
            {badge.label}
          </span>
        );
      },
    },
    {
      header: "Breadcrumb Navigasi",
      cell: (row) => (
        <span className="inline-flex items-center rounded-md bg-[#EEF2FA] px-2.5 py-1 text-xs font-medium text-[#20449A]">
          {row.breadcrumbI18n?.id || `Home > ${row.titleI18n?.id}`}
        </span>
      ),
    },
    {
      header: "Aksi",
      className: "text-right",
      cell: (row) => {
        const badge = getPageBadge(row.pageSlug);
        return (
          <div className="flex items-center justify-end gap-2">
            <Link
              href={badge.publicUrl}
              target="_blank"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E2E4EB] bg-white text-[#62636C] hover:bg-[#F9F9FB] hover:text-[#1E1F24] transition-colors shadow-xs"
              title="Buka Halaman Publik"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
            <Link
              href={`/admin/banners/${row.id}/edit`}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E2E4EB] bg-white text-[#20449A] hover:bg-[#EEF2FA] hover:border-[#20449A]/30 transition-colors shadow-xs"
              title="Edit Banner Halaman"
            >
              <Pencil className="h-3.5 w-3.5" />
            </Link>
            <button
              type="button"
              onClick={() => setDeleteTarget(row)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-white text-red-600 hover:bg-red-50 transition-colors shadow-xs"
              title="Hapus Banner"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-md bg-[#EEF2FA] px-2 py-0.5 text-[11px] font-bold text-[#20449A]">
              <Bookmark className="h-3 w-3 text-[#F48902]" /> Manajemen Navigasi & Header
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-[#1E1F24] tracking-tight mt-1">
            Banner Halaman Publik
          </h2>
          <p className="text-sm text-[#62636C]">
            Kelola foto background, headline, dan breadcrumb header untuk setiap halaman (About Us, Blog, Portfolio, Contact Us).
          </p>
        </div>

        <Link href="/admin/banners/create">
          <Button
            variant="orange"
            size="default"
            className="font-semibold text-xs h-10 shadow-xs shrink-0"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Tambah Banner Baru
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-[#E2E4EB] bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-[#20449A]" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={items}
          searchPlaceholder="Cari judul banner atau slug halaman..."
          emptyTitle="Belum ada banner halaman"
          emptyDescription="Tambahkan banner halaman untuk menyempurnakan tampilan header halaman publik."
          addNewLabel="Tambah Banner Baru"
          onAddNew={() => router.push("/admin/banners/create")}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
        title="Hapus Banner Halaman"
        description={`Apakah Anda yakin ingin menghapus banner halaman "${
          deleteTarget?.titleI18n?.id || deleteTarget?.pageSlug || "ini"
        }"? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Hapus Banner"
        cancelLabel="Batal"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
