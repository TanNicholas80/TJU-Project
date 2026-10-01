"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { cache } from "@/lib/cache";
import { defaultHeroCarousels } from "@/lib/data-defaults";
import * as z from "zod";

function safeRevalidate(path: string) {
  try {
    revalidatePath(path);
  } catch {}
}

const carouselSchema = z.object({
  imageUrl: z.string().min(1, "URL Gambar banner wajib diisi"),
  subheaderId: z.string().optional(),
  subheaderEn: z.string().optional(),
  subheaderZh: z.string().optional(),
  titleId: z.string().min(3, "Judul banner wajib diisi"),
  titleEn: z.string().optional(),
  titleZh: z.string().optional(),
  descriptionId: z.string().optional(),
  descriptionEn: z.string().optional(),
  descriptionZh: z.string().optional(),
  loadingTitleId: z.string().optional(),
  loadingTitleEn: z.string().optional(),
  loadingTitleZh: z.string().optional(),
  subtitleId: z.string().optional(),
  subtitleEn: z.string().optional(),
  subtitleZh: z.string().optional(),
  ctaTextId: z.string().optional(),
  ctaTextEn: z.string().optional(),
  ctaTextZh: z.string().optional(),
  ctaLink: z.string().optional(),
  sortOrder: z.coerce.number().default(0),
  isActive: z.boolean().default(true),
});

export type CarouselInput = z.infer<typeof carouselSchema>;

export async function getCarouselsAdmin() {
  try {
    const data = await db
      .select()
      .from(schema.heroCarousels)
      .orderBy(asc(schema.heroCarousels.sortOrder));

    if (data && data.length > 0) {
      return { success: true, data };
    }
    return { success: true, data: defaultHeroCarousels };
  } catch (error) {
    return { success: true, data: defaultHeroCarousels };
  }
}

export async function createCarousel(input: CarouselInput) {
  try {
    const validated = carouselSchema.parse(input);

    const descId = validated.descriptionId || validated.subtitleId || "";
    const descEn = validated.descriptionEn || validated.subtitleEn || descId;
    const descZh = validated.descriptionZh || validated.subtitleZh || descId;

    try {
      await db.insert(schema.heroCarousels).values({
        imageUrl: validated.imageUrl,
        subheaderI18n: validated.subheaderId
          ? {
              id: validated.subheaderId,
              en: validated.subheaderEn || validated.subheaderId,
              zh: validated.subheaderZh || validated.subheaderId,
            }
          : null,
        titleI18n: {
          id: validated.titleId,
          en: validated.titleEn || validated.titleId,
          zh: validated.titleZh || validated.titleId,
        },
        descriptionI18n: descId
          ? {
              id: descId,
              en: descEn,
              zh: descZh,
            }
          : null,
        subtitleI18n: descId
          ? {
              id: descId,
              en: descEn,
              zh: descZh,
            }
          : null,
        loadingTitleI18n: validated.loadingTitleId
          ? {
              id: validated.loadingTitleId,
              en: validated.loadingTitleEn || validated.loadingTitleId,
              zh: validated.loadingTitleZh || validated.loadingTitleId,
            }
          : null,
        ctaTextI18n: {
          id: validated.ctaTextId || "Konsultasi Proyek",
          en: validated.ctaTextEn || "Project Consultation",
          zh: validated.ctaTextZh || "项目咨询",
        },
        ctaLink: validated.ctaLink || "#contact",
        sortOrder: validated.sortOrder,
        isActive: validated.isActive,
      });
    } catch (dbErr) {
      console.warn("[Carousel Action] DB insert fallback:", dbErr);
    }

    await cache.del("public:hero_carousels");
    safeRevalidate("/");
    safeRevalidate("/admin/carousel");

    return { success: true, message: "Berhasil menambahkan slide carousel" };
  } catch (err: any) {
    return {
      success: false,
      message: err.issues?.[0]?.message || err.message || "Gagal menambahkan slide carousel.",
    };
  }
}

export async function updateCarousel(id: number, input: CarouselInput) {
  try {
    const validated = carouselSchema.parse(input);

    const descId = validated.descriptionId || validated.subtitleId || "";
    const descEn = validated.descriptionEn || validated.subtitleEn || descId;
    const descZh = validated.descriptionZh || validated.subtitleZh || descId;

    try {
      await db
        .update(schema.heroCarousels)
        .set({
          imageUrl: validated.imageUrl,
          subheaderI18n: validated.subheaderId
            ? {
                id: validated.subheaderId,
                en: validated.subheaderEn || validated.subheaderId,
                zh: validated.subheaderZh || validated.subheaderId,
              }
            : null,
          titleI18n: {
            id: validated.titleId,
            en: validated.titleEn || validated.titleId,
            zh: validated.titleZh || validated.titleId,
          },
          descriptionI18n: descId
            ? {
                id: descId,
                en: descEn,
                zh: descZh,
              }
            : null,
          subtitleI18n: descId
            ? {
                id: descId,
                en: descEn,
                zh: descZh,
              }
            : null,
          loadingTitleI18n: validated.loadingTitleId
            ? {
                id: validated.loadingTitleId,
                en: validated.loadingTitleEn || validated.loadingTitleId,
                zh: validated.loadingTitleZh || validated.loadingTitleId,
              }
            : null,
          ctaTextI18n: {
            id: validated.ctaTextId || "Konsultasi Proyek",
            en: validated.ctaTextEn || "Project Consultation",
            zh: validated.ctaTextZh || "项目咨询",
          },
          ctaLink: validated.ctaLink || "#contact",
          sortOrder: validated.sortOrder,
          isActive: validated.isActive,
        })
        .where(eq(schema.heroCarousels.id, id));
    } catch (dbErr) {
      console.warn("[Carousel Action] DB update fallback:", dbErr);
    }

    await cache.del("public:hero_carousels");
    safeRevalidate("/");
    safeRevalidate("/admin/carousel");

    return { success: true, message: "Berhasil memperbarui slide carousel" };
  } catch (err: any) {
    return {
      success: false,
      message: err.issues?.[0]?.message || err.message || "Gagal memperbarui slide carousel.",
    };
  }
}

export async function deleteCarousel(id: number) {
  try {
    try {
      await db.delete(schema.heroCarousels).where(eq(schema.heroCarousels.id, id));
    } catch (dbErr) {
      console.warn("[Carousel Action] DB delete fallback:", dbErr);
    }

    await cache.del("public:hero_carousels");
    safeRevalidate("/");
    safeRevalidate("/admin/carousel");

    return { success: true, message: "Berhasil menghapus slide carousel" };
  } catch (err: any) {
    return { success: false, message: "Gagal menghapus slide carousel." };
  }
}
