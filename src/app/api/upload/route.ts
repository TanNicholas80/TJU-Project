import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: "Tidak ada file yang diunggah" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename
    const ext = path.extname(file.name) || ".png";
    const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
    const uniqueFileName = `${baseName}_${Date.now()}${ext}`;

    // 1. Try Supabase Storage if env exists
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_API_KEY;
    const bucket = process.env.SUPABASE_STORAGE_BUCKET || "tju-assets";

    if (supabaseUrl && supabaseKey && !supabaseUrl.includes("{project-ref}")) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { data, error } = await supabase.storage.from(bucket).upload(uniqueFileName, buffer, {
          contentType: file.type || "image/png",
          upsert: true,
        });

        if (!error && data) {
          const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(uniqueFileName);
          return NextResponse.json({
            success: true,
            url: publicData.publicUrl,
            message: "Berhasil diunggah ke Supabase Storage",
          });
        }
      } catch (sbErr) {
        console.warn("[Upload API] Supabase storage upload failed, falling back to local:", sbErr);
      }
    }

    // 2. Fallback: Save to local /public/uploads/
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const filePath = path.join(uploadsDir, uniqueFileName);
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${uniqueFileName}`;
    return NextResponse.json({
      success: true,
      url: publicUrl,
      message: "Berhasil diunggah secara lokal",
    });
  } catch (error: any) {
    console.error("[Upload API] Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Gagal mengunggah file" },
      { status: 500 }
    );
  }
}
