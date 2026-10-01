"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";
import { cache } from "@/lib/cache";
import { defaultPageBanners } from "@/lib/data-defaults";
import * as z from "zod";

function safeRevalidate(path: string) {
  try {
    revalidatePath(path);
  } catch {}
}

const bannerSchema = z.object({
  pageSlug: z.string().min(1, "Slug halaman wajib diisi"),
  titleId: z.string().min(2, "Judul banner wajib diisi"),
  titleEn: z.string().optional(),
  titleZh: z.string().optional(),
  breadcrumbId: z.string().optional(),
  breadcrumbEn: z.string().optional(),
  breadcrumbZh: z.string().optional(),
  backgroundImageUrl: z.string().min(1, "URL background banner wajib diisi"),
});

export type BannerInput = z.infer<typeof bannerSchema>;

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

export async function saveBanner(input: BannerInput) {
  try {
    const validated = bannerSchema.parse(input);

    try {
      const [existing] = await db
        .select()
        .from(schema.pageBanners)
        .where(eq(schema.pageBanners.pageSlug, validated.pageSlug))
        .limit(1);

      if (existing) {
        await db
          .update(schema.pageBanners)
          .set({
            titleI18n: {
              id: validated.titleId,
              en: validated.titleEn || validated.titleId,
              zh: validated.titleZh || validated.titleId,
            },
            breadcrumbI18n: {
              id: validated.breadcrumbId || validated.titleId,
              en: validated.breadcrumbEn || validated.breadcrumbId || validated.titleId,
              zh: validated.breadcrumbZh || validated.breadcrumbId || validated.titleId,
            },
            backgroundImageUrl: validated.backgroundImageUrl,
            updatedAt: new Date(),
          })
          .where(eq(schema.pageBanners.id, existing.id));
      } else {
        await db.insert(schema.pageBanners).values({
          pageSlug: validated.pageSlug,
          titleI18n: {
            id: validated.titleId,
            en: validated.titleEn || validated.titleId,
            zh: validated.titleZh || validated.titleId,
          },
          breadcrumbI18n: {
            id: validated.breadcrumbId || validated.titleId,
            en: validated.breadcrumbEn || validated.breadcrumbId || validated.titleId,
            zh: validated.breadcrumbZh || validated.breadcrumbId || validated.titleId,
          },
          backgroundImageUrl: validated.backgroundImageUrl,
          updatedAt: new Date(),
        });
      }
    } catch (dbErr) {
      console.warn("[Banner Action] DB save fallback:", dbErr);
    }

    // Invalidate Redis cache
    await cache.del(`public:banner:${validated.pageSlug}`);
    await cache.del("public:banners");

    safeRevalidate("/about");
    safeRevalidate("/");
    safeRevalidate("/admin/banners");

    return { success: true, message: "Banner halaman berhasil diperbarui" };
  } catch (err: any) {
    const msg = err.issues?.[0]?.message || err.message || "Gagal memperbarui banner halaman";
    return { success: false, message: msg };
  }
}
