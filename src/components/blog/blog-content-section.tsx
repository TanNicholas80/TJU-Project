"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ChevronDown, ArrowRight, X } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useI18n, Locale } from "@/lib/i18n";
import { I18nString } from "@/db/schema";
import { cn } from "@/lib/utils";
import { markViewIntent } from "@/lib/view-tracker";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface PostItem {
  id: string | number;
  categoryPostId?: string | number | null;
  categoryName?: string;
  titleI18n: I18nString;
  excerptI18n?: I18nString | null;
  contentHtmlI18n?: I18nString;
  coverImageUrl?: string | null;
  status: string;
  createdAt: Date | string;
}

export interface CategoryPostItem {
  id: string | number;
  slug: string;
  nameI18n: I18nString;
}

interface BlogContentSectionProps {
  posts: PostItem[];
  categories?: CategoryPostItem[];
}

export function BlogContentSection({
  posts,
  categories = [],
}: BlogContentSectionProps) {
  const { t, locale } = useI18n();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");

  const containerRef = React.useRef<HTMLElement>(null);
  const filterBarRef = React.useRef<HTMLDivElement>(null);
  const featuredRef = React.useRef<HTMLDivElement>(null);
  const gridRef = React.useRef<HTMLDivElement>(null);

  const getLocalized = (field?: I18nString | null) => {
    if (!field) return "";
    return field[locale as Locale] || field.id || "";
  };

  const getCategoryName = (post: PostItem) => {
    if (post.categoryPostId) {
      const found = categories.find((c) => String(c.id) === String(post.categoryPostId));
      if (found) return getLocalized(found.nameI18n);
    }
    if (post.categoryName) {
      const found = categories.find(
        (c) =>
          c.slug?.toLowerCase() === post.categoryName?.toLowerCase() ||
          c.nameI18n?.id?.toLowerCase() === post.categoryName?.toLowerCase()
      );
      if (found) return getLocalized(found.nameI18n);
      return post.categoryName;
    }
    return "Engineering";
  };

  // Filtered posts based on search query and category
  const filteredPosts = React.useMemo(() => {
    return posts.filter((post) => {
      const title = getLocalized(post.titleI18n).toLowerCase();
      const excerpt = getLocalized(post.excerptI18n).toLowerCase();
      const matchesSearch =
        !searchQuery.trim() ||
        title.includes(searchQuery.toLowerCase()) ||
        excerpt.includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" ||
        (post.categoryPostId && String(post.categoryPostId) === selectedCategory) ||
        (post.categoryName &&
          post.categoryName.toLowerCase() === selectedCategory.toLowerCase()) ||
        categories.some(
          (c) =>
            String(c.id) === selectedCategory &&
            (String(post.categoryPostId) === String(c.id) ||
              (post.categoryName &&
                post.categoryName.toLowerCase() === (c.nameI18n?.id || "").toLowerCase()))
        );

      return matchesSearch && matchesCategory;
    });
  }, [posts, searchQuery, selectedCategory, locale, categories]);

  // Featured post is the first matching post, remaining are in grid
  const featuredPost = filteredPosts[0];
  const gridPosts = filteredPosts.slice(1);

  // Initial GSAP reveal animation
  React.useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      if (filterBarRef.current) {
        gsap.fromTo(
          filterBarRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: filterBarRef.current,
              start: "top 90%",
              once: true,
            },
          }
        );
      }

      if (featuredRef.current) {
        gsap.fromTo(
          featuredRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            delay: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: featuredRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      if (gridRef.current && gridRef.current.children.length > 0) {
        gsap.fromTo(
          gridRef.current.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Filter change animation
  React.useEffect(() => {
    if (featuredRef.current) {
      gsap.fromTo(
        featuredRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }
      );
    }
    if (gridRef.current && gridRef.current.children.length > 0) {
      gsap.fromTo(
        gridRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.08, ease: "power2.out" }
      );
    }
  }, [searchQuery, selectedCategory]);

  return (
    <section
      ref={containerRef}
      className="relative w-full py-10 sm:py-14 md:py-16 bg-[#F9F9FB]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        {/* 1. Search Bar & Dropdown Filter Row (Identik dengan Gambar 1) */}
        <div
          ref={filterBarRef}
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4"
        >
          {/* Search Box Input */}
          <div className="relative flex-1 max-w-md">
            <div className="flex items-center rounded-xl bg-[#F0F2F5] px-4 py-3 transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-[#20449A]/20 focus-within:border-slate-300 border border-transparent shadow-xs">
              <Search className="h-4 w-4 text-slate-400 shrink-0 mr-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("homeBlog.searchPlaceholder") || "Cari Artikel"}
                className="w-full bg-transparent text-sm text-[#1E1F24] placeholder:text-slate-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-slate-400 hover:text-slate-600 focus:outline-none ml-2"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Category Dropdown Select */}
          <div className="relative shrink-0">
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none cursor-pointer rounded-xl bg-[#F0F2F5] hover:bg-slate-200/70 border border-transparent py-3 pl-4 pr-10 text-sm font-medium text-[#1E1F24] shadow-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#20449A]/20 focus:border-slate-300 transition-all min-w-[130px]"
              >
                <option value="all">{t("homeBlog.allCategory") || "Semua"}</option>
                {categories.map((cat) => {
                  const catName = getLocalized(cat.nameI18n);
                  return (
                    <option key={cat.id} value={String(cat.id)}>
                      {catName}
                    </option>
                  );
                })}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            </div>
          </div>
        </div>

        {/* 2. Artikel Unggulan / Featured Card (Identik 100% dengan Gambar Desain) */}
        {featuredPost ? (
          <article ref={featuredRef}>
            <Link
              href={`/blog/${featuredPost.id}`}
              onClick={() => markViewIntent("article", featuredPost.id)}
              className="group overflow-hidden rounded-2xl md:rounded-3xl bg-white border border-slate-100 shadow-xs hover:shadow-lg transition-all duration-300 p-6 sm:p-8 lg:p-10 block cursor-pointer"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 xl:gap-12 items-center">
                {/* Left Side: Featured Image (Presisi dengan sudut melengkung tanpa nested padding) */}
                <div className="lg:col-span-6 relative aspect-[16/10] sm:aspect-[16/10] w-full overflow-hidden rounded-xl sm:rounded-2xl shadow-xs bg-slate-100 block">
                  <Image
                    src={featuredPost.coverImageUrl || "/images/gambar_1.JPG"}
                    alt={getLocalized(featuredPost.titleI18n)}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>

                {/* Right Side: Featured Content (Presisi badge, tipografi judul, kutipan & tombol) */}
                <div className="lg:col-span-6 flex flex-col justify-center items-start space-y-4 sm:space-y-5">
                  {/* Category Pill (Dark) */}
                  <div>
                    <span className="inline-block rounded-full bg-[#1E1F24] px-4 py-1.5 text-xs font-semibold text-white tracking-wide shadow-xs">
                      {getCategoryName(featuredPost)}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl sm:text-3xl md:text-[32px] lg:text-[34px] font-bold text-[#1E1F24] leading-snug sm:leading-tight tracking-tight group-hover:text-[#20449A] transition-colors">
                    {getLocalized(featuredPost.titleI18n)}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-sm sm:text-base text-slate-500 leading-relaxed line-clamp-3">
                    {getLocalized(featuredPost.excerptI18n)}
                  </p>

                  {/* Baca Selengkapnya Link */}
                  <div className="pt-2 sm:pt-4">
                    <span className="inline-flex items-center text-sm sm:text-base font-bold text-[#1E1F24] group-hover:text-[#F48902] transition-colors">
                      <span>{t("homeBlog.readMore") || "Baca Selengkapnya"}</span>
                      <span className="ml-2 font-normal transition-transform duration-200 group-hover:translate-x-1.5">
                        &rarr;
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </article>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-400">
            <p className="text-base font-medium">
              {t("homeBlog.emptyMessage") || "Tidak ada artikel yang cocok dengan pencarian Anda."}
            </p>
          </div>
        )}

        {/* 3. 3-Column Articles Grid (Identik dengan Gambar 1 Bawah) */}
        {gridPosts.length > 0 && (
          <div
            ref={gridRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-2"
          >
            {gridPosts.map((post) => {
              const title = getLocalized(post.titleI18n);
              const excerpt = getLocalized(post.excerptI18n);
              const categoryBadge = post.categoryName || "Engineering";

              return (
                <article key={post.id} className="h-full flex flex-col">
                  <Link
                    href={`/blog/${post.id}`}
                    onClick={() => markViewIntent("article", post.id)}
                    className="group flex flex-col flex-1 h-full overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-slate-200 block cursor-pointer"
                  >
                    {/* Thumbnail Image Container with Badge Overlaid */}
                    <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-100 block">
                      <Image
                        src={
                          post.coverImageUrl ||
                          "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80"
                        }
                        alt={title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Category Pill Overlaid at Top-Left */}
                      <div className="absolute top-3.5 left-3.5 z-10">
                        <span className="inline-block rounded-full bg-[#1E1F24]/90 backdrop-blur-xs px-3.5 py-1 text-[11px] font-semibold text-white shadow-xs">
                          {getCategoryName(post)}
                        </span>
                      </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-6 flex flex-1 flex-col justify-between space-y-4">
                      <div className="space-y-2.5">
                        {/* Title */}
                        <h3 className="text-base sm:text-lg font-bold text-[#1E1F24] leading-snug line-clamp-2 group-hover:text-[#20449A] transition-colors">
                          {title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-xs sm:text-sm text-[#62636C] leading-relaxed line-clamp-2">
                          {excerpt}
                        </p>
                      </div>

                      {/* Baca Selengkapnya */}
                      <div className="pt-2">
                        <span className="inline-flex items-center text-xs sm:text-sm font-bold text-[#1E1F24] group-hover:text-[#F48902] transition-colors">
                          <span>{t("homeBlog.readMore") || "Baca Selengkapnya"}</span>
                          <ArrowRight className="h-3.5 w-3.5 ml-1.5 transition-transform duration-200 group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
