import { describe, it, expect } from "vitest";
import { generateMetadata as generateHomeMetadata } from "@/app/page";
import { generateMetadata as generateBlogMetadata } from "@/app/blog/[id]/page";
import { generateMetadata as generatePortfolioMetadata } from "@/app/portofolio/[id]/page";

describe("Dynamic SEO Metadata Generation", () => {
  describe("Landing Page Metadata", () => {
    it("should generate comprehensive SEO metadata for home page", async () => {
      const meta = await generateHomeMetadata();

      expect(meta.title).toContain("TJU TRUSS SYSTEM");
      expect(meta.description).toBeTruthy();
      expect(meta.openGraph).toBeDefined();
      expect(meta.openGraph?.title).toContain("TJU TRUSS SYSTEM");
      expect(meta.twitter).toBeDefined();
      expect(meta.alternates?.canonical).toBe("https://tjutruss.com");
      expect(meta.alternates?.languages).toBeDefined();
    });
  });

  describe("Blog Detail Dynamic SEO Metadata", () => {
    it("should generate dynamic metadata for existing blog post", async () => {
      const meta = await generateBlogMetadata({
        params: Promise.resolve({ id: "1" }),
      });

      expect(meta.title).toContain("TJU TRUSS SYSTEM");
      expect(meta.description).toBeTruthy();
      expect((meta.openGraph as any)?.type).toBe("article");
      expect(meta.alternates?.canonical).toContain("/blog/1");
      expect(meta.openGraph?.images).toBeDefined();
      expect((meta.twitter as any)?.card).toBe("summary_large_image");
    });

    it("should return fallback metadata when blog post is not found", async () => {
      const meta = await generateBlogMetadata({
        params: Promise.resolve({ id: "non-existent-blog-id-9999" }),
      });

      expect(meta.title).toBe("Artikel Tidak Ditemukan | TJU TRUSS SYSTEM");
    });
  });

  describe("Portfolio Detail Dynamic SEO Metadata", () => {
    it("should generate dynamic metadata for existing portfolio project", async () => {
      const meta = await generatePortfolioMetadata({
        params: Promise.resolve({ id: "1" }),
      });

      expect(meta.title).toContain("Rekam Jejak TJU TRUSS");
      expect(meta.description).toContain("rangka atap baja ringan");
      expect(meta.alternates?.canonical).toContain("/portofolio/1");
      expect(meta.openGraph?.images).toBeDefined();
      expect(meta.keywords).toBeDefined();
    });

    it("should return fallback metadata when portfolio is not found", async () => {
      const meta = await generatePortfolioMetadata({
        params: Promise.resolve({ id: "non-existent-portfolio-id-9999" }),
      });

      expect(meta.title).toBe("Portofolio Tidak Ditemukan | TJU TRUSS SYSTEM");
    });
  });
});
