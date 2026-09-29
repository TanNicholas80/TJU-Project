"use client";

import * as React from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "./empty-state";

export interface ColumnDef<T> {
  header: string;
  accessorKey?: keyof T | string;
  cell?: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  searchPlaceholder?: string;
  searchKey?: keyof T;
  emptyTitle?: string;
  emptyDescription?: string;
  onAddNew?: () => void;
  addNewLabel?: string;
  pageSize?: number;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  searchPlaceholder = "Cari data...",
  searchKey,
  emptyTitle = "Belum ada data",
  emptyDescription = "Mulai tambahkan data pertama Anda.",
  onAddNew,
  addNewLabel = "Tambah Data Baru",
  pageSize = 10,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);

  // Filter based on searchTerm
  const filteredData = React.useMemo(() => {
    if (!searchTerm.trim()) return data;
    const term = searchTerm.toLowerCase();

    return data.filter((item) => {
      if (searchKey && item[searchKey]) {
        return String(item[searchKey]).toLowerCase().includes(term);
      }
      return Object.values(item).some((val) => {
        if (typeof val === "string") return val.toLowerCase().includes(term);
        if (typeof val === "object" && val !== null) {
          return Object.values(val).some(
            (v) => typeof v === "string" && v.toLowerCase().includes(term)
          );
        }
        return false;
      });
    });
  }, [data, searchTerm, searchKey]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  return (
    <div className="space-y-4">
      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#62636C]" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-lg border border-[#E2E4EB] bg-white pl-9 pr-4 py-2 text-sm text-[#1E1F24] placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#20449A]/30 focus:border-[#20449A]"
          />
        </div>

        {onAddNew && (
          <Button
            variant="orange"
            size="default"
            onClick={onAddNew}
            className="font-semibold shadow-xs shrink-0"
          >
            {addNewLabel}
          </Button>
        )}
      </div>

      {/* Table Container */}
      {filteredData.length === 0 ? (
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
          actionLabel={addNewLabel}
          onAction={onAddNew}
        />
      ) : (
        <div className="rounded-xl border border-[#E2E4EB] bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[#E2E4EB] bg-[#F9F9FB] text-xs font-semibold uppercase tracking-wider text-[#62636C]">
                <tr>
                  {columns.map((col, idx) => (
                    <th key={idx} className={`px-6 py-4 ${col.className || ""}`}>
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E4EB]">
                {paginatedData.map((row, rowIdx) => (
                  <tr
                    key={row.id || rowIdx}
                    className="hover:bg-[#F9F9FB]/80 transition-colors"
                  >
                    {columns.map((col, colIdx) => (
                      <td
                        key={colIdx}
                        className={`px-6 py-4 text-[#1E1F24] ${col.className || ""}`}
                      >
                        {col.cell
                          ? col.cell(row)
                          : col.accessorKey
                          ? String(row[col.accessorKey] ?? "")
                          : null}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-[#E2E4EB] px-6 py-3 bg-[#F9F9FB]/50">
              <p className="text-xs text-[#62636C]">
                Menampilkan {(currentPage - 1) * pageSize + 1} -{" "}
                {Math.min(currentPage * pageSize, filteredData.length)} dari{" "}
                {filteredData.length} data
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="h-8 px-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-xs font-semibold px-2 text-[#1E1F24]">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="h-8 px-2"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
