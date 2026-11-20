import { Metadata } from "next";
import { PublicLayout } from "@/components/layout/public-layout";
import { PageHeroBanner } from "@/components/common/page-hero-banner";
import { BlogContentSection } from "@/components/blog/blog-content-section";
import { getPageBanner, getPosts, getCategoriesPost } from "@/lib/data-service";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const banner = await getPageBanner("blog");

  const title = "Blog & Artikel | TJU TRUSS SYSTEM - Inovasi & Edukasi Rangka Atap";
  const description =
    "Kumpulan artikel edukatif, panduan teknis, dan wawasan engineering seputar desain rangka atap baja ringan berstandar SNI dan software HAKI.";

  const bannerImg = banner?.backgroundImageUrl || "/images/core_background.png";

  return {
    title,
    description,
    keywords: [
      "Blog Baja Ringan",
      "Artikel Konstruksi Atap",
      "Software HAKI Rangka Atap",
      "Kekuatan Baja Ringan G550",
      "TJU Truss Blog",
      "Edukasi Rangka Atap",
    ],
    authors: [{ name: "CV. TRI JAYA UTAMA", url: "https://tjutruss.com" }],
    creator: "CV. TRI JAYA UTAMA",
    publisher: "CV. TRI JAYA UTAMA",
    openGraph: {
      type: "website",
      locale: "id_ID",
      alternateLocale: ["en_US", "zh_CN"],
      url: "https://tjutruss.com/blog",
      title,
      description,
      siteName: "TJU TRUSS SYSTEM",
      images: [
        {
          url: bannerImg,
          width: 1200,
          height: 630,
          alt: "Blog & Artikel - TJU TRUSS SYSTEM",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [bannerImg],
    },
    alternates: {
      canonical: "https://tjutruss.com/blog",
      languages: {
        "id-ID": "https://tjutruss.com/blog",
        "en-US": "https://tjutruss.com/en/blog",
        "zh-CN": "https://tjutruss.com/zh/blog",
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function BlogPage() {
  const [banner, posts, categories] = await Promise.all([
    getPageBanner("blog"),
    getPosts(50),
    getCategoriesPost(),
  ]);

  // Schema.org Structured Data: Blog + Breadcrumbs + ItemList
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": "https://tjutruss.com/blog/#blog",
        url: "https://tjutruss.com/blog",
        name: "Blog & Artikel | TJU TRUSS SYSTEM",
        description:
          "Kumpulan artikel edukatif, panduan teknis, dan wawasan engineering seputar desain rangka atap baja ringan berstandar SNI dan software HAKI.",
        publisher: {
          "@type": "Organization",
          name: "CV. TRI JAYA UTAMA",
          logo: "https://tjutruss.com/images/logo_tju.png",
        },
        inLanguage: "id-ID",
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: "https://tjutruss.com",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Blog & Artikel",
              item: "https://tjutruss.com/blog",
            },
          ],
        },
      },
      {
        "@type": "ItemList",
        "@id": "https://tjutruss.com/blog/#itemlist",
        itemListElement: posts.slice(0, 10).map((post: any, index: number) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `https://tjutruss.com/blog/${post.id}`,
          name: post.titleI18n?.id || "Artikel Baja Ringan",
        })),
      },
    ],
  };

  return (
    <PublicLayout>
      {/* JSON-LD Rich Snippet for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="flex flex-col w-full">
        {/* Hero Banner: Blog & Artikel (Home > Blog) */}
        <PageHeroBanner
          title={
            banner?.titleI18n || {
              id: "Blog & Artikel",
              en: "Blog & Articles",
              zh: "博客与文章",
            }
          }
          breadcrumbCurrent={banner?.breadcrumbI18n || "navigation.blog"}
          backgroundImageUrl={
            banner?.backgroundImageUrl || "/images/core_background.png"
          }
        />

        {/* Content Section: Search Bar, Category Dropdown, Featured Post, 3-Col Grid */}
        <BlogContentSection posts={posts} categories={categories} />
      </div>
    </PublicLayout>
  );
}
