import { db } from "@/db";
import * as schema from "@/db/schema";
import { asc, desc, eq } from "drizzle-orm";
import { cache } from "./cache";
import {
  defaultHeroCarousels,
  defaultQualityStandards,
  defaultPortfolios,
  defaultPosts,
  defaultCompanyProfile,
  defaultCategoriesPortfolio,
  defaultCategoriesPost,
  defaultPageBanners,
  defaultCertifications,
} from "./data-defaults";

export async function getHeroCarousels() {
  return cache.getOrSet("public:hero_carousels", async () => {
    try {
      const data = await db
        .select()
        .from(schema.heroCarousels)
        .where(eq(schema.heroCarousels.isActive, true))
        .orderBy(asc(schema.heroCarousels.sortOrder));

      if (data && data.length > 0) {
        return data;
      }
      return defaultHeroCarousels;
    } catch (err) {
      console.warn("[DataService] Database query for hero_carousels failed, using defaults:", err);
      return defaultHeroCarousels;
    }
  }, 3600);
}

export async function getQualityStandards() {
  return cache.getOrSet("public:quality_standards", async () => {
    try {
      const data = await db
        .select()
        .from(schema.qualityStandards)
        .where(eq(schema.qualityStandards.isActive, true))
        .orderBy(asc(schema.qualityStandards.sortOrder));

      if (data && data.length > 0) {
        return data;
      }
      return defaultQualityStandards;
    } catch (err) {
      console.warn("[DataService] Database query for quality_standards failed, using defaults:", err);
      return defaultQualityStandards;
    }
  }, 3600);
}

export async function getPortfolios(limit: number = 4) {
  return cache.getOrSet(`public:portfolios:limit_${limit}`, async () => {
    try {
      const rows = await db
        .select({
          portfolio: schema.portfolios,
          category: schema.categoriesPortfolio,
        })
        .from(schema.portfolios)
        .leftJoin(
          schema.categoriesPortfolio,
          eq(schema.portfolios.categoryPortfolioId, schema.categoriesPortfolio.id)
        )
        .where(eq(schema.portfolios.status, "published"))
        .orderBy(desc(schema.portfolios.createdAt))
        .limit(limit);

      if (rows && rows.length > 0) {
        return rows.map((r: any) => ({
          ...r.portfolio,
          categoryName: r.category?.nameI18n?.id || "Konstruksi",
        }));
      }
      return defaultPortfolios.slice(0, limit);
    } catch (err) {
      console.warn("[DataService] Database query for portfolios failed, using defaults:", err);
      return defaultPortfolios.slice(0, limit);
    }
  }, 3600);
}

export async function getPosts(limit: number = 3) {
  return cache.getOrSet(`public:posts:limit_${limit}`, async () => {
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
        .where(eq(schema.posts.status, "published"))
        .orderBy(desc(schema.posts.createdAt))
        .limit(limit);

      if (rows && rows.length > 0) {
        return rows.map((r: any) => ({
          ...r.post,
          categoryName: r.category?.nameI18n?.id || "Umum",
        }));
      }
      return defaultPosts.slice(0, limit);
    } catch (err) {
      console.warn("[DataService] Database query for posts failed, using defaults:", err);
      return defaultPosts.slice(0, limit);
    }
  }, 3600);
}

export async function getCompanyProfile() {
  return cache.getOrSet("public:company_profile", async () => {
    try {
      const [profile] = await db.select().from(schema.companyProfile).limit(1);
      if (profile) {
        return profile;
      }
      return defaultCompanyProfile;
    } catch (err) {
      console.warn("[DataService] Database query for company_profile failed, using defaults:", err);
      return defaultCompanyProfile;
    }
  }, 86400);
}

export async function getCategoriesPortfolio() {
  return cache.getOrSet("public:categories_portfolio", async () => {
    try {
      const data = await db.select().from(schema.categoriesPortfolio);
      if (data && data.length > 0) return data;
      return defaultCategoriesPortfolio;
    } catch (err) {
      return defaultCategoriesPortfolio;
    }
  }, 86400);
}

export async function getCategoriesPost() {
  return cache.getOrSet("public:categories_post", async () => {
    try {
      const data = await db.select().from(schema.categoriesPost);
      if (data && data.length > 0) return data;
      return defaultCategoriesPost;
    } catch (err) {
      return defaultCategoriesPost;
    }
  }, 86400);
}

export async function getPageBanner(pageSlug: string = "about-us") {
  return cache.getOrSet(`public:banner:${pageSlug}`, async () => {
    try {
      const [banner] = await db
        .select()
        .from(schema.pageBanners)
        .where(eq(schema.pageBanners.pageSlug, pageSlug))
        .limit(1);

      if (banner) {
        return banner;
      }
      return defaultPageBanners[pageSlug] || defaultPageBanners["about-us"];
    } catch (err) {
      console.warn(`[DataService] Database query for banner ${pageSlug} failed, using default:`, err);
      return defaultPageBanners[pageSlug] || defaultPageBanners["about-us"];
    }
  }, 3600);
}

export async function getCertifications() {
  return cache.getOrSet("public:certifications", async () => {
    try {
      const data = await db
        .select()
        .from(schema.certifications)
        .where(eq(schema.certifications.isActive, true))
        .orderBy(asc(schema.certifications.sortOrder));

      if (data && data.length > 0) {
        return data;
      }
      return defaultCertifications;
    } catch (err) {
      console.warn("[DataService] Database query for certifications failed, using defaults:", err);
      return defaultCertifications;
    }
  }, 3600);
}

