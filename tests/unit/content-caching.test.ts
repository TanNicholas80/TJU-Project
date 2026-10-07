import { describe, it, expect, beforeEach } from "vitest";
import { cache } from "@/lib/cache";
import {
  getHeroCarousels,
  getQualityStandards,
  getPortfolios,
  getPortfolioById,
  getPosts,
  getPostById,
  getCompanyProfile,
  getPageBanner,
  getCertifications,
  getCategoriesPortfolio,
  getCategoriesPost,
} from "@/lib/data-service";

describe("Content Caching & Data Service across Public Pages", () => {
  beforeEach(async () => {
    // Clear public cache prefix before each test
    await cache.delByPrefix("public:");
  });

  it("should cache and serve hero carousels under public:hero_carousels", async () => {
    const data1 = await getHeroCarousels();
    expect(data1.length).toBeGreaterThan(0);

    const cached = await cache.get("public:hero_carousels");
    expect(cached).toBeDefined();

    const data2 = await getHeroCarousels();
    expect(data2).toEqual(cached);
  });

  it("should cache and serve quality standards under public:quality_standards", async () => {
    const data = await getQualityStandards();
    expect(data.length).toBeGreaterThanOrEqual(3);

    const cached = await cache.get("public:quality_standards");
    expect(cached).toBeDefined();
  });

  it("should cache portfolios with query limit key", async () => {
    const list = await getPortfolios(4);
    expect(list.length).toBeGreaterThan(0);

    const cached = await cache.get("public:portfolios:limit_4");
    expect(cached).toBeDefined();
  });

  it("should cache individual portfolio by ID and retrieve on subsequent call", async () => {
    const item = await getPortfolioById("1");
    expect(item).toBeDefined();

    const cached = await cache.get("public:portfolio:1");
    expect(cached).toBeDefined();
  });

  it("should cache blog posts with query limit key and individual post by ID", async () => {
    const posts = await getPosts(3);
    expect(posts.length).toBeGreaterThan(0);

    const cachedPosts = await cache.get("public:posts:limit_3");
    expect(cachedPosts).toBeDefined();

    const singlePost = await getPostById("1");
    expect(singlePost).toBeDefined();

    const cachedSingle = await cache.get("public:post:1");
    expect(cachedSingle).toBeDefined();
  });

  it("should cache company profile for contact section and footer", async () => {
    const profile = await getCompanyProfile();
    expect(profile.phone).toBeTruthy();

    const cached = await cache.get("public:company_profile");
    expect(cached).toBeDefined();
  });

  it("should cache page banners by pageSlug", async () => {
    const banner = await getPageBanner("about-us");
    expect(banner).toBeDefined();

    const cached = await cache.get("public:banner:about-us");
    expect(cached).toBeDefined();
  });

  it("should cache certifications list", async () => {
    const certs = await getCertifications();
    expect(certs.length).toBeGreaterThan(0);

    const cached = await cache.get("public:certifications");
    expect(cached).toBeDefined();
  });

  it("should cache taxonomy categories for portfolio and post filters", async () => {
    const portCats = await getCategoriesPortfolio();
    expect(portCats.length).toBeGreaterThan(0);

    const postCats = await getCategoriesPost();
    expect(postCats.length).toBeGreaterThan(0);

    expect(await cache.get("public:categories_portfolio")).toBeDefined();
    expect(await cache.get("public:categories_post")).toBeDefined();
  });

  it("should successfully invalidate cache entries when delByPrefix is called", async () => {
    await getHeroCarousels();
    await getQualityStandards();

    expect(await cache.get("public:hero_carousels")).toBeDefined();
    expect(await cache.get("public:quality_standards")).toBeDefined();

    await cache.delByPrefix("public:");

    expect(await cache.get("public:hero_carousels")).toBeNull();
    expect(await cache.get("public:quality_standards")).toBeNull();
  });
});
