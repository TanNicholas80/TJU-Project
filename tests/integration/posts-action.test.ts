import { describe, it, expect } from "vitest";
import { createPost } from "@/actions/posts";

describe("Posts Server Action Validation", () => {
  it("should reject post creation if titleId is missing or too short", async () => {
    const result = await createPost({
      titleId: "ab", // Too short (min 3)
      contentHtmlId: "<p>Konten artikel</p>",
      coverImageUrl: "https://example.com/cover.jpg",
      status: "published",
    });

    expect(result.success).toBe(false);
    expect(result.message).toContain("minimal 3 karakter");
  });

  it("should reject post creation if coverImageUrl is missing", async () => {
    const result = await createPost({
      titleId: "Judul Valid Artikel",
      contentHtmlId: "<p>Konten artikel</p>",
      coverImageUrl: "",
      status: "published",
    });

    expect(result.success).toBe(false);
    expect(result.message).toContain("Cover gambar wajib diisi");
  });

  it("should accept valid post payload", async () => {
    const result = await createPost({
      titleId: "Inovasi Atap Galvalum G550",
      titleEn: "Galvalume G550 Roof Innovation",
      excerptId: "Ringkasan pengujian mutu baja ringan",
      contentHtmlId: "<p>Konten lengkap artikel rekayasa</p>",
      coverImageUrl: "https://example.com/cover.jpg",
      status: "published",
    });

    expect(result.success).toBe(true);
    expect(result.message).toContain("Berhasil");
  });
});
