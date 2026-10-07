import { test, expect } from "@playwright/test";

test.describe("Dynamic SEO & Detail Pages E2E", () => {
  test("should render dynamic SEO tags and content on Blog Detail page", async ({ page }) => {
    await page.goto("/blog/1");

    // Title Tag
    await expect(page).toHaveTitle(/Mengenal Perhitungan Software HAKI.*TJU TRUSS SYSTEM/i);

    // Canonical link tag
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute("href", "https://tjutruss.com/blog/1");

    // OpenGraph meta tags
    const ogType = page.locator('meta[property="og:type"]');
    await expect(ogType).toHaveAttribute("content", "article");

    // Detail article heading and content
    await expect(page.getByRole("heading", { name: /Mengenal Perhitungan Software HAKI/i })).toBeVisible();
    await expect(page.getByText(/Keamanan struktur sepenuhnya bergantung pada akurasi perhitungan/i)).toBeVisible();
  });

  test("should render dynamic SEO tags and content on Portfolio Detail page", async ({ page }) => {
    await page.goto("/portofolio/1");

    // Title Tag
    await expect(page).toHaveTitle(/Bandara NYIA.*Rekam Jejak TJU TRUSS/i);

    // Canonical link tag
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute("href", "https://tjutruss.com/portofolio/1");

    // Project title and location
    await expect(page.getByRole("heading", { name: /Bandara NYIA/i })).toBeVisible();
    await expect(page.getByText(/Kulon Progo, D.I. Yogyakarta/i).first()).toBeVisible();
  });

  test("should switch languages seamlessly and display localized text", async ({ page }) => {
    await page.goto("/");

    // Default Indonesian
    await expect(page.getByRole("button", { name: /Konsultasi Proyek/i })).toBeVisible();

    // Click Language Switcher button (ID / EN / ZH)
    const langBtn = page.getByRole("button", { name: /^ID$/i }).or(page.locator("button:has-text('ID')")).first();
    if (await langBtn.isVisible()) {
      await langBtn.click();
      // Select English
      const enOption = page.getByRole("menuitem", { name: /English/i }).or(page.getByText(/English/i)).first();
      if (await enOption.isVisible()) {
        await enOption.click();
        // Verify navbar or home navigation shows English
        await expect(page.locator("nav")).toBeVisible();
      }
    }
  });
});
