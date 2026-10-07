"use client";

import * as React from "react";
import Image from "next/image";
import {
  Upload,
  X,
  Loader2,
  Image as ImageIcon,
  Link as LinkIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface GalleryUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  label?: string;
  description?: string;
  maxFiles?: number;
  folder?: string;
}

export function GalleryUpload({
  value = [],
  onChange,
  label = "Foto Galeri Tambahan Proyek",
  description = "Unggah multiple foto dokumentasi proyek rangka atap (Maks. 12 foto, masing-masing maks. 5MB)",
  maxFiles = 12,
  folder = "portfolio-gallery",
}: GalleryUploadProps) {
  const [isUploading, setIsUploading] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const [showUrlInput, setShowUrlInput] = React.useState(false);
  const [urlInput, setUrlInput] = React.useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const uploadSingleFile = async (file: File): Promise<string | null> => {
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      toast.error(`Format file "${file.name}" tidak didukung.`);
      return null;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(`Ukuran file "${file.name}" melebihi batas 5MB`);
      return null;
    }

    const formData = new FormData();
    formData.append("file", file);
    if (folder) {
      formData.append("folder", folder);
    }

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        return data.url;
      }
      toast.error(data.message || `Gagal mengunggah "${file.name}"`);
      return null;
    } catch (err: any) {
      toast.error(`Gagal mengunggah "${file.name}": ${err.message}`);
      return null;
    }
  };

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    const remainingSlots = maxFiles - value.length;
    if (remainingSlots <= 0) {
      toast.error(`Batas maksimum ${maxFiles} foto galeri telah tercapai`);
      return;
    }

    const filesToUpload = fileArray.slice(0, remainingSlots);
    setIsUploading(true);

    try {
      const uploadedUrls: string[] = [];
      for (const file of filesToUpload) {
        const url = await uploadSingleFile(file);
        if (url) {
          uploadedUrls.push(url);
        }
      }

      if (uploadedUrls.length > 0) {
        onChange([...value, ...uploadedUrls]);
        toast.success(`Berhasil menambahkan ${uploadedUrls.length} foto ke galeri`);
      }
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleAddUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    if (value.length >= maxFiles) {
      toast.error(`Batas maksimum ${maxFiles} foto galeri telah tercapai`);
      return;
    }
    onChange([...value, trimmed]);
    setUrlInput("");
    setShowUrlInput(false);
    toast.success("URL foto berhasil ditambahkan ke galeri");
  };

  const handleRemove = (index: number) => {
    const updated = value.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleMove = (index: number, direction: "prev" | "next") => {
    const targetIndex = direction === "prev" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= value.length) return;
    const copy = [...value];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIndex, 0, moved);
    onChange(copy);
  };

  const handleClearAll = () => {
    if (confirm("Hapus seluruh foto galeri tambahan ini?")) {
      onChange([]);
    }
  };

  return (
    <div className="space-y-3">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E1F24]">
            {label}
          </label>
          <span className="rounded-full bg-[#EEF2FA] px-2 py-0.5 text-[11px] font-bold text-[#20449A]">
            {value.length} / {maxFiles}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-xs text-[#20449A] hover:underline flex items-center gap-1 font-medium cursor-pointer"
          >
            <LinkIcon className="h-3 w-3" />
            {showUrlInput ? "Tutup URL" : "+ URL Manual"}
          </button>

          {value.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="text-xs text-red-600 hover:underline flex items-center gap-1 font-medium cursor-pointer"
            >
              <Trash2 className="h-3 w-3" />
              Hapus Semua
            </button>
          )}
        </div>
      </div>

      {description && <p className="text-xs text-[#62636C]">{description}</p>}

      {/* Manual URL Input Bar */}
      {showUrlInput && (
        <div className="flex items-center gap-2 p-2 bg-[#F9F9FB] rounded-lg border border-[#E2E4EB]">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddUrl();
              }
            }}
            placeholder="https://images.unsplash.com/... atau URL gambar publik"
            className="flex-1 bg-white border border-[#E2E4EB] rounded-md px-3 py-1.5 text-xs text-[#1E1F24] focus:outline-none focus:ring-1 focus:ring-[#20449A]"
          />
          <Button
            type="button"
            size="sm"
            variant="default"
            onClick={handleAddUrl}
            disabled={!urlInput.trim()}
            className="h-8 text-xs bg-[#20449A] hover:bg-[#1a3880]"
          >
            Tambah ke Galeri
          </Button>
        </div>
      )}

      {/* Upload Drag & Drop Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => {
          if (!isUploading && fileInputRef.current) {
            fileInputRef.current.click();
          }
        }}
        className={`relative flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed transition-all cursor-pointer ${
          isDragging
            ? "border-[#20449A] bg-[#EEF2FA]"
            : "border-[#E2E4EB] bg-[#F9F9FB] hover:border-[#20449A]/50 hover:bg-[#F4F6FC]"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/svg+xml"
          multiple
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading || value.length >= maxFiles}
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-2 py-2">
            <Loader2 className="h-8 w-8 animate-spin text-[#20449A]" />
            <p className="text-xs font-medium text-[#20449A]">Sedang mengunggah foto...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-xs border border-[#E2E4EB]">
              <Upload className="h-5 w-5 text-[#20449A]" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#1E1F24]">
                Tarik & letakkan foto di sini, atau{" "}
                <span className="text-[#20449A] underline">pilih dari komputer</span>
              </p>
              <p className="text-[11px] text-[#62636C] mt-0.5">
                Mendukung unggah banyak foto sekaligus (Multiple files)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Grid of Uploaded Gallery Thumbnails */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-1">
          {value.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="group relative h-24 sm:h-28 rounded-xl overflow-hidden border border-[#E2E4EB] bg-slate-900 shadow-xs"
            >
              <Image
                src={url}
                alt={`Galeri ${index + 1}`}
                fill
                sizes="150px"
                className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
              />

              {/* Number Badge */}
              <div className="absolute top-1.5 left-1.5 z-10">
                <span className="rounded bg-black/75 px-1.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
                  #{index + 1}
                </span>
              </div>

              {/* Overlay with Action Controls */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2 z-10">
                {/* Move Left */}
                {index > 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMove(index, "prev");
                    }}
                    title="Geser ke kiri"
                    className="flex h-7 w-7 items-center justify-center rounded-md bg-white/90 text-slate-800 hover:bg-white hover:text-[#20449A] transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                )}

                {/* Remove */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(index);
                  }}
                  title="Hapus foto"
                  className="flex h-7 w-7 items-center justify-center rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>

                {/* Move Right */}
                {index < value.length - 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMove(index, "next");
                    }}
                    title="Geser ke kanan"
                    className="flex h-7 w-7 items-center justify-center rounded-md bg-white/90 text-slate-800 hover:bg-white hover:text-[#20449A] transition-colors cursor-pointer"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
