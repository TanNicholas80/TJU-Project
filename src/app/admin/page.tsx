import Link from "next/link";
import {
  Briefcase,
  FileText,
  Images,
  Award,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPortfoliosAdmin } from "@/actions/portfolios";
import { getPostsAdmin } from "@/actions/posts";
import { getCarouselsAdmin } from "@/actions/carousel";
import { getStandardsAdmin } from "@/actions/standards";

export default async function AdminDashboardPage() {
  const [portfoliosRes, postsRes, carouselRes, standardsRes] =
    await Promise.all([
      getPortfoliosAdmin(),
      getPostsAdmin(),
      getCarouselsAdmin(),
      getStandardsAdmin(),
    ]);

  const portfolios = portfoliosRes.data || [];
  const posts = postsRes.data || [];
  const carousels = carouselRes.data || [];
  const standards = standardsRes.data || [];

  const stats = [
    {
      title: "Portofolio Proyek",
      value: portfolios.length,
      subtitle: `${portfolios.filter((p: any) => p.status === "published").length} diterbitkan`,
      icon: Briefcase,
      color: "bg-blue-50 text-[#20449A]",
      href: "/admin/portfolios",
    },
    {
      title: "Artikel Blog",
      value: posts.length,
      subtitle: `${posts.filter((p: any) => p.status === "published").length} tayang publik`,
      icon: FileText,
      color: "bg-amber-50 text-[#F48902]",
      href: "/admin/posts",
    },
    {
      title: "Banner Carousel",
      value: carousels.length,
      subtitle: `${carousels.filter((c: any) => c.isActive).length} slide aktif di beranda`,
      icon: Images,
      color: "bg-emerald-50 text-emerald-600",
      href: "/admin/carousel",
    },
    {
      title: "Standar Rekayasa",
      value: standards.length,
      subtitle: `${standards.filter((s: any) => s.isActive).length} pilar mutu aktif`,
      icon: Award,
      color: "bg-indigo-50 text-indigo-600",
      href: "/admin/standards",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Greeting Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#18367D] to-[#20449A] p-8 text-white shadow-lg">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md">
            <Zap className="h-3.5 w-3.5 text-[#F48902]" />
            Panel Manajemen Konten Terintegrasi
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Selamat Datang di Admin CMS TJU Truss
          </h2>
          <p className="text-sm text-blue-100/90 leading-relaxed font-light">
            Kelola konten dinamis beranda, galeri portofolio, artikel edukatif, dan konfigurasi kontak secara langsung dengan update instan di halaman utama.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link href="/admin/portfolios">
              <Button
                variant="orange"
                size="sm"
                className="font-semibold shadow-sm"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Tambah Portofolio
              </Button>
            </Link>
            <Link href="/admin/posts">
              <Button
                variant="outline"
                size="sm"
                className="bg-white/10 text-white border-white/20 hover:bg-white/20 font-semibold"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Tulis Artikel Blog
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Link
              key={idx}
              href={stat.href}
              className="group rounded-2xl border border-[#E2E4EB] bg-white p-6 shadow-xs transition-all hover:-translate-y-1 hover:shadow-md hover:border-[#20449A]/30"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-zinc-400 group-hover:text-[#20449A] transition-colors" />
              </div>
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#62636C]">
                  {stat.title}
                </p>
                <p className="mt-1 text-3xl font-extrabold text-[#1E1F24]">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-[#62636C]">{stat.subtitle}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Items Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Portfolios */}
        <div className="rounded-2xl border border-[#E2E4EB] bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-[#1E1F24]">
              Portofolio Proyek Terbaru
            </h3>
            <Link
              href="/admin/portfolios"
              className="text-xs font-semibold text-[#20449A] hover:underline"
            >
              Kelola Semua →
            </Link>
          </div>
          <div className="divide-y divide-[#E2E4EB]">
            {portfolios.slice(0, 4).map((item: any) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#1E1F24] truncate">
                    {item.titleI18n?.id || "Proyek Tanpa Judul"}
                  </p>
                  <p className="text-xs text-[#62636C]">{item.location}</p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    item.status === "published"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-zinc-100 text-zinc-600"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Blog Posts */}
        <div className="rounded-2xl border border-[#E2E4EB] bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-[#1E1F24]">
              Artikel Blog Terbaru
            </h3>
            <Link
              href="/admin/posts"
              className="text-xs font-semibold text-[#20449A] hover:underline"
            >
              Kelola Semua →
            </Link>
          </div>
          <div className="divide-y divide-[#E2E4EB]">
            {posts.slice(0, 4).map((item: any) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#1E1F24] truncate">
                    {item.titleI18n?.id || "Artikel Tanpa Judul"}
                  </p>
                  <p className="text-xs text-[#62636C]">
                    Kategori: {item.categoryName || "Umum"}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    item.status === "published"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-zinc-100 text-zinc-600"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
