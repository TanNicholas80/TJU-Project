import { describe, it, expect } from "vitest";
import { createPortfolio } from "@/actions/portfolios";

describe("Portfolios Server Action Validation", () => {
  it("should reject portfolio creation if location is missing", async () => {
    const result = await createPortfolio({
      titleId: "Gedung Serbaguna",
      location: "",
      coverImageUrl: "https://example.com/project.jpg",
      status: "published",
    });

    expect(result.success).toBe(false);
    expect(result.message).toContain("Lokasi proyek wajib diisi");
  });

  it("should accept valid portfolio payload with gallery URLs", async () => {
    const result = await createPortfolio({
      titleId: "Proyek Kanopi Bentang Lebar",
      titleEn: "Wide Span Canopy Project",
      location: "Semarang Barat, Jawa Tengah",
      coverImageUrl: "/images/core_background.png",
      status: "published",
      galleryUrls: [
        "/images/core_background.png",
        "/images/hero_1.png",
      ],
    });

    expect(result.success).toBe(true);
    expect(result.message).toContain("Berhasil");
  });
});
