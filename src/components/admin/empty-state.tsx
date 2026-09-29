import * as React from "react";
import { FolderOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export function EmptyState({
  title = "Belum ada data",
  description = "Mulai tambahkan data pertama Anda untuk menampilkannya di halaman publik.",
  actionLabel = "Tambah Data Baru",
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#E2E4EB] bg-white p-12 text-center my-6 shadow-xs animate-in fade-in duration-300">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EEF2FA] text-[#20449A] mb-4 shadow-inner">
        {icon || <FolderOpen className="h-8 w-8 text-[#20449A]" />}
      </div>
      <h3 className="text-lg font-bold text-[#1E1F24]">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-[#62636C] leading-relaxed">
        {description}
      </p>
      {onAction && (
        <div className="mt-6">
          <Button
            variant="orange"
            size="default"
            onClick={onAction}
            className="font-semibold shadow-sm hover:scale-105 transition-transform"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
