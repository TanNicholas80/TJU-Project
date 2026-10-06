"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { cache } from "@/lib/cache";
import { defaultPageBanners } from "@/lib/data-defaults";
import { translateContentBatch } from "@/lib/translator";
import * as z from "zod";

function safeRevalidate(path: string) {
  try {
    revalidatePath(path);
  } catch {}
}

const bannerSchema = z.object({
  pageSlug: z.string().min(1, "Slug/key halaman wajib diisi"),
  titleId: z.string().min(2, "Judul banner wajib diisi"),
  titleEn: z.string().optional(),
  titleZh: z.string().optional(),
  breadcrumbId: z.string().optional(),
  breadcrumbEn: z.string().optional(),
  breadcrumbZh: z.string().optional(),
  backgroundImageUrl: z.string().min(1, "Gambar background banner wajib diunggah"),
});

export type BannerInput = z.infer<typeof bannerSchema>;

/**
 * Mengambil semua banner halaman untuk dashboard admin
 */
export async function getAllBannersAdmin() {
  try {
    const banners = await db
      .select()
      .from(schema.pageBanners)
      .orderBy(asc(schema.pageBanners.id));

    if (banners && banners.length > 0) {
      return { success: true, data: banners };
    }

    const defaultList = Object.values(defaultPageBanners);
    return { success: true, data: defaultList };
  } catch (error) {
    const defaultList = Object.values(defaultPageBanners);
    return { success: true, data: defaultList };
  }
}

/**
 * Mengambil satu banner berdasarkan ID numerik
 */
export async function getBannerById(id: number) {
  try {
    const [banner] = await db
      .select()
      .from(schema.pageBanners)
      .where(eq(schema.pageBanners.id, id))
      .limit(1);

    if (banner) {
      return { success: true, data: banner };
    }

    const defaultItem = Object.values(defaultPageBanners).find((b) => b.id === id);
    if (defaultItem) {
      return { success: true, data: defaultItem };
    }

    return { success: false, message: "Banner tidak ditemukan" };
  } catch (error) {
    const defaultItem = Object.values(defaultPageBanners).find((b) => b.id === id);
    if (defaultItem) {
      return { success: true, data: defaultItem };
    }
    return { success: false, message: "Gagal memuat banner halaman" };
  }
}

/**
 * Mengambil satu banner berdasarkan Slug Halaman (misal: "about-us", "blog", "portofolio", "contact")
 */
export async function getBannerBySlug(slug: string = "about-us") {
  try {
    const [banner] = await db
      .select()
      .from(schema.pageBanners)
      .where(eq(schema.pageBanners.pageSlug, slug))
      .limit(1);

    if (banner) {
      return { success: true, data: banner };
    }
    const defaultData = defaultPageBanners[slug] || defaultPageBanners["about-us"];
    return { success: true, data: defaultData };
  } catch {
    const defaultData = defaultPageBanners[slug] || defaultPageBanners["about-us"];
    return { success: true, data: defaultData };
  }
}

/**
 * Menambahkan banner halaman baru
 */
export async function createBanner(input: BannerInput) {
  try {
    const validated = bannerSchema.parse(input);

    // Cek duplikasi slug
    const [existing] = await db
      .select()
      .from(schema.pageBanners)
      .where(eq(schema.pageBanners.pageSlug, validated.pageSlug))
      .limit(1);

    if (existing) {
      return {
        success: false,
        message: `Banner untuk halaman "${validated.pageSlug}" sudah ada. Silakan edit banner yang sudah ada.`,
      };
    }

    // Auto-translate jika teks EN atau ZH belum disediakan
    let autoEn: Record<string, string> = {};
    let autoZh: Record<string, string> = {};
    if (!validated.titleEn || !validated.titleZh) {
      try {
        const trans = await translateContentBatch({
          title: validated.titleId,
          breadcrumb: validated.breadcrumbId || validated.titleId,
        });
        autoEn = trans.en;
        autoZh = trans.zh;
      } catch (tErr) {
        console.warn("[Banner Action] Auto-translate error:", tErr);
      }
    }

    const titleEn = validated.titleEn || autoEn.title || validated.titleId;
    const titleZh = validated.titleZh || autoZh.title || validated.titleId;

    const breadcrumbId = validated.breadcrumbId || validated.titleId;
    const breadcrumbEn = validated.breadcrumbEn || autoEn.breadcrumb || titleEn;
    const breadcrumbZh = validated.breadcrumbZh || autoZh.breadcrumb || titleZh;

    const [inserted] = await db
      .insert(schema.pageBanners)
      .values({
        pageSlug: validated.pageSlug,
        titleI18n: {
          id: validated.titleId,
          en: titleEn,
          zh: titleZh,
        },
        breadcrumbI18n: {
          id: breadcrumbId,
          en: breadcrumbEn,
          zh: breadcrumbZh,
        },
        backgroundImageUrl: validated.backgroundImageUrl,
        updatedAt: new Date(),
      })
      .returning();

    // Invalidate Cache
    await cache.del(`public:banner:${validated.pageSlug}`);
    await cache.del("public:banners");

    safeRevalidate("/");
    safeRevalidate("/about");
    safeRevalidate("/blog");
    safeRevalidate("/portofolio");
    safeRevalidate("/portfolio");
    safeRevalidate("/contact");
    safeRevalidate("/admin/banners");

    return {
      success: true,
      message: "Banner halaman berhasil dibuat",
      data: inserted,
    };
  } catch (err: any) {
    const msg = err.issues?.[0]?.message || err.message || "Gagal membuat banner halaman";
    return { success: false, message: msg };
  }
}

/**
 * Memperbarui banner halaman berdasarkan ID
 */
export async function updateBanner(id: number, input: BannerInput) {
  try {
    const validated = bannerSchema.parse(input);

    // Auto-translate jika teks EN atau ZH belum disediakan
    let autoEn: Record<string, string> = {};
    let autoZh: Record<string, string> = {};
    if (!validated.titleEn || !validated.titleZh) {
      try {
        const trans = await translateContentBatch({
          title: validated.titleId,
          breadcrumb: validated.breadcrumbId || validated.titleId,
        });
        autoEn = trans.en;
        autoZh = trans.zh;
      } catch (tErr) {
        console.warn("[Banner Action] Auto-translate error:", tErr);
      }
    }

    const titleEn = validated.titleEn || autoEn.title || validated.titleId;
    const titleZh = validated.titleZh || autoZh.title || validated.titleId;

    const breadcrumbId = validated.breadcrumbId || validated.titleId;
    const breadcrumbEn = validated.breadcrumbEn || autoEn.breadcrumb || titleEn;
    const breadcrumbZh = validated.breadcrumbZh || autoZh.breadcrumb || titleZh;

    await db
      .update(schema.pageBanners)
      .set({
        pageSlug: validated.pageSlug,
        titleI18n: {
          id: validated.titleId,
          en: titleEn,
          zh: titleZh,
        },
        breadcrumbI18n: {
          id: breadcrumbId,
          en: breadcrumbEn,
          zh: breadcrumbZh,
        },
        backgroundImageUrl: validated.backgroundImageUrl,
        updatedAt: new Date(),
      })
      .where(eq(schema.pageBanners.id, id));

    // Invalidate Cache
    await cache.del(`public:banner:${validated.pageSlug}`);
    await cache.del("public:banners");

    safeRevalidate("/");
    safeRevalidate("/about");
    safeRevalidate("/blog");
    safeRevalidate("/portofolio");
    safeRevalidate("/portfolio");
    safeRevalidate("/contact");
    safeRevalidate("/admin/banners");

    return { success: true, message: "Banner halaman berhasil diperbarui" };
  } catch (err: any) {
    const msg = err.issues?.[0]?.message || err.message || "Gagal memperbarui banner halaman";
    return { success: false, message: msg };
  }
}

/**
 * Menghapus banner halaman berdasarkan ID
 */
export async function deleteBanner(id: number) {
  try {
    const [banner] = await db
      .select()
      .from(schema.pageBanners)
      .where(eq(schema.pageBanners.id, id))
      .limit(1);

    if (banner) {
      await db.delete(schema.pageBanners).where(eq(schema.pageBanners.id, id));
      await cache.del(`public:banner:${banner.pageSlug}`);
    }

    await cache.del("public:banners");
    safeRevalidate("/admin/banners");

    return { success: true, message: "Banner halaman berhasil dihapus" };
  } catch (err: any) {
    return { success: false, message: "Gagal menghapus banner halaman" };
  }
}

/**
 * Helper simpan banner (Upsert by slug - backward compatibility)
 */
export async function saveBanner(input: BannerInput) {
  try {
    const validated = bannerSchema.parse(input);

    const [existing] = await db
      .select()
      .from(schema.pageBanners)
      .where(eq(schema.pageBanners.pageSlug, validated.pageSlug))
      .limit(1);

    if (existing) {
      return await updateBanner(existing.id, validated);
    } else {
      return await createBanner(validated);
    }
  } catch (err: any) {
    const msg = err.issues?.[0]?.message || err.message || "Gagal menyimpan banner halaman";
    return { success: false, message: msg };
  }
}
