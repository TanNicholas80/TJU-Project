import { MetadataRoute } from "next";
import { getPosts, getPortfolios } from "@/lib/data-service";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://tjutruss.com";

  // Static core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/portofolio`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.85,
    },
  ];

  // Dynamic posts
  try {
    const posts = await getPosts(50);
    const postRoutes: MetadataRoute.Sitemap = (posts as any[]).map((post: any) => ({
      url: `${baseUrl}/blog/${post.id}`,
      lastModified: post.createdAt ? new Date(post.createdAt) : new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

    // Dynamic portfolios
    const portfolios = await getPortfolios(50);
    const portfolioRoutes: MetadataRoute.Sitemap = (portfolios as any[]).map((item: any) => ({
      url: `${baseUrl}/portofolio/${item.id}`,
      lastModified: item.createdAt ? new Date(item.createdAt) : new Date(),
      changeFrequency: "monthly",
      priority: 0.75,
    }));

    return [...staticRoutes, ...postRoutes, ...portfolioRoutes];
  } catch {
    return staticRoutes;
  }
}
