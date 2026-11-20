export interface ContactEmailPayload {
  name: string;
  phone: string;
  email?: string | null;
  message: string;
  ip?: string;
  timestamp?: Date;
}

/**
 * Generates a clean, modern, and user-friendly HTML email template for Resend.
 * Incorporates TJU Truss brand aesthetics (Navy #20449A, Orange #F48902) and one-click WhatsApp action.
 */
export function generateContactEmailHtml(data: ContactEmailPayload): string {
  const { name, phone, email, message, ip = "127.0.0.1", timestamp = new Date() } = data;

  // Sanitize phone number for direct WhatsApp link
  let cleanPhone = phone.replace(/[^0-9]/g, "");
  if (cleanPhone.startsWith("0")) {
    cleanPhone = "62" + cleanPhone.slice(1);
  } else if (!cleanPhone.startsWith("62")) {
    cleanPhone = "62" + cleanPhone;
  }

  const waReplyUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Halo Bapak/Ibu ${name}, terima kasih telah menghubungi CV. TRI JAYA UTAMA (TJU Truss). Menindaklanjuti pesan Anda terkait:`
  )}`;

  const formattedDate = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(timestamp);

  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pesan Kontak Baru - TJU TRUSS</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #F1F5F9;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1E293B;
      -webkit-font-smoothing: antialiased;
    }
    table {
      border-collapse: collapse;
    }
    .email-container {
      max-width: 600px;
      margin: 30px auto;
      background-color: #FFFFFF;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
      border: 1px solid #E2E8F0;
    }
    .header-bar {
      background-color: #20449A;
      padding: 32px 28px;
      text-align: left;
    }
    .accent-line {
      height: 4px;
      background-color: #F48902;
      width: 100%;
    }
    .content-body {
      padding: 32px 28px;
    }
    .info-card {
      background-color: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 24px;
    }
    .info-row {
      margin-bottom: 12px;
      font-size: 14px;
      line-height: 1.5;
    }
    .info-label {
      color: #64748B;
      font-weight: 600;
      display: inline-block;
      width: 130px;
    }
    .info-value {
      color: #0F172A;
      font-weight: 700;
    }
    .message-box {
      background-color: #F8FAFC;
      border-left: 4px solid #20449A;
      border-radius: 4px 10px 10px 4px;
      padding: 18px 20px;
      margin-top: 10px;
      margin-bottom: 28px;
      font-size: 15px;
      line-height: 1.6;
      color: #1E293B;
      white-space: pre-wrap;
      word-break: break-word;
    }
    .button-primary {
      display: inline-block;
      background-color: #25D366;
      color: #FFFFFF !important;
      text-decoration: none;
      font-weight: 700;
      font-size: 14px;
      padding: 13px 24px;
      border-radius: 8px;
      margin-right: 12px;
      margin-bottom: 10px;
    }
    .button-secondary {
      display: inline-block;
      background-color: #20449A;
      color: #FFFFFF !important;
      text-decoration: none;
      font-weight: 700;
      font-size: 14px;
      padding: 13px 24px;
      border-radius: 8px;
      margin-bottom: 10px;
    }
    .footer {
      background-color: #F8FAFC;
      padding: 20px 28px;
      text-align: center;
      border-top: 1px solid #E2E8F0;
      font-size: 12px;
      color: #94A3B8;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header-bar">
      <div style="font-size: 11px; font-weight: 800; letter-spacing: 1.5px; color: #93C5FD; text-transform: uppercase; margin-bottom: 6px;">
        Pemberitahuan Website TJU Truss
      </div>
      <h1 style="margin: 0; color: #FFFFFF; font-size: 24px; font-weight: 900; letter-spacing: -0.5px;">
        Pesan Masuk dari Calon Klien
      </h1>
      <p style="margin: 6px 0 0 0; color: #E2E8F0; font-size: 13px;">
        Permintaan konsultasi proyek baru telah diterima melalui formulir online.
      </p>
    </div>
    
    <!-- Accent Line -->
    <div class="accent-line"></div>

    <!-- Body -->
    <div class="content-body">
      <!-- Info Card -->
      <div class="info-card">
        <div class="info-row">
          <span class="info-label">Nama Pengirim</span>
          <span class="info-value">${name}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Nomor Telepon/WA</span>
          <span class="info-value">
            <a href="tel:${phone.replace(/\s+/g, "")}" style="color: #20449A; text-decoration: none;">
              ${phone}
            </a>
          </span>
        </div>
        <div class="info-row">
          <span class="info-label">Alamat Email</span>
          <span class="info-value">
            ${
              email
                ? `<a href="mailto:${email}" style="color: #20449A; text-decoration: none;">${email}</a>`
                : '<span style="color: #94A3B8; font-weight: normal;">Tidak dicantumkan</span>'
            }
          </span>
        </div>
        <div class="info-row">
          <span class="info-label">Waktu Pengiriman</span>
          <span class="info-value" style="font-weight: 500; color: #475569;">${formattedDate} WIB</span>
        </div>
        <div class="info-row" style="margin-bottom: 0;">
          <span class="info-label">IP Address</span>
          <span class="info-value" style="font-weight: normal; color: #94A3B8; font-family: monospace;">${ip}</span>
        </div>
      </div>

      <!-- Message Header -->
      <div style="font-size: 14px; font-weight: 700; color: #0F172A; margin-bottom: 8px;">
        Detail Kebutuhan Proyek / Pesan:
      </div>

      <!-- Message Content -->
      <div class="message-box">
${message}
      </div>

      <!-- CTA Buttons -->
      <div style="margin-top: 24px; text-align: left;">
        <a href="${waReplyUrl}" target="_blank" class="button-primary">
          Balas via WhatsApp
        </a>
        ${
          email
            ? `<a href="mailto:${email}?subject=${encodeURIComponent(
                "Tanggapan Konsultasi TJU Truss - CV. TRI JAYA UTAMA"
              )}" class="button-secondary">Balas via Email</a>`
            : ""
        }
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div style="font-weight: 600; color: #64748B; margin-bottom: 4px;">
        CV. TRI JAYA UTAMA (TJU TRUSS SYSTEM)
      </div>
      <div>
        Jl. Patimura No.6C, Rejomulyo, Kec. Semarang Timur, Kota Semarang, Jawa Tengah 50126
      </div>
      <div style="margin-top: 8px;">
        Email ini dikirim secara otomatis oleh sistem notifikasi website TJU Truss.
      </div>
    </div>
  </div>
</body>
</html>
`.trim();
}
