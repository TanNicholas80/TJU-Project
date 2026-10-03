import { Metadata } from "next";
import { PublicLayout } from "@/components/layout/public-layout";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { QualityStandardsSection } from "@/components/home/quality-standards-section";
import { ExpertiseSection } from "@/components/home/expertise-section";
import { HistorySection } from "@/components/home/history-section";
import { FeaturedPortfolioSection } from "@/components/home/featured-portfolio-section";
import { LatestArticlesSection } from "@/components/home/latest-articles-section";
import { CoreValuesSection } from "@/components/home/core-values-section";
import { ContactSection } from "@/components/home/contact-section";
import { CtaBannerSection } from "@/components/home/cta-banner-section";
import {
  getHeroCarousels,
  getQualityStandards,
  getPortfolios,
  getPosts,
  getCompanyProfile,
  getCategoriesPortfolio,
} from "@/lib/data-service";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getCompanyProfile();

  const title = "TJU TRUSS SYSTEM | Fabrikasi & Konstruksi Rangka Atap Baja Ringan Presisi";
  const description =
    "CV. Tri Jaya Utama - Solusi terpercaya pemasangan rangka atap baja ringan berstandar SNI dan software engineering HAKI dengan garansi struktur 10 tahun di Indonesia.";

  return {
    title,
    description,
    keywords: [
      "TJU Truss",
      "baja ringan Semarang",
      "rangka atap baja ringan",
      "kuda-kuda baja ringan",
      "konstruksi atap HAKI",
      "galvalum G550",
      "aplikator baja ringan Jawa Tengah",
    ],
    authors: [{ name: "CV. Tri Jaya Utama", url: "https://tjutruss.com" }],
    creator: "CV. Tri Jaya Utama",
    openGraph: {
      type: "website",
      locale: "id_ID",
      url: "https://tjutruss.com",
      title,
      description,
      siteName: "TJU TRUSS SYSTEM",
      images: [
        {
          url: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80",
          width: 1200,
          height: 630,
          alt: "TJU Truss System Konstruksi Rangka Atap",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    alternates: {
      canonical: "https://tjutruss.com",
      languages: {
        "id-ID": "https://tjutruss.com",
        "en-US": "https://tjutruss.com/en",
        "zh-CN": "https://tjutruss.com/zh",
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

export default async function HomePage() {
  const [slides, standards, portfolios, categories, posts, profile] = await Promise.all([
    getHeroCarousels(),
    getQualityStandards(),
    getPortfolios(12),
    getCategoriesPortfolio(),
    getPosts(3),
    getCompanyProfile(),
  ]);

  // Schema.org Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "HomeAndConstructionBusiness",
        "@id": "https://tjutruss.com/#organization",
        name: "CV. Tri Jaya Utama (TJU Truss)",
        url: "https://tjutruss.com",
        logo: "https://tjutruss.com/images/logo_tju.png",
        image: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80",
        description:
          "Spesialis pabrikasi dan instalasi rangka atap baja ringan presisi bergaransi 10 tahun di Indonesia.",
        telephone: profile.phone || "(024) 3519 776",
        email: profile.email || "admin@tjutruss.com",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Jl. Patimura No.6C, Rejomulyo",
          addressLocality: "Semarang",
          addressRegion: "Jawa Tengah",
          postalCode: "50126",
          addressCountry: "ID",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: -6.9830335,
          longitude: 110.4285834,
        },
      },
    ],
  };

  return (
    <PublicLayout>
      {/* Schema.org Structured Data injection for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="flex-1 flex flex-col">
        {/* 1. Hero Carousel (Dinamis dari CMS) */}
        <HeroCarousel slides={slides as any} />

        {/* 2. Standar Kualitas TJU (Dinamis dari CMS) */}
        <QualityStandardsSection standards={standards as any} />

        {/* 3. Keahlian Kami (Statis Split Layout) */}
        <ExpertiseSection />

        {/* 4. Akar Sejarah Kami (Statis Timeline Sesuai Desain) */}
        <HistorySection />

        {/* 5. Proyek Terbaik / Portofolio (Dinamis dari CMS & Tab Kategori) */}
        <FeaturedPortfolioSection
          portfolios={portfolios as any}
          categories={categories as any}
        />

        {/* 6. Blog & Artikel (Dinamis dari CMS 3-Column Grid) */}
        <LatestArticlesSection posts={posts as any} />

        {/* 7. Core Values (HAKI Verified Software) */}
        <CoreValuesSection />

        {/* 8. Contact Us / Hubungi Kami (Dinamis dari CMS Profile) */}
        <ContactSection profile={profile as any} />

        {/* 9. CTA Banner (Sebelum Footer) */}
        <CtaBannerSection />
      </main>
    </PublicLayout>
  );
}
