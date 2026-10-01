import { Metadata } from "next";
import { PublicLayout } from "@/components/layout/public-layout";
import { AboutHeroBanner } from "@/components/about/about-hero-banner";
import { AboutStorySection } from "@/components/about/about-story-section";
import { AboutCertificationsSection } from "@/components/about/about-certifications-section";
import { AboutVisionMissionSection } from "@/components/about/about-vision-mission-section";
import { AboutCategoriesSection } from "@/components/about/about-categories-section";
import {
  getPageBanner,
  getCertifications,
  getCategoriesPortfolio,
  getCompanyProfile,
} from "@/lib/data-service";

export async function generateMetadata(): Promise<Metadata> {
  const [banner, profile] = await Promise.all([
    getPageBanner("about-us"),
    getCompanyProfile(),
  ]);

  const title = "Tentang Kami | TJU TRUSS SYSTEM - Membangun Pondasi Kepercayaan";
  const description =
    "Mengenal CV. Tri Jaya Utama (TJU Truss) sejak tahun 2000. Spesialis fabrikasi dan konstruksi rangka atap baja ringan berstandar SNI dan software engineering HAKI dengan garansi struktur 10 tahun.";

  const bannerImg =
    banner?.backgroundImageUrl ||
    "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1200&q=80";

  return {
    title,
    description,
    keywords: [
      "Tentang TJU Truss",
      "Profil CV Tri Jaya Utama",
      "Pabrik Rangka Atap Baja Ringan",
      "Aplikator Baja Ringan Semarang",
      "Sertifikasi HAKI Baja Ringan",
      "SNI Baja Ringan",
      "Sejarah TJU Truss",
    ],
    authors: [{ name: "CV. Tri Jaya Utama", url: "https://tjutruss.com" }],
    creator: "CV. Tri Jaya Utama",
    openGraph: {
      type: "website",
      locale: "id_ID",
      url: "https://tjutruss.com/about",
      title,
      description,
      siteName: "TJU TRUSS SYSTEM",
      images: [
        {
          url: bannerImg,
          width: 1200,
          height: 630,
          alt: "Tentang Kami - TJU TRUSS SYSTEM",
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
      canonical: "https://tjutruss.com/about",
      languages: {
        "id-ID": "https://tjutruss.com/about",
        "en-US": "https://tjutruss.com/en/about",
        "zh-CN": "https://tjutruss.com/zh/about",
      },
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
    },
  };
}

export default async function AboutPage() {
  const [banner, certifications, categories] = await Promise.all([
    getPageBanner("about-us"),
    getCertifications(),
    getCategoriesPortfolio(),
  ]);

  return (
    <PublicLayout>
      <div className="flex flex-col w-full">
        {/* 1. Hero Banner (DINAMIS dari CMS tabel PAGE_BANNERS) */}
        <AboutHeroBanner banner={banner} />

        {/* 2. Tentang Kami (STATIS: Kisah TJU, Video Company Profile, Grid 2 Foto & Badge QC) */}
        <AboutStorySection />

        {/* 3. Section Sertifikasi & Standar (DINAMIS dari CMS tabel CERTIFICATIONS) */}
        <AboutCertificationsSection certifications={certifications} />

        {/* 4. Visi & Misi Perusahaan (STATIS: Box Biru & Poin 01-05) */}
        <AboutVisionMissionSection />

        {/* 5. Kategori Portofolio / Menangani Berbagai Skala Proyek (DINAMIS dari CMS tabel CATEGORIES_PORTFOLIO) */}
        <AboutCategoriesSection categories={categories} />
      </div>
    </PublicLayout>
  );
}
