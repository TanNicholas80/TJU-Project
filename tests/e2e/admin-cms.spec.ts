import { test, expect } from "@playwright/test";

test.describe("TJU Truss Admin CMS Flow", () => {
  test("should display login page and allow login with demo credentials", async ({ page }) => {
    await page.goto("/admin/login");

    await expect(page.getByText(/TJU Truss CMS/i)).toBeVisible();
    await expect(page.getByLabel(/Email Administrator/i)).toBeVisible();
    await expect(page.getByLabel(/Kata Sandi/i)).toBeVisible();

    // Fill credentials directly
    await page.fill('input[type="email"]', "admin@tjutruss.com");
    await page.fill('input[type="password"]', "password123");

    // Click submit button
    await page.click('button:has-text("Masuk ke Dashboard")');

    // Should redirect to /admin dashboard
    await expect(page).toHaveURL(/\/admin/);
    await expect(
      page.getByText(/Ringkasan statistik konten dan aktivitas pengunjung terbaru/i)
    ).toBeVisible();
  });

  test("should navigate through ALL 10 CMS sidebar sections", async ({ page }) => {
    await page.goto("/admin");

    // 1. Dashboard Overview
    await expect(page).toHaveURL(/\/admin/);
    await expect(page.locator("main h1:has-text('Dashboard')")).toBeVisible();

    // 2. Hero Carousel
    await page.click('a:has-text("Hero Carousel")');
    await expect(page).toHaveURL(/\/admin\/carousel/);
    await expect(page.locator("main").getByRole("heading", { name: /Hero Carousel Slider/i })).toBeVisible();

    // 3. Banner Halaman
    await page.click('a:has-text("Banner Halaman")');
    await expect(page).toHaveURL(/\/admin\/banners/);
    await expect(page.locator("main").getByRole("heading", { name: /Banner Halaman/i })).toBeVisible();

    // 4. Sertifikasi Mutu
    await page.click('a:has-text("Sertifikasi Mutu")');
    await expect(page).toHaveURL(/\/admin\/certifications/);
    await expect(page.locator("main").getByRole("heading", { name: /Sertifikasi & Standar Mutu/i })).toBeVisible();

    // 5. Kategori Portofolio
    await page.click('a:has-text("Kategori Portofolio")');
    await expect(page).toHaveURL(/\/admin\/portfolio-categories/);
    await expect(page.locator("main").getByRole("heading", { name: /Kategori Portofolio/i })).toBeVisible();

    // 6. Portofolio Proyek
    await page.click('a:has-text("Portofolio Proyek")');
    await expect(page).toHaveURL(/\/admin\/portfolios/);
    await expect(page.locator("main").getByRole("heading", { name: /Portofolio Proyek/i })).toBeVisible();

    // 7. Standar Kualitas
    await page.click('a:has-text("Standar Kualitas")');
    await expect(page).toHaveURL(/\/admin\/standards/);
    await expect(page.locator("main").getByRole("heading", { name: /Standar Kualitas & Rekayasa/i })).toBeVisible();

    // 8. Kategori Blog
    await page.click('a:has-text("Kategori Blog")');
    await expect(page).toHaveURL(/\/admin\/post-categories/);
    await expect(page.locator("main").getByRole("heading", { name: /Kategori Blog & Artikel/i })).toBeVisible();

    // 9. Blog & Artikel
    await page.click('a:has-text("Blog & Artikel")');
    await expect(page).toHaveURL(/\/admin\/posts/);
    await expect(page.locator("main").getByRole("heading", { name: /Blog & Artikel/i })).toBeVisible();

    // 10. Pengaturan Kontak
    await page.click('a:has-text("Pengaturan Kontak")');
    await expect(page).toHaveURL(/\/admin\/settings/);
    await expect(page.locator("main").getByRole("heading", { name: /Pengaturan Kontak & Profil Perusahaan/i })).toBeVisible();
  });

  test("should interact with Standards Quality modal and icon preview", async ({ page }) => {
    await page.goto("/admin/standards");

    // Click button to add standard
    await page.click('button:has-text("Tambah Standar Mutu")');

    // Dialog should open
    await expect(page.getByRole("heading", { name: /Tambah Standar Mutu Baru/i })).toBeVisible();
    await expect(page.getByText(/Pratinjau Ikon Terpilih|Live Preview/i).first()).toBeVisible();

    // Close dialog
    await page.click('button:has-text("Batal")');
  });

  test("should interact with Certifications modal", async ({ page }) => {
    await page.goto("/admin/certifications");

    await page.click('button:has-text("Tambah Sertifikasi")');
    await expect(page.getByRole("heading", { name: /Tambah Sertifikasi Baru/i })).toBeVisible();

    await page.click('button:has-text("Batal")');
  });

  test("should navigate to dedicated create page when clicking Tambah Portofolio Baru", async ({ page }) => {
    await page.goto("/admin/portfolios");

    await page.click('button:has-text("Tambah Portofolio"), a:has-text("Tambah Portofolio")');

    await expect(page).toHaveURL(/\/admin\/portfolios\/create/);
    await expect(
      page.getByRole("heading", { name: /Tambah Portofolio Proyek/i })
    ).toBeVisible();
    await expect(page.locator('input[placeholder*="Gedung Olahraga"]')).toBeVisible();

    // Verify Dual-Mode Live Preview is visible
    await expect(page.getByText(/Live Pratinjau Tampilan|Preview Card/i).first()).toBeVisible();

    // Return to list
    await page.click('a[title="Kembali ke Daftar Portofolio"]');
    await expect(page).toHaveURL(/\/admin\/portfolios/);
  });

  test("should navigate to dedicated create page when clicking Tambah Artikel Baru", async ({ page }) => {
    await page.goto("/admin/posts");

    await page.click('button:has-text("Tulis Artikel Baru"), a:has-text("Tulis Artikel Baru")');

    await expect(page).toHaveURL(/\/admin\/posts\/create/);
    await expect(
      page.getByRole("heading", { name: /Tulis Artikel Blog Baru/i })
    ).toBeVisible();
    await expect(page.locator('input[placeholder*="Tips Memilih Baja Ringan"]')).toBeVisible();

    // Return to list
    await page.click('a[title="Kembali ke Daftar Artikel"]');
    await expect(page).toHaveURL(/\/admin\/posts/);
  });
});
