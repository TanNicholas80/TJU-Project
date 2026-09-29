import { test, expect } from "@playwright/test";

test.describe("TJU Truss Public Landing Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display correct SEO metadata and title", async ({ page }) => {
    await expect(page).toHaveTitle(/TJU TRUSS SYSTEM/i);
  });

  test("should render Hero Carousel with CTA buttons and company badge", async ({ page }) => {
    // Check company badge in Hero
    await expect(page.getByText(/TJU Truss System & Engineering/i)).toBeVisible();

    // Check CTA Consultation button
    const ctaButton = page.getByRole("button", { name: /Konsultasi Proyek/i });
    await expect(ctaButton).toBeVisible();

    // Check WhatsApp button
    const waLink = page.getByRole("link", { name: /Hubungi via WhatsApp/i });
    await expect(waLink).toBeVisible();
  });

  test("should render Standar Kualitas 3-column section", async ({ page }) => {
    await expect(
      page.getByText(/Standar Kualitas & Rekayasa TJU/i)
    ).toBeVisible();
    await expect(
      page.getByText(/Standar Baja Cold-Formed G550/i)
    ).toBeVisible();
    await expect(
      page.getByText(/Analisis Software HAKI/i)
    ).toBeVisible();
  });

  test("should render Keahlian Kami split section with experience stats", async ({ page }) => {
    await expect(page.getByText(/Keahlian & Spesialisasi Kami/i)).toBeVisible();
    await expect(page.getByText(/15\+/i)).toBeVisible();
    await expect(page.getByText(/Tahun Pengalaman Rekayasa/i)).toBeVisible();
  });

  test("should render Featured Portfolios section with UNNES project", async ({ page }) => {
    await expect(
      page.getByText(/Portofolio Proyek Unggulan/i)
    ).toBeVisible();
    await expect(
      page.getByText(/Universitas Negeri Semarang \(UNNES\)/i)
    ).toBeVisible();
  });

  test("should render Blog & Articles 3-column section", async ({ page }) => {
    await expect(
      page.getByText(/Edukasi & Wawasan Rekayasa/i)
    ).toBeVisible();
    await expect(
      page.getByText(/Mengenal Perhitungan Software HAKI/i)
    ).toBeVisible();
  });

  test("should validate and submit Contact Us form", async ({ page }) => {
    await page.locator("#contact").scrollIntoViewIfNeeded();

    await page.fill("#contact-name", "Budi Santoso");
    await page.fill("#contact-email", "budi@example.com");
    await page.fill("#contact-phone", "081234567890");
    await page.fill(
      "#contact-message",
      "Mohon informasi penawaran rangka atap baja ringan untuk rumah 2 lantai luas 150m²."
    );

    await page.click('button:has-text("Kirim Formulir Konsultasi")');

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
