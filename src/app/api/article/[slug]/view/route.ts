import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { defaultPosts } from "@/lib/data-defaults";
import { cache } from "@/lib/cache";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const numericId = parseInt(slug, 10);
    let updatedViews = 0;

    // 1. Database Atomic Update
    try {
      if (!isNaN(numericId)) {
        const rows = await db
          .update(schema.posts)
          .set({
            views: sql`${schema.posts.views} + 1`,
            updatedAt: new Date(),
          })
          .where(eq(schema.posts.id, numericId))
          .returning({ views: schema.posts.views });

        if (rows && rows.length > 0) {
          updatedViews = rows[0].views;
        }
      }
    } catch (dbErr) {
      console.warn("[API Article View] DB update fallback:", dbErr);
    }

    // 2. In-memory fallback update for local development demo
    const fallbackPost = defaultPosts.find(
      (p) => String(p.id) === slug || (!isNaN(numericId) && p.id === numericId)
    );
    if (fallbackPost) {
      fallbackPost.views = (fallbackPost.views || 0) + 1;
      if (!updatedViews) {
        updatedViews = fallbackPost.views;
      }
    }

    // 3. Clear cache
    if (!isNaN(numericId)) {
      await cache.del(`public:post:${numericId}`);
    }
    await cache.delByPrefix("public:posts");

    try {
      const { revalidatePath } = await import("next/cache");
      revalidatePath("/admin");
    } catch {}

    return NextResponse.json({
      success: true,
      message: "Article view recorded successfully",
      views: updatedViews,
    });
  } catch (error: any) {
    console.error("[API Article View] Error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to record view" },
      { status: 500 }
    );
  }
}
