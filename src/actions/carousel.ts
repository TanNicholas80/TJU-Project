"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { cache } from "@/lib/cache";
import { defaultHeroCarousels } from "@/lib/data-defaults";
import { translateContentBatch } from "@/lib/translator";
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

export async function getCarouselById(id: number) {
  try {
    const data = await db
      .select()
      .from(schema.heroCarousels)
      .where(eq(schema.heroCarousels.id, id))
      .limit(1);

    if (data && data.length > 0) {
      return { success: true, data: data[0] };
    }

    const defaultItem = defaultHeroCarousels.find((item) => item.id === id);
    if (defaultItem) {
      return { success: true, data: defaultItem };
    }

    return { success: false, message: "Slide carousel tidak ditemukan" };
  } catch (error) {
    const defaultItem = defaultHeroCarousels.find((item) => item.id === id);
    if (defaultItem) {
      return { success: true, data: defaultItem };
    }
    return { success: false, message: "Gagal mengambil data slide carousel" };
  }
}

export async function createCarousel(input: CarouselInput) {
  try {
    const validated = carouselSchema.parse(input);

    const descId = validated.descriptionId || validated.subtitleId || "";

    // Trigger Gemini auto-translation jika EN atau ZH belum disediakan
    let autoEn: Record<string, string> = {};
    let autoZh: Record<string, string> = {};
    if (!validated.titleEn || !validated.titleZh) {
      try {
        const trans = await translateContentBatch({
          subheader: validated.subheaderId,
          title: validated.titleId,
          description: descId,
          loadingTitle: validated.loadingTitleId,
          ctaText: validated.ctaTextId,
        });
        autoEn = trans.en;
        autoZh = trans.zh;
      } catch (tErr) {
        console.warn("[Carousel Action] Auto-translate error:", tErr);
      }
    }

    const subheaderEn = validated.subheaderEn || autoEn.subheader || validated.subheaderId;
    const subheaderZh = validated.subheaderZh || autoZh.subheader || validated.subheaderId;

    const titleEn = validated.titleEn || autoEn.title || validated.titleId;
    const titleZh = validated.titleZh || autoZh.title || validated.titleId;

    const descEn = validated.descriptionEn || validated.subtitleEn || autoEn.description || descId;
    const descZh = validated.descriptionZh || validated.subtitleZh || autoZh.description || descId;

    const loadingTitleEn = validated.loadingTitleEn || autoEn.loadingTitle || validated.loadingTitleId;
    const loadingTitleZh = validated.loadingTitleZh || autoZh.loadingTitle || validated.loadingTitleId;

    const ctaTextEn = validated.ctaTextEn || autoEn.ctaText || "Project Consultation";
    const ctaTextZh = validated.ctaTextZh || autoZh.ctaText || "项目咨询";

    try {
      await db.insert(schema.heroCarousels).values({
        imageUrl: validated.imageUrl,
        subheaderI18n: validated.subheaderId
          ? {
              id: validated.subheaderId,
              en: subheaderEn || validated.subheaderId,
              zh: subheaderZh || validated.subheaderId,
            }
          : null,
        titleI18n: {
          id: validated.titleId,
          en: titleEn,
          zh: titleZh,
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
              en: loadingTitleEn || validated.loadingTitleId,
              zh: loadingTitleZh || validated.loadingTitleId,
            }
          : null,
        ctaTextI18n: {
          id: validated.ctaTextId || "Konsultasi Proyek",
          en: ctaTextEn,
          zh: ctaTextZh,
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

    // Trigger Gemini auto-translation jika EN atau ZH belum disediakan
    let autoEn: Record<string, string> = {};
    let autoZh: Record<string, string> = {};
    if (!validated.titleEn || !validated.titleZh) {
      try {
        const trans = await translateContentBatch({
          subheader: validated.subheaderId,
          title: validated.titleId,
          description: descId,
          loadingTitle: validated.loadingTitleId,
          ctaText: validated.ctaTextId,
        });
        autoEn = trans.en;
        autoZh = trans.zh;
      } catch (tErr) {
        console.warn("[Carousel Action] Auto-translate error:", tErr);
      }
    }

    const subheaderEn = validated.subheaderEn || autoEn.subheader || validated.subheaderId;
    const subheaderZh = validated.subheaderZh || autoZh.subheader || validated.subheaderId;

    const titleEn = validated.titleEn || autoEn.title || validated.titleId;
    const titleZh = validated.titleZh || autoZh.title || validated.titleId;

    const descEn = validated.descriptionEn || validated.subtitleEn || autoEn.description || descId;
    const descZh = validated.descriptionZh || validated.subtitleZh || autoZh.description || descId;

    const loadingTitleEn = validated.loadingTitleEn || autoEn.loadingTitle || validated.loadingTitleId;
    const loadingTitleZh = validated.loadingTitleZh || autoZh.loadingTitle || validated.loadingTitleId;

    const ctaTextEn = validated.ctaTextEn || autoEn.ctaText || "Project Consultation";
    const ctaTextZh = validated.ctaTextZh || autoZh.ctaText || "项目咨询";

    try {
      await db
        .update(schema.heroCarousels)
        .set({
          imageUrl: validated.imageUrl,
          subheaderI18n: validated.subheaderId
            ? {
                id: validated.subheaderId,
                en: subheaderEn || validated.subheaderId,
                zh: subheaderZh || validated.subheaderId,
              }
            : null,
          titleI18n: {
            id: validated.titleId,
            en: titleEn,
            zh: titleZh,
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
                en: loadingTitleEn || validated.loadingTitleId,
                zh: loadingTitleZh || validated.loadingTitleId,
              }
            : null,
          ctaTextI18n: {
            id: validated.ctaTextId || "Konsultasi Proyek",
            en: ctaTextEn,
            zh: ctaTextZh,
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
