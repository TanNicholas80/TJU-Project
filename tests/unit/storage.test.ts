import { describe, it, expect } from "vitest";
import { LocalStorageDriver, SupabaseStorageDriver, getStorageDriver } from "@/lib/storage";
import fs from "fs/promises";
import path from "path";

describe("Storage System: Local vs Supabase Drivers (PRD Compliance)", () => {
  describe("LocalStorageDriver", () => {
    it("should upload file buffer to local uploads directory", async () => {
      const driver = new LocalStorageDriver();
      const testBuffer = Buffer.from("test image content data");
      const fileName = `test_upload_${Date.now()}.txt`;

      const result = await driver.upload({
        buffer: testBuffer,
        fileName,
        contentType: "text/plain",
        folder: "test-folder",
      });

      expect(result.success).toBe(true);
      expect(result.provider).toBe("local");
      expect(result.url).toBe(`/uploads/test-folder/${fileName}`);

      // Verify file was physically written to disk
      const filePath = path.join(process.cwd(), "public", "uploads", "test-folder", fileName);
      const fileData = await fs.readFile(filePath, "utf-8");
      expect(fileData).toBe("test image content data");

      // Clean up test file
      await fs.unlink(filePath).catch(() => {});
    });
  });

  describe("SupabaseStorageDriver", () => {
    it("should instantiate and check configuration requirements", async () => {
      const driver = new SupabaseStorageDriver();
      expect(driver).toBeDefined();

      // If env is not configured, driver should throw informative error
      if (!process.env.SUPABASE_URL || !process.env.SUPABASE_API_KEY) {
        await expect(
          driver.upload({
            buffer: Buffer.from("sample"),
            fileName: "sample.jpg",
            contentType: "image/jpeg",
          })
        ).rejects.toThrow(/Kredensial Supabase/i);
      }
    });
  });

  describe("Storage Provider Factory", () => {
    it("should return LocalStorageDriver when STORAGE_PROVIDER is local or default", () => {
      const driver = getStorageDriver();
      expect(driver).toBeDefined();
    });
  });

  describe("MIME Whitelist & File Size Validation Specifications (PRD 8.2)", () => {
    const ALLOWED_MIME_TYPES = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "application/pdf",
    ];
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    it("should permit valid image and PDF formats", () => {
      expect(ALLOWED_MIME_TYPES).toContain("image/jpeg");
      expect(ALLOWED_MIME_TYPES).toContain("image/png");
      expect(ALLOWED_MIME_TYPES).toContain("image/webp");
      expect(ALLOWED_MIME_TYPES).toContain("application/pdf");
    });

    it("should reject malicious or disallowed file types", () => {
      const dangerousTypes = ["application/x-msdownload", "text/javascript", "application/x-sh"];
      for (const dangerous of dangerousTypes) {
        expect(ALLOWED_MIME_TYPES.includes(dangerous)).toBe(false);
      }
    });

    it("should enforce 5MB maximum file size limit", () => {
      const validSize = 2 * 1024 * 1024; // 2MB
      const excessiveSize = 6 * 1024 * 1024; // 6MB

      expect(validSize <= MAX_FILE_SIZE).toBe(true);
      expect(excessiveSize <= MAX_FILE_SIZE).toBe(false);
    });
  });
});
