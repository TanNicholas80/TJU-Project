import { test, expect } from "@playwright/test";

test.describe("TJU Truss Public Landing Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display correct SEO metadata and title", async ({ page }) => {
    await expect(page).toHaveTitle(/TJU TRUSS SYSTEM/i);
  });

  test("should render Hero Carousel with CTA buttons and company badge", async ({ page }) => {
    // Check company badge or headline in Hero
    await expect(
      page.getByText(/REKAYASA STRUKTURAL|PRESISI TINGGI|SOLUSI TERINTEGRASI/i).first()
    ).toBeVisible();

    // Check CTA Consultation button
    const ctaButton = page.getByRole("button", { name: /Konsultasi Proyek/i });
    await expect(ctaButton).toBeVisible();

    // Check second action button
    const learnButton = page.getByRole("button", { name: /Pelajari Sistem TJU/i });
    await expect(learnButton).toBeVisible();
  });

  test("should render Standar Kualitas 3-column section", async ({ page }) => {
    await expect(
      page.getByText(/Standar Kualitas TJU TRUSS/i)
    ).toBeVisible();
    await expect(
      page.getByText(/Standar Baja Cold-Formed G550/i).first()
    ).toBeVisible();
    await expect(
      page.getByText(/Analisis Software HAKI Bersertifikat/i).first()
    ).toBeVisible();
  });

  test("should render Keahlian Kami split section with experience stats", async ({ page }) => {
    await expect(page.getByText(/Keahlian Kami di Segala Skala/i)).toBeVisible();
    await expect(page.getByText(/Industrial & Commercial/i)).toBeVisible();
    await expect(page.getByText(/Residential/i).first()).toBeVisible();
  });

  test("should render Featured Portfolios section with UNNES project", async ({ page }) => {
    await page.locator("#portfolio").scrollIntoViewIfNeeded();
    await expect(
      page.getByRole("heading", { name: /Proyek Terbaik Kami/i })
    ).toBeVisible();
    await expect(
      page.locator("#portfolio").getByText(/Proyek Kanopi Bentang Lebar|Bandara NYIA|Universitas Negeri Semarang/i).first()
    ).toBeVisible();
  });

  test("should render Blog & Articles 3-column section", async ({ page }) => {
    await page.locator("#blog").scrollIntoViewIfNeeded();
    await expect(
      page.getByRole("heading", { name: /Blog & Artikel/i })
    ).toBeVisible();
    await expect(
      page.locator("#blog article").first()
    ).toBeVisible();
    await expect(
      page.getByText(/Inovasi Atap Galvalum|Mengenal Perhitungan Software HAKI|Panduan Memilih Ketebalan|Inovasi Fabrikasi/i).first()
    ).toBeVisible();
  });

  test("should validate and submit Contact Us form", async ({ page }) => {
    await page.locator("#contact").scrollIntoViewIfNeeded();

    await page.fill("#contact-name", "Budi Santoso");
    await page.fill("#contact-phone", "081234567890");
    await page.fill(
      "#contact-message",
      "Mohon informasi penawaran rangka atap baja ringan untuk rumah 2 lantai luas 150m²."
    );

    await page.click('button[type="submit"]');

    // Verify toast notification appears
    await expect(
      page.getByText(/Pesan Anda berhasil dikirim!/i)
    ).toBeVisible({ timeout: 5000 });
  });

  test("should render Footer with company info and address", async ({ page }) => {
    await expect(
      page.getByText(/CV. Tri Jaya Utama berkomitmen memberikan solusi rangka atap/i)
    ).toBeVisible();
    await expect(page.locator("footer").getByText(/Jl. Patimura No.6C, Rejomulyo/i)).toBeVisible();
  });
});
