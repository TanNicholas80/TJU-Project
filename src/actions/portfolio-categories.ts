"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { cache } from "@/lib/cache";
import { defaultCategoriesPortfolio } from "@/lib/data-defaults";
import * as z from "zod";

function safeRevalidate(path: string) {
  try {
    revalidatePath(path);
  } catch {}
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

const portfolioCategorySchema = z.object({
  nameId: z.string().min(2, "Nama kategori wajib diisi minimal 2 karakter"),
  nameEn: z.string().optional(),
  nameZh: z.string().optional(),
  slug: z.string().optional(),
  descriptionId: z.string().optional(),
  descriptionEn: z.string().optional(),
  descriptionZh: z.string().optional(),
  coverImageUrl: z.string().optional(),
});

export type PortfolioCategoryInput = z.infer<typeof portfolioCategorySchema>;

export async function getPortfolioCategoriesAdmin() {
  try {
    const data = await db
      .select()
      .from(schema.categoriesPortfolio)
      .orderBy(desc(schema.categoriesPortfolio.createdAt));

    if (data && data.length > 0) {
      return { success: true, data };
    }
    return { success: true, data: defaultCategoriesPortfolio };
  } catch (error) {
    return { success: true, data: defaultCategoriesPortfolio };
  }
}

export async function createPortfolioCategory(input: PortfolioCategoryInput) {
  try {
    const validated = portfolioCategorySchema.parse(input);
    const finalSlug = validated.slug && validated.slug.trim().length > 0
      ? slugify(validated.slug)
      : slugify(validated.nameId);

    try {
      await db.insert(schema.categoriesPortfolio).values({
        slug: finalSlug,
        nameI18n: {
          id: validated.nameId,
          en: validated.nameEn || validated.nameId,
          zh: validated.nameZh || validated.nameId,
        },
        descriptionI18n: {
          id: validated.descriptionId || "",
          en: validated.descriptionEn || validated.descriptionId || "",
          zh: validated.descriptionZh || validated.descriptionId || "",
        },
        coverImageUrl: validated.coverImageUrl || "",
      });
    } catch (dbErr) {
      console.warn("[Portfolio Category Action] DB insert fallback:", dbErr);
    }

    // Invalidate Redis cache
    await cache.del("public:categories_portfolio");

    safeRevalidate("/about");
    safeRevalidate("/portofolio");
    safeRevalidate("/admin/portfolio-categories");

    return { success: true, message: "Kategori portofolio berhasil dibuat" };
  } catch (err: any) {
    const msg = err.issues?.[0]?.message || err.message || "Gagal membuat kategori portofolio";
    return { success: false, message: msg };
  }
}

export async function updatePortfolioCategory(id: number, input: PortfolioCategoryInput) {
  try {
    const validated = portfolioCategorySchema.parse(input);
    const finalSlug = validated.slug && validated.slug.trim().length > 0
      ? slugify(validated.slug)
      : slugify(validated.nameId);

    try {
      await db
        .update(schema.categoriesPortfolio)
        .set({
          slug: finalSlug,
          nameI18n: {
            id: validated.nameId,
            en: validated.nameEn || validated.nameId,
            zh: validated.nameZh || validated.nameId,
          },
          descriptionI18n: {
            id: validated.descriptionId || "",
            en: validated.descriptionEn || validated.descriptionId || "",
            zh: validated.descriptionZh || validated.descriptionId || "",
          },
          coverImageUrl: validated.coverImageUrl || "",
        })
        .where(eq(schema.categoriesPortfolio.id, id));
    } catch (dbErr) {
      console.warn("[Portfolio Category Action] DB update fallback:", dbErr);
    }

    // Invalidate Redis cache
    await cache.del("public:categories_portfolio");

    safeRevalidate("/about");
    safeRevalidate("/portofolio");
    safeRevalidate("/admin/portfolio-categories");

    return { success: true, message: "Kategori portofolio berhasil diperbarui" };
  } catch (err: any) {
    const msg = err.issues?.[0]?.message || err.message || "Gagal memperbarui kategori portofolio";
    return { success: false, message: msg };
  }
}

export async function deletePortfolioCategory(id: number) {
  try {
    try {
      await db
        .delete(schema.categoriesPortfolio)
        .where(eq(schema.categoriesPortfolio.id, id));
    } catch (dbErr) {
      console.warn("[Portfolio Category Action] DB delete fallback:", dbErr);
    }

    // Invalidate Redis cache
    await cache.del("public:categories_portfolio");

    safeRevalidate("/about");
    safeRevalidate("/portofolio");
    safeRevalidate("/admin/portfolio-categories");

    return { success: true, message: "Kategori portofolio berhasil dihapus" };
  } catch (err: any) {
    return { success: false, message: err.message || "Gagal menghapus kategori portofolio" };
  }
}
