import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { StorageDriver, UploadOptions, UploadResult } from "./types";

export class LocalStorageDriver implements StorageDriver {
  private baseDir: string;

  constructor() {
    this.baseDir = path.join(process.cwd(), "public", "uploads");
  }

  async upload({ buffer, fileName, folder }: UploadOptions): Promise<UploadResult> {
    const targetDir = folder ? path.join(this.baseDir, folder) : this.baseDir;
    await mkdir(targetDir, { recursive: true });

    const filePath = path.join(targetDir, fileName);
    await writeFile(filePath, buffer);

    const publicUrl = folder ? `/uploads/${folder}/${fileName}` : `/uploads/${fileName}`;

    return {
      success: true,
      url: publicUrl,
      provider: "local",
      message: "File berhasil disimpan ke penyimpanan lokal",
    };
  }
}
