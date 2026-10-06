"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { cache } from "@/lib/cache";
import { defaultCategoriesPost } from "@/lib/data-defaults";
import * as z from "zod";
import { translateContentBatch } from "@/lib/translator";

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

const postCategorySchema = z.object({
  nameId: z.string().min(2, "Nama kategori wajib diisi minimal 2 karakter"),
  nameEn: z.string().optional(),
  nameZh: z.string().optional(),
  slug: z.string().optional(),
});

export type PostCategoryInput = z.infer<typeof postCategorySchema>;

export async function getPostCategoriesAdmin() {
  try {
    const data = await db
      .select()
      .from(schema.categoriesPost)
      .orderBy(desc(schema.categoriesPost.createdAt));

    if (data && data.length > 0) {
      return { success: true, data };
    }
    return { success: true, data: defaultCategoriesPost };
  } catch (error) {
    console.warn("[Post Categories Action] getPostCategoriesAdmin db error, using defaults:", error);
    return { success: true, data: defaultCategoriesPost };
  }
}

export async function createPostCategory(input: PostCategoryInput) {
  try {
    const validated = postCategorySchema.parse(input);
    const finalSlug = validated.slug && validated.slug.trim().length > 0
      ? slugify(validated.slug)
      : slugify(validated.nameId);

    let nameEn = validated.nameEn;
    let nameZh = validated.nameZh;

    // Auto-translation via Gemini AI with L1/L2 cache
    if (!nameEn || !nameZh) {
      try {
        const trans = await translateContentBatch({
          name: validated.nameId,
        });
        nameEn = nameEn || trans.en.name || validated.nameId;
        nameZh = nameZh || trans.zh.name || validated.nameId;
      } catch (tErr) {
        console.warn("[Post Category Action] Auto-translate error:", tErr);
        nameEn = nameEn || validated.nameId;
        nameZh = nameZh || validated.nameId;
      }
    }

    try {
      await db.insert(schema.categoriesPost).values({
        slug: finalSlug,
        nameI18n: {
          id: validated.nameId,
          en: nameEn,
          zh: nameZh,
        },
      });
    } catch (dbErr) {
      console.warn("[Post Category Action] DB insert fallback:", dbErr);
    }

    // Invalidate Redis cache
    await cache.del("public:categories_post");

    safeRevalidate("/blog");
    safeRevalidate("/admin/post-categories");
    safeRevalidate("/admin/posts");

    return { success: true, message: "Kategori artikel berhasil dibuat" };
  } catch (err: any) {
    const msg = err.issues?.[0]?.message || err.message || "Gagal membuat kategori artikel";
    return { success: false, message: msg };
  }
}

export async function updatePostCategory(id: number, input: PostCategoryInput) {
  try {
    const validated = postCategorySchema.parse(input);
    const finalSlug = validated.slug && validated.slug.trim().length > 0
      ? slugify(validated.slug)
      : slugify(validated.nameId);

    let nameEn = validated.nameEn;
    let nameZh = validated.nameZh;

    // Auto-translation via Gemini AI with L1/L2 cache
    if (!nameEn || !nameZh) {
      try {
        const trans = await translateContentBatch({
          name: validated.nameId,
        });
        nameEn = nameEn || trans.en.name || validated.nameId;
        nameZh = nameZh || trans.zh.name || validated.nameId;
      } catch (tErr) {
        console.warn("[Post Category Action] Auto-translate error:", tErr);
        nameEn = nameEn || validated.nameId;
        nameZh = nameZh || validated.nameId;
      }
    }

    try {
      await db
        .update(schema.categoriesPost)
        .set({
          slug: finalSlug,
          nameI18n: {
            id: validated.nameId,
            en: nameEn,
            zh: nameZh,
          },
        })
        .where(eq(schema.categoriesPost.id, id));
    } catch (dbErr) {
      console.warn("[Post Category Action] DB update fallback:", dbErr);
    }

    // Invalidate Redis cache
    await cache.del("public:categories_post");

    safeRevalidate("/blog");
    safeRevalidate("/admin/post-categories");
    safeRevalidate("/admin/posts");

    return { success: true, message: "Kategori artikel berhasil diperbarui" };
  } catch (err: any) {
    const msg = err.issues?.[0]?.message || err.message || "Gagal memperbarui kategori artikel";
    return { success: false, message: msg };
  }
}

export async function deletePostCategory(id: number) {
  try {
    try {
      await db
        .delete(schema.categoriesPost)
        .where(eq(schema.categoriesPost.id, id));
    } catch (dbErr) {
      console.warn("[Post Category Action] DB delete fallback:", dbErr);
    }

    // Invalidate Redis cache
    await cache.del("public:categories_post");

    safeRevalidate("/blog");
    safeRevalidate("/admin/post-categories");
    safeRevalidate("/admin/posts");

    return { success: true, message: "Kategori artikel berhasil dihapus" };
  } catch (err: any) {
    return { success: false, message: err.message || "Gagal menghapus kategori artikel" };
  }
}
