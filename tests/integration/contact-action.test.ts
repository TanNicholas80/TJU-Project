import { describe, it, expect, beforeEach } from "vitest";
import { submitContactForm } from "@/actions/contact";
import { checkRateLimit, resetRateLimit, getClientIp } from "@/lib/rate-limiter";
import { generateContactEmailHtml } from "@/lib/email/contact-template";
import { contactFormSchema } from "@/lib/validations/contact";
import { POST } from "@/app/api/contact/route";

describe("Contact Us Form & Server Action Integration", () => {
  const testIp = "192.168.1.100";

  beforeEach(async () => {
    // Reset rate limiter for test IP
    await resetRateLimit(testIp);
    await resetRateLimit("127.0.0.1");
    await resetRateLimit("rate-limit-test-ip");
  });

  describe("Zod Contact Schema Validation", () => {
    it("should reject payload with short name (< 2 chars)", () => {
      const parsed = contactFormSchema.safeParse({
        name: "A",
        phone: "08123456789",
        message: "Kebutuhan rangka atap baja ringan 200m2",
      });
      expect(parsed.success).toBe(false);
      if (!parsed.success) {
        expect(parsed.error.issues[0].message).toContain("minimal 2 karakter");
      }
    });

    it("should reject payload with invalid/short phone (< 8 chars)", () => {
      const parsed = contactFormSchema.safeParse({
        name: "Budi Santoso",
        phone: "12345",
        message: "Kebutuhan rangka atap baja ringan 200m2",
      });
      expect(parsed.success).toBe(false);
      if (!parsed.success) {
        expect(parsed.error.issues[0].message).toContain("minimal 8 digit");
      }
    });

    it("should reject payload with invalid email address format", () => {
      const parsed = contactFormSchema.safeParse({
        name: "Budi Santoso",
        phone: "081234567890",
        email: "budi-bukan-email",
        message: "Kebutuhan rangka atap baja ringan 200m2",
      });
      expect(parsed.success).toBe(false);
      if (!parsed.success) {
        expect(parsed.error.issues[0].message).toContain("Format email tidak valid");
      }
    });

    it("should reject payload with short message (< 5 chars)", () => {
      const parsed = contactFormSchema.safeParse({
        name: "Budi Santoso",
        phone: "081234567890",
        message: "Hai",
      });
      expect(parsed.success).toBe(false);
      if (!parsed.success) {
        expect(parsed.error.issues[0].message).toContain("minimal 5 karakter");
      }
    });

    it("should accept valid payload with required fields only", () => {
      const parsed = contactFormSchema.safeParse({
        name: "Budi Santoso",
        phone: "081234567890",
        message: "Konsultasi rangka atap gudang logistik 500m2 di Semarang.",
      });
      expect(parsed.success).toBe(true);
    });

    it("should accept valid payload including optional email", () => {
      const parsed = contactFormSchema.safeParse({
        name: "Hendro Wijaya",
        phone: "+62 813 9999 8888",
        email: "hendro@example.com",
        message: "Pemasangan kanopi galvalum untuk ruko 3 unit.",
      });
      expect(parsed.success).toBe(true);
    });
  });

  describe("Anti-Spam & Honeypot Detection", () => {
    it("should reject submission if honeypot field is filled by bot", async () => {
      const result = await submitContactForm(
        {
          name: "Spam Bot",
          phone: "081234567890",
          message: "Check out this promotional link http://spam.xyz",
          honeypot: "http://bot-target.com",
        },
        testIp
      );

      expect(result.success).toBe(false);
      expect(result.message).toContain("Spam terdeteksi");
    });
  });

  describe("Rate Limiter (PRD 8.2: Max 5 Submissions per 10 Minutes)", () => {
    it("should allow up to 5 submissions and block the 6th submission", async () => {
      const rateIp = "rate-limit-test-ip";
      await resetRateLimit(rateIp);

      for (let i = 1; i <= 5; i++) {
        const check = await checkRateLimit(rateIp, 5, 600);
        expect(check.success).toBe(true);
        expect(check.remaining).toBe(5 - i);
      }

      // 6th attempt must be blocked
      const blockedCheck = await checkRateLimit(rateIp, 5, 600);
      expect(blockedCheck.success).toBe(false);
      expect(blockedCheck.remaining).toBe(0);
      expect(blockedCheck.resetInSeconds).toBeGreaterThan(0);

      // Resetting rate limiter clears the block
      await resetRateLimit(rateIp);
      const afterReset = await checkRateLimit(rateIp, 5, 600);
      expect(afterReset.success).toBe(true);
    });

    it("should extract client IP from varied header sources correctly", () => {
      // 1. x-forwarded-for with multiple proxies
      const headersForwarded = new Headers({
        "x-forwarded-for": "114.122.10.5, 172.68.1.1",
      });
      expect(getClientIp(headersForwarded)).toBe("114.122.10.5");

      // 2. x-real-ip
      const headersReal = new Headers({
        "x-real-ip": "180.252.12.3",
      });
      expect(getClientIp(headersReal)).toBe("180.252.12.3");

      // 3. Cloudflare Connecting IP
      const headersCf = new Headers({
        "cf-connecting-ip": "103.22.200.5",
      });
      expect(getClientIp(headersCf)).toBe("103.22.200.5");

      // 4. Fallback for null/empty headers
      expect(getClientIp(null)).toBe("127.0.0.1");
    });
  });

  describe("Resend HTML Email Template Generation", () => {
    it("should generate professional HTML email with branding and details", () => {
      const html = generateContactEmailHtml({
        name: "Ahmad Dahlan",
        phone: "081298765432",
        email: "ahmad@perusahaan.co.id",
        message: "Perlu penawaran struktur kuda-kuda baja ringan bentang 18 meter.",
        ip: "103.10.20.30",
        timestamp: new Date("2026-10-08T09:00:00Z"),
      });

      expect(html).toContain("TJU TRUSS SYSTEM");
      expect(html).toContain("Ahmad Dahlan");
      expect(html).toContain("081298765432");
      expect(html).toContain("ahmad@perusahaan.co.id");
      expect(html).toContain("bentang 18 meter");
      expect(html).toContain("wa.me/6281298765432");
      expect(html).toContain("mailto:ahmad@perusahaan.co.id");
      expect(html).toContain("103.10.20.30");
    });

    it("should handle submission without email gracefully in template", () => {
      const html = generateContactEmailHtml({
        name: "Siti Rahma",
        phone: "085612345678",
        message: "Ingin konsultasi atap rumah tinggal di Pedurungan.",
      });

      expect(html).toContain("Siti Rahma");
      expect(html).toContain("Tidak dicantumkan");
      expect(html).toContain("wa.me/6285612345678");
    });
  });

  describe("submitContactForm Server Action Execution", () => {
    it("should successfully process and return success for valid submission", async () => {
      const result = await submitContactForm(
        {
          name: "Dewi Lestari",
          phone: "081234567890",
          email: "dewi@example.com",
          message: "Permintaan katalog dan brosur teknis baja ringan TJU.",
        },
        testIp
      );

      expect(result.success).toBe(true);
      expect(result.message).toContain("Pesan Anda berhasil dikirim!");
    });

    it("should enforce rate limit after multiple server action calls", async () => {
      const spammerIp = "192.168.1.99";
      await resetRateLimit(spammerIp);

      for (let i = 0; i < 5; i++) {
        const res = await submitContactForm(
          {
            name: `User ${i}`,
            phone: "081234567890",
            message: "Pesan valid berkala dari pengirim.",
          },
          spammerIp
        );
        expect(res.success).toBe(true);
      }

      // The 6th submission should be rejected by rate limiting
      const blocked = await submitContactForm(
        {
          name: "User 6",
          phone: "081234567890",
          message: "Pesan ke-6 yang harus diblokir.",
        },
        spammerIp
      );

      expect(blocked.success).toBe(false);
      expect(blocked.message).toContain("Terlalu banyak permintaan");
    });
  });

  describe("POST /api/contact Route Handler", () => {
    it("should return HTTP 200 with JSON for valid payload", async () => {
      const req = new Request("http://localhost:3000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-for": "10.0.0.5",
        },
        body: JSON.stringify({
          name: "API Tester",
          phone: "081234567890",
          message: "Pengujian kontak via API route handler.",
        }),
      });

      const res = await POST(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.message).toContain("Pesan Anda berhasil dikirim!");
    });

    it("should return HTTP 400 for invalid body payload", async () => {
      const req = new Request("http://localhost:3000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "A", // too short
          phone: "123", // too short
          message: "",
        }),
      });

      const res = await POST(req);
      expect(res.status).toBe(400);

      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.errors).toBeDefined();
    });

    it("should return HTTP 400 when honeypot is filled", async () => {
      const req = new Request("http://localhost:3000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Bot Sender",
          phone: "081234567890",
          message: "Pesan spam dari crawler otomatis.",
          honeypot: "http://bot-site.com",
        }),
      });

      const res = await POST(req);
      expect(res.status).toBe(400);

      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.message).toContain("Spam terdeteksi");
    });
  });
});
