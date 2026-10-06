"use client";

import * as React from "react";
import Image from "next/image";
import { Upload, X, Loader2, Image as ImageIcon, Link as LinkIcon, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  description?: string;
  error?: string;
  aspectRatio?: "video" | "square" | "wide";
  folder?: string;
}

export function ImageUpload({
  value,
  onChange,
  label = "Unggah Gambar",
  description = "Format JPG, PNG, WebP atau SVG (Maks. 5MB)",
  error,
  aspectRatio = "video",
  folder,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const [showUrlInput, setShowUrlInput] = React.useState(false);
  const [urlInput, setUrlInput] = React.useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    // Validasi tipe file
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      toast.error("Format file tidak didukung. Harap gunakan JPG, PNG, WebP, atau SVG.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file melebihi batas 5MB");
      return;
    }

    setIsUploading(true);
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
        onChange(data.url);
        toast.success(data.message || "Gambar berhasil diunggah");
      } else {
        toast.error(data.message || "Gagal mengunggah gambar");
      }
    } catch (err: any) {
      toast.error("Terjadi kesalahan saat mengunggah: " + err.message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
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
    const file = e.dataTransfer.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) return;
    onChange(urlInput.trim());
    setUrlInput("");
    setShowUrlInput(false);
    toast.success("URL gambar berhasil diterapkan");
  };

  const handleClear = () => {
    onChange("");
  };

  const ratioClass =
    aspectRatio === "square"
      ? "aspect-square max-w-[200px]"
      : aspectRatio === "wide"
      ? "aspect-21/9 max-w-full"
      : "aspect-16/9 max-w-full";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#1E1F24]">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-xs text-[#20449A] hover:underline flex items-center gap-1 font-medium cursor-pointer"
        >
          <LinkIcon className="h-3 w-3" />
          {showUrlInput ? "Tutup Input URL" : "Input URL Manual"}
        </button>
      </div>

      {showUrlInput && (
        <div className="flex items-center gap-2 p-2 bg-[#F9F9FB] rounded-lg border border-[#E2E4EB]">
          <input
            type="url"
            placeholder="https://example.com/image.jpg atau /images/..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="flex-1 rounded-md border border-[#E2E4EB] bg-white px-3 py-1.5 text-xs text-[#1E1F24]"
          />
          <Button
            type="button"
            size="sm"
            variant="orange"
            onClick={handleApplyUrl}
            className="h-8 text-xs font-semibold"
          >
            Terapkan
          </Button>
        </div>
      )}

      {value ? (
        <div className="relative group">
          <div
            className={`relative overflow-hidden rounded-xl border border-[#E2E4EB] bg-zinc-950 ${ratioClass}`}
          >
            <Image
              src={value}
              alt="Preview"
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-cover transition-transform group-hover:scale-105 duration-300"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="bg-white/95 text-[#1E1F24] hover:bg-white text-xs h-8 shadow-sm font-semibold"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                Ganti Gambar
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="text-xs h-8 text-red-600 bg-white/95 border-red-200 hover:bg-red-50 hover:text-red-700 shadow-sm font-semibold"
                onClick={handleClear}
                disabled={isUploading}
              >
                <X className="h-3.5 w-3.5 mr-1" />
                Hapus
              </Button>
            </div>
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[11px] text-[#62636C]">
            <span className="truncate max-w-[85%] font-mono">{value}</span>
            <span className="inline-flex items-center text-emerald-600 font-semibold gap-0.5">
              <CheckCircle2 className="h-3 w-3" /> Terpilih
            </span>
          </div>
        </div>
      ) : (
        <div
          onClick={() => !isUploading && fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-7 text-center cursor-pointer transition-all ${
            isDragging
              ? "border-[#20449A] bg-[#EEF2FA]/70 ring-4 ring-[#20449A]/10 scale-[1.01]"
              : error
              ? "border-red-500 bg-red-50/20"
              : "border-[#D0D5DD] bg-white hover:border-[#20449A] hover:bg-[#EEF2FA]/30"
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2 py-4">
              <Loader2 className="h-9 w-9 animate-spin text-[#20449A]" />
              <p className="text-xs font-semibold text-[#1E1F24]">Sedang mengunggah ke storage...</p>
              <p className="text-[11px] text-[#62636C]">Mohon tunggu sebentar</p>
            </div>
          ) : (
            <>
              <div
                className={`flex h-13 w-13 items-center justify-center rounded-2xl mb-3 transition-colors ${
                  isDragging
                    ? "bg-[#20449A] text-white shadow-md animate-bounce"
                    : "bg-[#EEF2FA] text-[#20449A]"
                }`}
              >
                <Upload className="h-6 w-6" />
              </div>
              <p className="text-xs font-bold text-[#1E1F24]">
                {isDragging ? (
                  <span className="text-[#20449A] font-extrabold">Lepaskan file gambar di sini</span>
                ) : (
                  <>
                    Tarik & jatuhkan file ke sini, atau <span className="text-[#20449A] underline underline-offset-2">pilih dari komputer</span>
                  </>
                )}
              </p>
              <p className="mt-1 text-[11px] text-[#62636C]">{description}</p>
            </>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml"
        onChange={handleFileChange}
        className="hidden"
      />

      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}
