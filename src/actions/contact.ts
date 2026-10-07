"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { checkRateLimit, getClientIp } from "@/lib/rate-limiter";
import { generateContactEmailHtml } from "@/lib/email/contact-template";
import {
  contactFormSchema,
  type ContactFormInput,
} from "@/lib/validations/contact";

export interface ContactActionResult {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  mocked?: boolean;
}

/**
 * Verifies Cloudflare Turnstile token if configured.
 * Gracefully permits if TURNSTILE_SECRET_KEY is not set.
 */
async function verifyTurnstileToken(
  token?: string,
  ip?: string
): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) return true; // Bypass in dev/test if not configured

  if (!token) return false;

  try {
    const formData = new URLSearchParams();
    formData.append("secret", secretKey);
    formData.append("response", token);
    if (ip && ip !== "127.0.0.1") {
      formData.append("remoteip", ip);
    }

    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: formData,
      }
    );
    const outcome = await res.json();
    return outcome.success === true;
  } catch (error) {
    console.error("[Turnstile] Verification failed:", error);
    return false;
  }
}

/**
 * Server Action for Contact Us Form Submission:
 * 1. Zod schema validation
 * 2. Honeypot bot protection
 * 3. Rate limiting (max 5 requests per 10 minutes per IP - PRD 8.2)
 * 4. Cloudflare Turnstile verification (if configured)
 * 5. Email delivery via Resend API with modern HTML template
 */
export async function submitContactForm(
  data: ContactFormInput,
  clientIpOverride?: string
): Promise<ContactActionResult> {
  // 1. Validate Form Input with Zod
  const validationResult = contactFormSchema.safeParse(data);
  if (!validationResult.success) {
    const firstErrorMessage =
      validationResult.error.issues[0]?.message || "Input form tidak valid";
    return {
      success: false,
      message: firstErrorMessage,
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const validData = validationResult.data;

  // 2. Anti-Spam: Honeypot Check
  if (validData.honeypot && validData.honeypot.trim().length > 0) {
    console.warn("[Spam Trap] Honeypot field filled by bot:", validData.honeypot);
    return {
      success: false,
      message: "Spam terdeteksi. Permintaan Anda ditolak.",
    };
  }

  // Determine client IP address
  let ip = clientIpOverride || "127.0.0.1";
  if (!clientIpOverride) {
    try {
      const headersList = await headers();
      ip = getClientIp(headersList);
    } catch {
      // In non-request scope (e.g. unit tests), fallback to localhost
      ip = "127.0.0.1";
    }
  }

  // 3. Rate Limiting Check (5 submissions per 10 min window / 600 seconds)
  const rateLimit = await checkRateLimit(ip, 5, 600);
  if (!rateLimit.success) {
    return {
      success: false,
      message:
        "Terlalu banyak permintaan. Mohon tunggu beberapa menit sebelum mengirim pesan kembali.",
    };
  }

  // 4. Cloudflare Turnstile Verification (if configured)
  const isHuman = await verifyTurnstileToken(validData.turnstileToken, ip);
  if (!isHuman) {
    return {
      success: false,
      message: "Verifikasi keamanan (Turnstile) gagal. Silakan muat ulang halaman.",
    };
  }

  // 5. Send Email Notification via Resend API
  const resendApiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_EMAIL || "info@tjutruss.com";
  const fromEmail =
    process.env.RESEND_FROM_EMAIL || "TJU Truss Web <onboarding@resend.dev>";

  // Development/Test mock mode if no API key is provided
  if (!resendApiKey || resendApiKey.trim() === "" || resendApiKey.includes("dummy")) {
    console.log(`[Resend Mock] Simulating email delivery to: ${toEmail}`, {
      from: fromEmail,
      name: validData.name,
      phone: validData.phone,
      ip,
    });
    return {
      success: true,
      message: "Pesan Anda berhasil dikirim!",
      mocked: true,
    };
  }

  try {
    const resend = new Resend(resendApiKey);
    const emailHtml = generateContactEmailHtml({
      name: validData.name,
      phone: validData.phone,
      email: validData.email,
      message: validData.message,
      ip,
      timestamp: new Date(),
    });

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: validData.email || undefined,
      subject: `[Kontak Masuk] Konsultasi Baru dari ${validData.name}`,
      html: emailHtml,
    });

    if (error) {
      console.error("[Resend Error]:", error);
      return {
        success: false,
        message:
          "Gagal mengirim notifikasi email. Silakan hubungi kami via WhatsApp langsung.",
      };
    }

    return {
      success: true,
      message: "Pesan Anda berhasil dikirim!",
    };
  } catch (error: any) {
    console.error("[Resend Exception]:", error);
    return {
      success: false,
      message: "Terjadi gangguan server saat memproses email. Silakan coba kembali.",
    };
  }
}
