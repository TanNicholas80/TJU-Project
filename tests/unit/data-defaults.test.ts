import { describe, it, expect } from "vitest";
import {
  defaultHeroCarousels,
  defaultQualityStandards,
  defaultPortfolios,
  defaultPosts,
  defaultCompanyProfile,
} from "@/lib/data-defaults";

describe("Data Defaults & Schema Compliance", () => {
  it("should provide valid hero carousels with i18n structure", () => {
    expect(defaultHeroCarousels.length).toBeGreaterThan(0);
    defaultHeroCarousels.forEach((slide) => {
      expect(slide.titleI18n).toBeDefined();
      expect(slide.titleI18n.id).toBeTruthy();
      expect(slide.subtitleI18n.id).toBeTruthy();
      expect(slide.imageUrl).toMatch(/^https?:\/\//);
      expect(typeof slide.sortOrder).toBe("number");
      expect(typeof slide.isActive).toBe("boolean");
    });
  });

  it("should have at least 3 quality standards for the 3-column grid", () => {
    expect(defaultQualityStandards.length).toBeGreaterThanOrEqual(3);
    defaultQualityStandards.forEach((item) => {
      expect(item.iconName).toBeTruthy();
      expect(item.titleI18n.id).toBeTruthy();
      expect(item.descriptionI18n.id).toBeTruthy();
    });
  });

  it("should have portfolios with location and images array", () => {
    expect(defaultPortfolios.length).toBeGreaterThanOrEqual(4);
    defaultPortfolios.forEach((item) => {
      expect(item.titleI18n.id).toBeTruthy();
      expect(item.location).toBeTruthy();
      expect(item.coverImageUrl).toBeTruthy();
      expect(item.status).toBe("published");
    });
  });

  it("should have blog posts with excerpt and HTML content", () => {
    expect(defaultPosts.length).toBeGreaterThanOrEqual(3);
    defaultPosts.forEach((post) => {
      expect(post.titleI18n.id).toBeTruthy();
      expect(post.excerptI18n.id).toBeTruthy();
      expect(post.contentHtmlI18n.id).toContain("<");
      expect(post.status).toBe("published");
    });
  });

  it("should have complete company profile with contact details", () => {
    expect(defaultCompanyProfile.phone).toBeTruthy();
    expect(defaultCompanyProfile.whatsapp).toBeTruthy();
    expect(defaultCompanyProfile.email).toContain("@");
    expect(defaultCompanyProfile.address).toBeTruthy();
    expect(defaultCompanyProfile.googleMapsIframe).toContain("<iframe");
  });
});
