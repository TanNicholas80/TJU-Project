import { Metadata } from "next";
import { PublicLayout } from "@/components/layout/public-layout";
import { PageHeroBanner } from "@/components/common/page-hero-banner";
import { PortfolioContentSection } from "@/components/portfolio/portfolio-content-section";
import {
  getPageBanner,
  getPortfolios,
  getCategoriesPortfolio,
} from "@/lib/data-service";

export async function generateMetadata(): Promise<Metadata> {
  const banner = await getPageBanner("portofolio");

  const title =
    "Rekam Jejak TJU TRUSS | Portofolio Konstruksi Rangka Atap Baja Ringan Presisi";
  const description =
    "Eksplorasi rekam jejak dan portofolio proyek konstruksi rangka atap baja ringan CV. Tri Jaya Utama (TJU Truss) untuk sektor komersial, industrial, dan residensial.";

  const bannerImg = banner?.backgroundImageUrl || "/images/core_background.png";

  return {
    title,
    description,
    keywords: [
      "Portofolio TJU Truss",
      "Rekam Jejak Baja Ringan",
      "Proyek Atap Komersial",
      "Proyek Atap Gudang Pabrik Industrial",
      "Proyek Rangka Atap Residensial",
      "Bandara NYIA Truss",
      "UNNES Baja Ringan",
    ],
    authors: [{ name: "CV. Tri Jaya Utama", url: "https://tjutruss.com" }],
    creator: "CV. Tri Jaya Utama",
    publisher: "CV. Tri Jaya Utama",
    openGraph: {
      type: "website",
      locale: "id_ID",
      alternateLocale: ["en_US", "zh_CN"],
      url: "https://tjutruss.com/portofolio",
      title,
      description,
      siteName: "TJU TRUSS SYSTEM",
      images: [
        {
          url: bannerImg,
          width: 1200,
          height: 630,
          alt: "Rekam Jejak TJU TRUSS",
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
      canonical: "https://tjutruss.com/portofolio",
      languages: {
        "id-ID": "https://tjutruss.com/portofolio",
        "en-US": "https://tjutruss.com/en/portofolio",
        "zh-CN": "https://tjutruss.com/zh/portofolio",
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

export default async function PortfolioPage() {
  const [banner, portfolios, categories] = await Promise.all([
    getPageBanner("portofolio"),
    getPortfolios(50),
    getCategoriesPortfolio(),
  ]);

  // Schema.org Structured Data: CollectionPage + Breadcrumbs + ItemList
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": "https://tjutruss.com/portofolio/#webpage",
        url: "https://tjutruss.com/portofolio",
        name: "Rekam Jejak TJU TRUSS | Portofolio Konstruksi Rangka Atap Baja Ringan Presisi",
        description:
          "Eksplorasi rekam jejak dan portofolio proyek konstruksi rangka atap baja ringan CV. Tri Jaya Utama (TJU Truss) untuk sektor komersial, industrial, dan residensial.",
        inLanguage: "id-ID",
        publisher: {
          "@type": "Organization",
          name: "CV. Tri Jaya Utama",
          logo: "https://tjutruss.com/images/logo_tju.png",
        },
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
              name: "Portofolio",
              item: "https://tjutruss.com/portofolio",
            },
          ],
        },
      },
      {
        "@type": "ItemList",
        "@id": "https://tjutruss.com/portofolio/#itemlist",
        itemListElement: portfolios.slice(0, 10).map((item: any, index: number) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `https://tjutruss.com/portofolio/${item.id}`,
          name: item.titleI18n?.id || "Proyek TJU Truss",
          image: item.coverImageUrl,
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
        {/* Hero Banner: Rekam Jejak TJU TRUSS (Home > Portofolio) */}
        <PageHeroBanner
          title={banner?.titleI18n || "Rekam Jejak TJU TRUSS"}
          breadcrumbCurrent="Portofolio"
          backgroundImageUrl={
            banner?.backgroundImageUrl || "/images/core_background.png"
          }
        />

        {/* Content Section: Category Tabs Filter, 2-Col Immersive Project Grid */}
        <PortfolioContentSection
          portfolios={portfolios}
          categories={categories}
        />
      </div>
    </PublicLayout>
  );
}
