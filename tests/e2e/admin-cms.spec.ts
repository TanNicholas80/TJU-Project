import { test, expect } from "@playwright/test";

test.describe("TJU Truss Admin CMS Flow", () => {
  test("should display login page and allow login with demo credentials", async ({ page }) => {
    await page.goto("/admin/login");

    await expect(page.getByText(/TJU Truss CMS/i)).toBeVisible();
    await expect(page.getByLabel(/Email Administrator/i)).toBeVisible();
    await expect(page.getByLabel(/Kata Sandi/i)).toBeVisible();

    // Click demo credentials button
    await page.click('button:has-text("Gunakan Kredensial Default")');

    // Click submit button
    await page.click('button:has-text("Masuk ke Dashboard")');

    // Should redirect to /admin dashboard
    await expect(page).toHaveURL(/\/admin/);
    await expect(
      page.getByText(/Selamat Datang di Admin CMS TJU Truss/i)
    ).toBeVisible();
  });

  test("should navigate through CMS sidebar sections", async ({ page }) => {
    await page.goto("/admin");

    // Click Portofolio in sidebar
    await page.click('a:has-text("Portofolio Proyek")');
    await expect(page).toHaveURL(/\/admin\/portfolios/);
    await expect(
      page.locator("main").getByRole("heading", { name: /Manajemen Portofolio Proyek/i })
    ).toBeVisible();

    // Click Blog in sidebar
    await page.click('a:has-text("Blog & Artikel")');
    await expect(page).toHaveURL(/\/admin\/posts/);
    await expect(
      page.locator("main").getByRole("heading", { name: /Manajemen Blog & Artikel/i })
    ).toBeVisible();

    // Click Carousel in sidebar
    await page.click('a:has-text("Hero Carousel")');
    await expect(page).toHaveURL(/\/admin\/carousel/);
    await expect(
      page.locator("main").getByRole("heading", { name: /Hero Carousel Slider/i })
    ).toBeVisible();

    // Click Standar Kualitas in sidebar
    await page.click('a:has-text("Standar Kualitas")');
    await expect(page).toHaveURL(/\/admin\/standards/);
    await expect(
      page.locator("main").getByRole("heading", { name: /Standar Kualitas & Rekayasa/i })
    ).toBeVisible();

    // Click Pengaturan Kontak in sidebar
    await page.click('a:has-text("Pengaturan Kontak")');
    await expect(page).toHaveURL(/\/admin\/settings/);
    await expect(
      page.locator("main").getByRole("heading", { name: /Pengaturan Kontak & Profil/i })
    ).toBeVisible();
  });

  test("should open modal when clicking Tambah Portofolio Baru", async ({ page }) => {
    await page.goto("/admin/portfolios");

    await page.click('button:has-text("Tambah Portofolio Baru")');

    await expect(
      page.getByText(/Tambah Portofolio Proyek Baru/i)
    ).toBeVisible();
    await expect(page.locator("#portfolio-title-id")).toBeVisible();
    await expect(page.locator("#portfolio-location")).toBeVisible();
    await expect(page.locator("#portfolio-cover")).toBeVisible();

    // Close modal
    await page.click('button:has-text("Batal")');
    await expect(
      page.getByText(/Tambah Portofolio Proyek Baru/i)
    ).not.toBeVisible();
  });
});
