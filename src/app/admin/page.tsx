import { getPortfoliosAdmin } from "@/actions/portfolios";
import { getPostsAdmin } from "@/actions/posts";
import { DashboardOverviewClient } from "@/components/admin/dashboard-overview-client";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [portfoliosRes, postsRes] = await Promise.all([
    getPortfoliosAdmin(),
    getPostsAdmin(),
  ]);

  const rawPortfolios = portfoliosRes.data || [];
  const rawPosts = postsRes.data || [];

  // Map to dashboard items
  const blogItems = rawPosts.map((p: any) => ({
    id: p.id,
    name: p.titleI18n?.id || "Artikel Tanpa Judul",
    views: typeof p.views === "number" ? p.views : 0,
    link: `/blog/${p.id}`,
    createdAt: p.createdAt,
  }));

  const portfolioItems = rawPortfolios.map((p: any) => ({
    id: p.id,
    name: p.titleI18n?.id || "Proyek Tanpa Judul",
    views: typeof p.views === "number" ? p.views : 0,
    link: `/portofolio/${p.id}`,
    createdAt: p.createdAt,
  }));

  // Calculate total views from blogs and portfolios
  const blogsTotalViews = blogItems.reduce((acc: number, item: any) => acc + (item.views || 0), 0);
  const portfoliosTotalViews = portfolioItems.reduce((acc: number, item: any) => acc + (item.views || 0), 0);
  const totalViews = blogsTotalViews + portfoliosTotalViews;

  return (
    <DashboardOverviewClient
      blogs={blogItems}
      portfolios={portfolioItems}
      totalViews={totalViews}
      blogCount={blogItems.length}
      portfolioCount={portfolioItems.length}
    />
  );
}
