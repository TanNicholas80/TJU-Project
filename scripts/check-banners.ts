import { db } from "../src/db";
import * as schema from "../src/db/schema";

async function checkBanners() {
  const banners = await db.select().from(schema.pageBanners);
  console.log("Current banners in DB count:", banners.length);
  console.log("Banners data:", banners.map((b: any) => ({ id: b.id, slug: b.pageSlug, title: b.titleI18n })));
  process.exit(0);
}

checkBanners();
