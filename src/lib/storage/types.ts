export interface UploadOptions {
  buffer: Buffer;
  fileName: string;
  contentType: string;
  folder?: string;
}

export interface UploadResult {
  success: boolean;
  url: string;
  provider: "local" | "supabase";
  message: string;
}

export interface StorageDriver {
  upload(options: UploadOptions): Promise<UploadResult>;
  delete?(fileUrlOrPath: string): Promise<boolean>;
}
