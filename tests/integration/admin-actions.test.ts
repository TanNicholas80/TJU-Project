import { describe, it, expect } from "vitest";
import { createCarousel, getCarouselsAdmin } from "@/actions/carousel";
import { getAllBannersAdmin, getBannerById } from "@/actions/banners";
import { createStandard, getStandardsAdmin } from "@/actions/standards";
import { createCertification, getCertificationsAdmin } from "@/actions/certifications";
import { createPortfolioCategory, getPortfolioCategoriesAdmin } from "@/actions/portfolio-categories";
import { createPostCategory, getPostCategoriesAdmin } from "@/actions/post-categories";
import { getCompanyProfileAdmin, updateCompanyProfile } from "@/actions/settings";

describe("All Admin CMS Actions Integration & Validation", () => {
  // 1. Hero Carousel Action
  describe("Hero Carousel Actions", () => {
    it("should reject carousel creation when required fields are missing", async () => {
      const result = await createCarousel({
        imageUrl: "",
        titleId: "ab", // min 3 chars
      } as any);

      expect(result.success).toBe(false);
      expect(result.message).toBeTruthy();
    });

    it("should accept valid carousel slide payload", async () => {
      const result = await createCarousel({
        imageUrl: "/images/hero_1.png",
        titleId: "Konstruksi Rangka Atap Presisi",
        titleEn: "Precision Roof Truss Construction",
        subheaderId: "SOLUSI TERINTEGRASI",
        sortOrder: 1,
        isActive: true,
      });

      expect(result.success).toBe(true);
      expect(result.message).toContain("Berhasil");
    });

    it("should return carousel items for admin", async () => {
      const res = await getCarouselsAdmin();
      expect(res.success).toBe(true);
      expect(res.data.length).toBeGreaterThan(0);
    });
  });

  // 2. Page Banners Action
  describe("Page Banners Actions", () => {
    it("should return all page banners for admin", async () => {
      const res = await getAllBannersAdmin();
      expect(res.success).toBe(true);
      expect(res.data.length).toBeGreaterThan(0);
    });

    it("should retrieve default banner by slug or ID", async () => {
      const res = await getBannerById("1");
      expect(res.success).toBe(true);
      expect(res.data).toBeDefined();
    });
  });

  // 3. Quality Standards Action
  describe("Quality Standards Actions", () => {
    it("should reject standard creation when icon or title is invalid", async () => {
      const result = await createStandard({
        iconName: "",
        titleId: "ab",
        descriptionId: "desc",
      } as any);

      expect(result.success).toBe(false);
      expect(result.message).toBeTruthy();
    });

    it("should accept valid quality standard payload", async () => {
      const result = await createStandard({
        iconName: "ShieldCheck",
        titleId: "Standar Baja Cold-Formed G550",
        descriptionId: "Kekuatan tarik tinggi 5500 kg/cm2 dengan lapisan AZ100",
        sortOrder: 1,
        isActive: true,
      });

      expect(result.success).toBe(true);
      expect(result.message).toContain("Berhasil");
    });

    it("should return standards list for admin", async () => {
      const res = await getStandardsAdmin();
      expect(res.success).toBe(true);
      expect(res.data.length).toBeGreaterThan(0);
    });
  });

  // 4. Certifications Action
  describe("Certifications Actions", () => {
    it("should reject certification when imageUrl is missing", async () => {
      const result = await createCertification({
        titleId: "ISO 9001:2015",
        imageUrl: "",
      } as any);

      expect(result.success).toBe(false);
      expect(result.message).toContain("Logo / gambar sertifikasi wajib diisi");
    });

    it("should accept valid certification payload", async () => {
      const result = await createCertification({
        titleId: "Sertifikasi Rekayasa Struktur HAKI",
        titleEn: "HAKI Structural Engineering Certification",
        imageUrl: "/images/certifications/logo_haki.png",
        sortOrder: 1,
        isActive: true,
      });

      expect(result.success).toBe(true);
      expect(result.message).toContain("Berhasil");
    });

    it("should return certifications list for admin", async () => {
      const res = await getCertificationsAdmin();
      expect(res.success).toBe(true);
      expect(res.data.length).toBeGreaterThan(0);
    });
  });

  // 5. Portfolio Categories Action
  describe("Portfolio Categories Actions", () => {
    it("should reject portfolio category when name is too short", async () => {
      const result = await createPortfolioCategory({
        nameId: "a",
      });

      expect(result.success).toBe(false);
      expect(result.message).toContain("minimal 2 karakter");
    });

    it("should accept valid portfolio category payload with auto-slug", async () => {
      const result = await createPortfolioCategory({
        nameId: "Fasilitas Publik & Stadion",
        nameEn: "Public Facilities & Stadiums",
        descriptionId: "Konstruksi rangka atap bentang lebar",
      });

      expect(result.success).toBe(true);
      expect(result.message).toMatch(/berhasil/i);
    });

    it("should return portfolio categories list for admin", async () => {
      const res = await getPortfolioCategoriesAdmin();
      expect(res.success).toBe(true);
      expect(res.data.length).toBeGreaterThan(0);
    });
  });

  // 6. Post Categories Action
  describe("Post Categories Actions", () => {
    it("should reject post category when name is too short", async () => {
      const result = await createPostCategory({
        nameId: "x",
      });

      expect(result.success).toBe(false);
      expect(result.message).toContain("minimal 2 karakter");
    });

    it("should accept valid post category payload", async () => {
      const result = await createPostCategory({
        nameId: "Tips & Panduan Konstruksi",
        nameEn: "Construction Tips & Guides",
      });

      expect(result.success).toBe(true);
      expect(result.message).toMatch(/berhasil/i);
    });

    it("should return post categories list for admin", async () => {
      const res = await getPostCategoriesAdmin();
      expect(res.success).toBe(true);
      expect(res.data.length).toBeGreaterThan(0);
    });
  });

  // 7. Settings & Company Profile Action
  describe("Settings & Company Profile Actions", () => {
    it("should reject update when email format is invalid", async () => {
      const result = await updateCompanyProfile({
        email: "invalid-email-address",
      });

      expect(result.success).toBe(false);
      expect(result.message).toContain("Format email tidak valid");
    });

    it("should accept valid company profile data with social links", async () => {
      const result = await updateCompanyProfile({
        phone: "(024) 3519 776",
        whatsapp: "+6281234567890",
        email: "admin@tjutruss.com",
        address: "Jl. Patimura No.6C, Rejomulyo, Semarang",
        instagram: "https://instagram.com/tjutruss",
        facebook: "https://facebook.com/tjutruss",
      });

      expect(result.success).toBe(true);
      expect(result.message).toContain("Berhasil");
    });

    it("should retrieve company profile for admin", async () => {
      const res = await getCompanyProfileAdmin();
      expect(res.success).toBe(true);
      expect(res.data).toBeDefined();
      expect(res.data.phone).toBeTruthy();
    });
  });
});
