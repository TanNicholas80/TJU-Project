import { test, expect } from "@playwright/test";

test.describe("Contact Us End-to-End Flow & Email Submission", () => {
  test("should successfully submit contact form on Home page with real-time feedback", async ({
    page,
  }) => {
    await page.goto("/");

    // Scroll to contact section
    const contactSection = page.locator("#contact");
    await contactSection.scrollIntoViewIfNeeded();
    await expect(contactSection).toBeVisible();

    // Fill form
    await page.fill("#contact-name", "Hendra Pratama");
    await page.fill("#contact-phone", "081234567890");
    await page.fill(
      "#contact-message",
      "Halo TJU Truss, kami berencana membangun kanopi baja ringan 40m2 di Semarang Barat."
    );

    // Submit
    const submitBtn = contactSection.locator('button[type="submit"]');
    await submitBtn.click();

    // Verify toast success
    await expect(
      page.getByText(/Pesan Anda berhasil dikirim!/i).first()
    ).toBeVisible({ timeout: 6000 });

    // Verify fields are cleared
    await expect(page.locator("#contact-name")).toHaveValue("");
    await expect(page.locator("#contact-phone")).toHaveValue("");
    await expect(page.locator("#contact-message")).toHaveValue("");
  });

  test("should validate required fields on Contact page (/contact)", async ({
    page,
  }) => {
    await page.goto("/contact");

    const form = page.locator("form");
    await expect(form).toBeVisible();

    // Try submit empty form
    await form.locator('button[type="submit"]').click();
    await expect(
      page.getByText(/Mohon masukkan nama Anda/i).first()
    ).toBeVisible({ timeout: 4000 });

    // Fill name only and submit
    await page.fill("#contact-name", "Ratna Sari");
    await form.locator('button[type="submit"]').click();
    await expect(
      page.getByText(/Mohon masukkan nomor telepon yang valid/i).first()
    ).toBeVisible({ timeout: 4000 });

    // Fill invalid short phone
    await page.fill("#contact-phone", "123");
    await form.locator('button[type="submit"]').click();
    await expect(
      page.getByText(/Mohon masukkan nomor telepon yang valid/i).first()
    ).toBeVisible({ timeout: 4000 });
  });

  test("should successfully submit contact form on dedicated /contact page", async ({
    page,
  }) => {
    await page.goto("/contact");

    // Check contact information cards
    await expect(page.getByText(/Email/i).first()).toBeVisible();
    await expect(page.getByText(/Telepon/i).first()).toBeVisible();
    await expect(page.getByText(/Alamat/i).first()).toBeVisible();

    // Fill form fields
    await page.fill("#contact-name", "Ir. Joko Susilo");
    await page.fill("#contact-phone", "+62 811 2345 678");
    await page.fill("#contact-email", "joko.susilo@kontraktor.co.id");
    await page.fill(
      "#contact-details",
      "Kebutuhan estimasi RAB struktur atap baja ringan galvalum bentang 15 meter untuk gedung serbaguna."
    );

    // Submit form
    await page.locator('button[type="submit"]').click();

    // Verify toast notification appears
    await expect(
      page.getByText(/Pesan Anda berhasil dikirim!/i).first()
    ).toBeVisible({ timeout: 6000 });

    // Verify form resets
    await expect(page.locator("#contact-name")).toHaveValue("");
    await expect(page.locator("#contact-phone")).toHaveValue("");
    await expect(page.locator("#contact-email")).toHaveValue("");
    await expect(page.locator("#contact-details")).toHaveValue("");
  });
});
