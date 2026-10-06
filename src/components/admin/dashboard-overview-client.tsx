"use client";

import * as React from "react";
import Link from "next/link";
import {
  FileText,
  Briefcase,
  Eye,
  Trophy,
  Medal,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardItem {
  id: number | string;
  name: string;
  views: number;
  link: string;
  createdAt?: string | Date;
}

interface DashboardOverviewClientProps {
  blogs: DashboardItem[];
  portfolios: DashboardItem[];
  totalViews: number;
  blogCount: number;
  portfolioCount: number;
}

export function DashboardOverviewClient({
  blogs,
  portfolios,
  totalViews,
  blogCount,
  portfolioCount,
}: DashboardOverviewClientProps) {
  const [activeTab, setActiveTab] = React.useState<"blog" | "portofolio">("blog");

  // Determine top 5 items for the selected tab sorted by views descending
  const currentItems = React.useMemo(() => {
    const source = activeTab === "blog" ? blogs : portfolios;
    return [...source].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);
  }, [activeTab, blogs, portfolios]);

  // Format date helper: "30 Sep 2026"
  const formatDate = (dateVal?: string | Date) => {
    if (!dateVal) return "Sep 2026";
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return "Sep 2026";
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Recent 5 items for the right column
  const recentBlogs = blogs.slice(0, 5);
  const recentPortfolios = portfolios.slice(0, 5);

  return (
    <div className="w-full space-y-6 sm:space-y-8">
      {/* 1. Header Sesuai Desain */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1E1F24]">
          Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-[#62636C] mt-1 font-normal">
          Ringkasan statistik konten dan aktivitas pengunjung terbaru
        </p>
      </div>

      {/* 2. Tiga Kartu Metrik Utama Berwarna Biru TJU TRUSS (Full Width) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 w-full">
        {/* Card 1: Portofolio Proyek */}
        <div className="flex flex-col justify-between rounded-2xl border border-[#E2E4EB] bg-white p-6 shadow-xs transition-all hover:shadow-md hover:border-[#20449A]/30">
          <div>
            <div className="flex items-center justify-between">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#20449A]">
                <Briefcase className="h-6 w-6" />
              </div>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                Aktif
              </span>
            </div>
            <div className="mt-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#62636C]">
                Portofolio Proyek
              </span>
              <p className="text-3xl sm:text-4xl font-extrabold text-[#1E1F24] tracking-tight mt-1">
                {portfolioCount}
              </p>
              <p className="text-xs text-[#62636C] mt-1">
                Rekam jejak konstruksi terbit
              </p>
            </div>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
            <Link
              href="/admin/portfolios"
              className="inline-flex items-center text-xs font-bold text-[#20449A] hover:text-[#18367D] transition-colors group"
            >
              <span>Kelola Portofolio</span>
              <ChevronRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Card 2: Blog / Artikel */}
        <div className="flex flex-col justify-between rounded-2xl border border-[#E2E4EB] bg-white p-6 shadow-xs transition-all hover:shadow-md hover:border-[#20449A]/30">
          <div>
            <div className="flex items-center justify-between">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#20449A]">
                <FileText className="h-6 w-6" />
              </div>
              <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
                Publikasi
              </span>
            </div>
            <div className="mt-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#62636C]">
                Blog & Artikel
              </span>
              <p className="text-3xl sm:text-4xl font-extrabold text-[#1E1F24] tracking-tight mt-1">
                {blogCount}
              </p>
              <p className="text-xs text-[#62636C] mt-1">
                Edukasi teknis & berita tayang
              </p>
            </div>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
            <Link
              href="/admin/posts"
              className="inline-flex items-center text-xs font-bold text-[#20449A] hover:text-[#18367D] transition-colors group"
            >
              <span>Kelola Blog</span>
              <ChevronRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Card 3: Total Views */}
        <div className="flex flex-col justify-between rounded-2xl border border-[#E2E4EB] bg-white p-6 shadow-xs transition-all hover:shadow-md hover:border-[#20449A]/30">
          <div>
            <div className="flex items-center justify-between">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#20449A]">
                <Eye className="h-6 w-6" />
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
                <TrendingUp className="h-3 w-3" />
                Terverifikasi
              </span>
            </div>
            <div className="mt-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#62636C]">
                Total Views
              </span>
              <p className="text-3xl sm:text-4xl font-extrabold text-[#1E1F24] tracking-tight mt-1">
                {totalViews}
              </p>
              <p className="text-xs text-[#62636C] mt-1">
                Akumulasi pembaca portofolio & blog
              </p>
            </div>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
            <span>Intent Anti-Spam: Aktif</span>
            <span className="font-semibold text-[#20449A]">100% Real</span>
          </div>
        </div>
      </div>

      {/* 3. Grid Dua Kolom: Top 5 di Kiri dan Konten Terbaru di Kanan (Full Width) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 w-full items-start">
        {/* Kolom Kiri: Top 5 Konten Paling Dilihat (lg:col-span-7 xl:col-span-8) */}
        <div className="lg:col-span-7 xl:col-span-8 rounded-2xl border border-[#E2E4EB] bg-white p-6 sm:p-7 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-base sm:text-lg font-bold text-[#1E1F24]">
              Top 5 Konten Paling Dilihat
            </h2>

            {/* Filter Tabs Biru: Hanya [Blog] dan [Portofolio] */}
            <div className="inline-flex items-center p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => setActiveTab("blog")}
                className={cn(
                  "rounded-md px-4 py-1.5 text-xs font-bold transition-all cursor-pointer",
                  activeTab === "blog"
                    ? "bg-[#20449A] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                Blog
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("portofolio")}
                className={cn(
                  "rounded-md px-4 py-1.5 text-xs font-bold transition-all cursor-pointer",
                  activeTab === "portofolio"
                    ? "bg-[#20449A] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                Portofolio
              </button>
            </div>
          </div>

          {/* Table Leaderboard Top 5 */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-[#62636C]">
                  <th className="py-3 pl-2 pr-4 font-semibold w-10">#</th>
                  <th className="py-3 px-4 font-semibold">Nama</th>
                  <th className="py-3 px-4 font-semibold text-right w-24">Views</th>
                  <th className="py-3 pl-4 pr-2 text-right w-20">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentItems.map((item, idx) => {
                  const rank = idx + 1;
                  return (
                    <tr
                      key={item.id}
                      className="group hover:bg-blue-50/40 transition-colors"
                    >
                      {/* Kolom Rank dengan Medali / Angka */}
                      <td className="py-3.5 pl-2 pr-4 font-medium text-slate-700">
                        {rank === 1 ? (
                          <span title="Juara 1" className="inline-flex items-center text-amber-500">
                            <Trophy className="h-4 w-4 fill-amber-400 text-amber-500" />
                          </span>
                        ) : rank === 2 ? (
                          <span title="Juara 2" className="inline-flex items-center text-slate-400">
                            <Medal className="h-4 w-4 fill-slate-300 text-slate-400" />
                          </span>
                        ) : rank === 3 ? (
                          <span title="Juara 3" className="inline-flex items-center text-amber-700">
                            <Medal className="h-4 w-4 fill-amber-600 text-amber-700" />
                          </span>
                        ) : (
                          <span className="pl-1 text-xs font-bold text-slate-500">{rank}</span>
                        )}
                      </td>

                      {/* Kolom Nama / Judul Konten */}
                      <td className="py-3.5 px-4 font-semibold text-[#1E1F24]">
                        <span className="line-clamp-1 group-hover:text-[#20449A] transition-colors">
                          {item.name}
                        </span>
                      </td>

                      {/* Kolom Angka Views */}
                      <td className="py-3.5 px-4 text-right font-bold text-[#1E1F24]">
                        {item.views}
                      </td>

                      {/* Kolom Action: Lihat > */}
                      <td className="py-3.5 pl-4 pr-2 text-right">
                        <Link
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-xs font-semibold text-[#20449A] hover:text-[#18367D] hover:underline transition-colors"
                        >
                          <span>Lihat</span>
                          <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Kolom Kanan: Konten Terbaru (lg:col-span-5 xl:col-span-4) */}
        <div className="lg:col-span-5 xl:col-span-4 rounded-2xl border border-[#E2E4EB] bg-white p-6 sm:p-7 shadow-xs space-y-6">
          <h2 className="text-base sm:text-lg font-bold text-[#1E1F24]">
            Konten Terbaru
          </h2>

          {/* Section 1: Blog Terbaru */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1E1F24]">
                <FileText className="h-4 w-4 text-[#20449A]" />
                <span>Blog Terbaru</span>
              </div>
              <Link
                href="/admin/posts"
                className="text-[11px] font-semibold text-[#20449A] hover:underline"
              >
                Kelola Semua →
              </Link>
            </div>
            <div className="space-y-2.5">
              {recentBlogs.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between text-xs gap-3 group"
                >
                  <Link
                    href={b.link}
                    className="font-medium text-[#1E1F24] hover:text-[#20449A] truncate flex-1 transition-colors"
                  >
                    {b.name}
                  </Link>
                  <span className="text-[11px] text-slate-400 shrink-0">
                    {formatDate(b.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Portofolio Terbaru */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1E1F24]">
                <Briefcase className="h-4 w-4 text-[#20449A]" />
                <span>Portofolio Terbaru</span>
              </div>
              <Link
                href="/admin/portfolios"
                className="text-[11px] font-semibold text-[#20449A] hover:underline"
              >
                Kelola Semua →
              </Link>
            </div>
            <div className="space-y-2.5">
              {recentPortfolios.map((pf) => (
                <div
                  key={pf.id}
                  className="flex items-center justify-between text-xs gap-3 group"
                >
                  <Link
                    href={pf.link}
                    className="font-medium text-[#1E1F24] hover:text-[#20449A] truncate flex-1 transition-colors"
                  >
                    {pf.name}
                  </Link>
                  <span className="text-[11px] text-slate-400 shrink-0">
                    {formatDate(pf.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
