import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { storage } from "@/lib/storage";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: "Tidak ada file yang diunggah" }, { status: 400 });
    }

    // Whitelist MIME types sesuai PRD 8.2
    const ALLOWED_MIME_TYPES = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "application/pdf",
    ];

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message: `Format berkas (${file.type || "unknown"}) tidak diizinkan. Hanya format JPEG, PNG, WebP, GIF, atau PDF yang didukung.`,
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message: "Ukuran berkas melebihi batas maksimum 5MB.",
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename
    const ext = path.extname(file.name) || ".png";
    const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
    const uniqueFileName = `${baseName}_${Date.now()}${ext}`;

    // Upload using modular storage driver (resolved by process.env.STORAGE_PROVIDER)
    const result = await storage.upload({
      buffer,
      fileName: uniqueFileName,
      contentType: file.type || "image/png",
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("[Upload API] Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Gagal mengunggah file" },
      { status: 500 }
    );
  }
}
