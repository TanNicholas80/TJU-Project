"use client";

import * as React from "react";

export type ViewTargetType = "article" | "portfolio" | "product";

const INTENT_KEY_PREFIX = "saktitemp:view-intent:";
const MAX_INTENT_AGE_MS = 10 * 60 * 1000; // 10 menit validasi

/**
 * 1. Pengunjung Mengklik Artikel / Portofolio di Halaman List atau Card
 * Event onClick pada kartu artikel/portofolio memanggil fungsi:
 * markViewIntent("article", slugOrId)
 * Fungsi ini menyimpan tanda niat buka (intent) berupa timestamp ke dalam sessionStorage
 * dengan key: saktitemp:view-intent:<type>:<idOrSlug>
 */
export function markViewIntent(type: ViewTargetType, idOrSlug: string | number): void {
  if (typeof window === "undefined") return;
  try {
    const key = `${INTENT_KEY_PREFIX}${type}:${idOrSlug}`;
    const payload = {
      timestamp: Date.now(),
      target: String(idOrSlug),
      type,
    };
    sessionStorage.setItem(key, JSON.stringify(payload));
  } catch (err) {
    console.warn("[ViewTracker] Failed to write intent to sessionStorage:", err);
  }
}

/**
 * 2. Pengunjung Masuk ke Halaman Detail (/article/[slug] atau /blog/[id])
 * Ketika halaman detail dimuat, fungsi consumeViewIntent akan:
 * - Mengecek apakah ada tiket intent di sessionStorage.
 * - Langsung menghapus tiket tersebut dari storage (hanya bisa dipakai 1 kali).
 * - Memvalidasi bahwa klik tersebut terjadi dalam rentang waktu yang wajar (maksimal 10 menit).
 */
export function consumeViewIntent(type: ViewTargetType, idOrSlug: string | number): boolean {
  if (typeof window === "undefined") return false;
  try {
    const key = `${INTENT_KEY_PREFIX}${type}:${idOrSlug}`;
    const rawData = sessionStorage.getItem(key);

    if (!rawData) {
      return false;
    }

    // Langsung hapus tiket tersebut dari storage (hanya bisa dipakai 1 kali)
    sessionStorage.removeItem(key);

    let intentTime = 0;
    try {
      const parsed = JSON.parse(rawData);
      intentTime = typeof parsed === "object" && parsed !== null ? parsed.timestamp : Number(rawData);
    } catch {
      intentTime = Number(rawData);
    }

    if (!intentTime || isNaN(intentTime)) {
      return false;
    }

    const elapsed = Date.now() - intentTime;
    // Validasi apakah klik terjadi dalam rentang waktu yang wajar (maksimal 10 menit)
    if (elapsed >= 0 && elapsed <= MAX_INTENT_AGE_MS) {
      return true;
    }

    return false;
  } catch (err) {
    console.warn("[ViewTracker] Failed to consume intent:", err);
    return false;
  }
}

/**
 * 3. Mengirim Permintaan ke Backend API
 * Jika verifikasi intent berhasil, frontend secara otomatis mengirim request latar belakang:
 * POST /api/article/[slug]/view atau /api/portfolio/[slug]/view
 */
export async function sendViewRequest(type: ViewTargetType, idOrSlug: string | number): Promise<boolean> {
  try {
    let endpoint = "";
    if (type === "article") {
      endpoint = `/api/article/${idOrSlug}/view`;
    } else if (type === "portfolio") {
      endpoint = `/api/portfolio/${idOrSlug}/view`;
    } else {
      endpoint = `/api/${type}/${idOrSlug}/view`;
    }

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      keepalive: true,
    });

    return res.ok;
  } catch (err) {
    console.warn(`[ViewTracker] Failed to send ${type} view request:`, err);
    return false;
  }
}

/**
 * Hook client yang otomatis menjalankan verifikasi intent dan mengirim view
 */
export function useViewTracker(type: ViewTargetType, idOrSlug: string | number) {
  React.useEffect(() => {
    if (!idOrSlug) return;

    // Verifikasi tiket intent di sessionStorage
    const hasValidIntent = consumeViewIntent(type, idOrSlug);
    if (hasValidIntent) {
      sendViewRequest(type, idOrSlug);
    }
  }, [type, idOrSlug]);
}

/**
 * Hook alias spesifik sesuai spesifikasi: useBlogView(slug)
 */
export function useBlogView(slug: string | number) {
  return useViewTracker("article", slug);
}

/**
 * Hook alias spesifik untuk portofolio: usePortfolioView(slug)
 */
export function usePortfolioView(slug: string | number) {
  return useViewTracker("portfolio", slug);
}

/**
 * Komponen Client untuk disisipkan di halaman detail server components
 */
export function ViewTrackerTrigger({
  type,
  id,
}: {
  type: ViewTargetType;
  id: string | number;
}) {
  useViewTracker(type, id);
  return null;
}
