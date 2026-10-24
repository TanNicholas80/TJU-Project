import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { defaultPortfolios } from "@/lib/data-defaults";
import { cache } from "@/lib/cache";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let updatedViews = 0;

    // 1. Database Atomic Update
    try {
      if (id) {
        const rows = await db
          .update(schema.portfolios)
          .set({
            views: sql`${schema.portfolios.views} + 1`,
            updatedAt: new Date(),
          })
          .where(eq(schema.portfolios.id, id))
          .returning({ views: schema.portfolios.views });

        if (rows && rows.length > 0) {
          updatedViews = rows[0].views;
        }
      }
    } catch (dbErr) {
      console.warn("[API Portfolios View] DB update fallback:", dbErr);
    }

    // 2. Fallback memory update
    const fallbackPortfolio = defaultPortfolios.find(
      (p) => String(p.id) === id
    );
    if (fallbackPortfolio) {
      fallbackPortfolio.views = (fallbackPortfolio.views || 0) + 1;
      if (!updatedViews) {
        updatedViews = fallbackPortfolio.views;
      }
    }

    // 3. Clear cache
    if (id) {
      await cache.del(`public:portfolio:${id}`);
    }
    await cache.delByPrefix("public:portfolio");

    return NextResponse.json({
      success: true,
      message: "Portfolio view recorded successfully",
      views: updatedViews,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to record portfolio view" },
      { status: 500 }
    );
  }
}
