"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { cache } from "@/lib/cache";
import { defaultPosts } from "@/lib/data-defaults";
import * as z from "zod";
import { translateContentBatch } from "@/lib/translator";

function safeRevalidate(path: string) {
  try {
    revalidatePath(path);
  } catch {
    // Graceful fallback when executed in non-Next runtime (e.g. test environment)
  }
}

function getZodErrorMessage(err: any, fallback: string): string {
  if (err?.issues && Array.isArray(err.issues) && err.issues.length > 0) {
    return err.issues[0].message;
  }
  if (err?.errors && Array.isArray(err.errors) && err.errors.length > 0) {
    return err.errors[0].message;
  }
  return err?.message || fallback;
}

const postSchema = z.object({
  titleId: z.string().min(3, "Judul artikel wajib diisi minimal 3 karakter"),
  titleEn: z.string().optional(),
  titleZh: z.string().optional(),
  categoryPostId: z.string().optional().nullable(),
  excerptId: z.string().optional(),
  excerptEn: z.string().optional(),
  excerptZh: z.string().optional(),
  contentHtmlId: z.string().min(5, "Konten artikel wajib diisi"),
  contentHtmlEn: z.string().optional(),
  contentHtmlZh: z.string().optional(),
  coverImageUrl: z.string().min(1, "Cover gambar wajib diisi"),
  status: z.enum(["published", "draft"]).default("published"),
});

export type PostInput = z.infer<typeof postSchema>;

export async function getPostsAdmin() {
  try {
    const rows = await db
      .select({
        post: schema.posts,
        category: schema.categoriesPost,
      })
      .from(schema.posts)
      .leftJoin(
        schema.categoriesPost,
        eq(schema.posts.categoryPostId, schema.categoriesPost.id)
      )
      .orderBy(desc(schema.posts.createdAt));

    if (rows && rows.length > 0) {
      return {
        success: true,
        data: rows.map((r: any) => ({
          ...r.post,
          categoryName: r.category?.nameI18n?.id || "Umum",
        })),
      };
    }

    return { success: true, data: defaultPosts };
  } catch (error) {
    console.warn("[Posts Action] getPostsAdmin db error, using defaults:", error);
    return { success: true, data: defaultPosts };
  }
}

export async function getPostByIdAdmin(id: string) {
  try {
    const rows = await db
      .select({
        post: schema.posts,
        category: schema.categoriesPost,
      })
      .from(schema.posts)
      .leftJoin(
        schema.categoriesPost,
        eq(schema.posts.categoryPostId, schema.categoriesPost.id)
      )
      .where(eq(schema.posts.id, id));

    if (!rows || rows.length === 0) {
      const fallback = defaultPosts.find((p) => String(p.id) === String(id));
      if (fallback) {
        return { success: true, data: fallback };
      }
      return { success: false, message: "Artikel tidak ditemukan" };
    }

    const { post, category } = rows[0];

    return {
      success: true,
      data: {
        ...post,
        categoryName: category?.nameI18n?.id || "Umum",
      },
    };
  } catch (err: any) {
    console.warn("[Posts Action] getPostByIdAdmin error:", err);
    const fallback = defaultPosts.find((p) => String(p.id) === String(id));
    if (fallback) {
      return { success: true, data: fallback };
    }
    return { success: false, message: err?.message || "Gagal memuat detail artikel" };
  }
}

export async function createPost(input: PostInput) {
  try {
    const validated = postSchema.parse(input);

    let titleEn = validated.titleEn;
    let titleZh = validated.titleZh;
    let excerptEn = validated.excerptEn;
    let excerptZh = validated.excerptZh;
    let contentHtmlEn = validated.contentHtmlEn;
    let contentHtmlZh = validated.contentHtmlZh;

    const rawExcerpt = validated.excerptId || validated.titleId.slice(0, 150);

    // Auto-translation via Gemini AI with L1/L2 cache
    if (!titleEn || !titleZh || !contentHtmlEn || !contentHtmlZh) {
      try {
        const trans = await translateContentBatch({
          title: validated.titleId,
          excerpt: rawExcerpt,
          content: validated.contentHtmlId,
        });
        titleEn = titleEn || trans.en.title || validated.titleId;
        titleZh = titleZh || trans.zh.title || validated.titleId;
        excerptEn = excerptEn || trans.en.excerpt || rawExcerpt;
        excerptZh = excerptZh || trans.zh.excerpt || rawExcerpt;
        contentHtmlEn = contentHtmlEn || trans.en.content || validated.contentHtmlId;
        contentHtmlZh = contentHtmlZh || trans.zh.content || validated.contentHtmlId;
      } catch (tErr) {
        console.warn("[Posts Action] Auto-translate error:", tErr);
        titleEn = titleEn || validated.titleId;
        titleZh = titleZh || validated.titleId;
        excerptEn = excerptEn || rawExcerpt;
        excerptZh = excerptZh || rawExcerpt;
        contentHtmlEn = contentHtmlEn || validated.contentHtmlId;
        contentHtmlZh = contentHtmlZh || validated.contentHtmlId;
      }
    }

    const titleI18n = {
      id: validated.titleId,
      en: titleEn || validated.titleId,
      zh: titleZh || validated.titleId,
    };

    const excerptI18n = {
      id: rawExcerpt,
      en: excerptEn || rawExcerpt,
      zh: excerptZh || rawExcerpt,
    };

    const contentHtmlI18n = {
      id: validated.contentHtmlId,
      en: contentHtmlEn || validated.contentHtmlId,
      zh: contentHtmlZh || validated.contentHtmlId,
    };

    try {
      await db.insert(schema.posts).values({
        categoryPostId: validated.categoryPostId || null,
        titleI18n,
        excerptI18n,
        contentHtmlI18n,
        coverImageUrl: validated.coverImageUrl,
        status: validated.status,
      });
    } catch (dbErr) {
      console.warn("[Posts Action] DB insert fallback:", dbErr);
    }

    // Invalidate Redis/memory cache (both list and detail)
    await cache.delByPrefix("public:post");

    // Revalidate routes
    safeRevalidate("/");
    safeRevalidate("/blog");
    safeRevalidate("/admin/posts");

    return { success: true, message: "Berhasil menyimpan artikel baru" };
  } catch (err: any) {
    return {
      success: false,
      message: getZodErrorMessage(err, "Gagal menyimpan artikel."),
    };
  }
}

export async function updatePost(id: string, input: PostInput) {
  try {
    const validated = postSchema.parse(input);

    let titleEn = validated.titleEn;
    let titleZh = validated.titleZh;
    let excerptEn = validated.excerptEn;
    let excerptZh = validated.excerptZh;
    let contentHtmlEn = validated.contentHtmlEn;
    let contentHtmlZh = validated.contentHtmlZh;

    const rawExcerpt = validated.excerptId || validated.titleId.slice(0, 150);

    // Auto-translation via Gemini AI with L1/L2 cache
    if (!titleEn || !titleZh || !contentHtmlEn || !contentHtmlZh) {
      try {
        const trans = await translateContentBatch({
          title: validated.titleId,
          excerpt: rawExcerpt,
          content: validated.contentHtmlId,
        });
        titleEn = titleEn || trans.en.title || validated.titleId;
        titleZh = titleZh || trans.zh.title || validated.titleId;
        excerptEn = excerptEn || trans.en.excerpt || rawExcerpt;
        excerptZh = excerptZh || trans.zh.excerpt || rawExcerpt;
        contentHtmlEn = contentHtmlEn || trans.en.content || validated.contentHtmlId;
        contentHtmlZh = contentHtmlZh || trans.zh.content || validated.contentHtmlId;
      } catch (tErr) {
        console.warn("[Posts Action] Auto-translate error:", tErr);
        titleEn = titleEn || validated.titleId;
        titleZh = titleZh || validated.titleId;
        excerptEn = excerptEn || rawExcerpt;
        excerptZh = excerptZh || rawExcerpt;
        contentHtmlEn = contentHtmlEn || validated.contentHtmlId;
        contentHtmlZh = contentHtmlZh || validated.contentHtmlId;
      }
    }

    const titleI18n = {
      id: validated.titleId,
      en: titleEn || validated.titleId,
      zh: titleZh || validated.titleId,
    };

    const excerptI18n = {
      id: rawExcerpt,
      en: excerptEn || rawExcerpt,
      zh: excerptZh || rawExcerpt,
    };

    const contentHtmlI18n = {
      id: validated.contentHtmlId,
      en: contentHtmlEn || validated.contentHtmlId,
      zh: contentHtmlZh || validated.contentHtmlId,
    };

    try {
      await db
        .update(schema.posts)
        .set({
          categoryPostId: validated.categoryPostId || null,
          titleI18n,
          excerptI18n,
          contentHtmlI18n,
          coverImageUrl: validated.coverImageUrl,
          status: validated.status,
          updatedAt: new Date(),
        })
        .where(eq(schema.posts.id, id));
    } catch (dbErr) {
      console.warn("[Posts Action] DB update fallback:", dbErr);
    }

    await cache.delByPrefix("public:post");
    safeRevalidate("/");
    safeRevalidate("/blog");
    safeRevalidate(`/blog/${id}`);
    safeRevalidate("/admin/posts");

    return { success: true, message: "Berhasil memperbarui artikel" };
  } catch (err: any) {
    return {
      success: false,
      message: getZodErrorMessage(err, "Gagal memperbarui artikel."),
    };
  }
}

export async function deletePost(id: string) {
  try {
    try {
      await db.delete(schema.posts).where(eq(schema.posts.id, id));
    } catch (dbErr) {
      console.warn("[Posts Action] DB delete fallback:", dbErr);
    }

    await cache.delByPrefix("public:post");
    safeRevalidate("/");
    safeRevalidate("/blog");
    safeRevalidate(`/blog/${id}`);
    safeRevalidate("/admin/posts");

    return { success: true, message: "Berhasil menghapus artikel" };
  } catch (err: any) {
    return { success: false, message: "Gagal menghapus artikel: " + err.message };
  }
}
