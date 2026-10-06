import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { StorageDriver, UploadOptions, UploadResult } from "./types";

export class SupabaseStorageDriver implements StorageDriver {
  private client: SupabaseClient | null = null;
  private bucket: string;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_API_KEY;
    this.bucket = process.env.SUPABASE_STORAGE_BUCKET || "tju-assets";

    if (supabaseUrl && supabaseKey && !supabaseUrl.includes("{project-ref}")) {
      this.client = createClient(supabaseUrl, supabaseKey);
    }
  }

  async upload({ buffer, fileName, contentType, folder }: UploadOptions): Promise<UploadResult> {
    if (!this.client) {
      throw new Error(
        "Kredensial Supabase (SUPABASE_URL atau SUPABASE_API_KEY) belum dikonfigurasi di file .env"
      );
    }

    const targetPath = folder ? `${folder}/${fileName}` : fileName;

    const { data, error } = await this.client.storage
      .from(this.bucket)
      .upload(targetPath, buffer, {
        contentType,
        upsert: true,
      });

    if (error || !data) {
      throw new Error(`Gagal mengunggah ke Supabase Storage: ${error?.message || "Unknown error"}`);
    }

    const { data: publicData } = this.client.storage
      .from(this.bucket)
      .getPublicUrl(targetPath);

    return {
      success: true,
      url: publicData.publicUrl,
      provider: "supabase",
      message: "File berhasil diunggah ke Supabase Storage",
    };
  }
}
