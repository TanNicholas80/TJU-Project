import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicLayout } from "@/components/layout/public-layout";
import {
  PortfolioDetailContent,
  RelatedPortfolioProject,
  PortfolioDetailGalleryImage,
} from "@/components/portfolio/portfolio-detail-content";
import { getPortfolioById, getPortfolios } from "@/lib/data-service";
import { defaultPortfolios } from "@/lib/data-defaults";
import { ViewTrackerTrigger } from "@/lib/view-tracker";

interface PortfolioDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PortfolioDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const portfolio = await getPortfolioById(Number(id));

  if (!portfolio) {
    return { title: "Portofolio Tidak Ditemukan | TJU TRUSS SYSTEM" };
  }

  const title = portfolio.titleI18n?.id || "Detail Proyek";
  const location = portfolio.location || "Indonesia";
  const categoryBadge = portfolio.categoryName || "KOMERSIAL";
  const description = `Dokumentasi fabrikasi dan perakitan konstruksi rangka atap baja ringan presisi berstandar engineering tinggi pada proyek ${title} (${location}).`;
  const coverImage = portfolio.coverImageUrl || "/images/core_background.png";
  const canonicalUrl = `https://tjutruss.com/portofolio/${id}`;

  return {
    title: `${title} - ${location} | Rekam Jejak TJU TRUSS`,
    description,
    keywords: [
      categoryBadge,
      location,
      title,
      "Konstruksi Rangka Atap Baja Ringan",
      "Software HAKI",
      "Galvalum G550",
      "CV. Tri Jaya Utama",
      "Portofolio TJU Truss",
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${title} | Rekam Jejak TJU TRUSS`,
      description,
      url: canonicalUrl,
      type: "website",
      siteName: "TJU TRUSS SYSTEM",
      images: [
        {
          url: coverImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | TJU TRUSS SYSTEM`,
      description,
      images: [coverImage],
    },
  };
}

export default async function PortfolioDetailPage({
  params,
}: PortfolioDetailPageProps) {
  const { id } = await params;
  const portfolio = await getPortfolioById(Number(id));

  if (!portfolio) {
    notFound();
  }

  const allPortfolios = await getPortfolios(8);
  let otherList = (allPortfolios as any[]).filter(
    (p: any) => p.id !== (portfolio as any).id
  );

  // If fewer than 4 items, backfill from defaultPortfolios
  if (otherList.length < 4) {
    const additional = defaultPortfolios.filter(
      (p) => p.id !== (portfolio as any).id && !otherList.some((o) => o.id === p.id)
    );
    otherList = [...otherList, ...additional];
  }

  const otherProjects: RelatedPortfolioProject[] = otherList.slice(0, 4).map((p: any) => ({
    id: p.id,
    title: p.titleI18n?.id || "Proyek TJU Truss",
    categoryName: p.categoryName || "KOMERSIAL",
    coverImageUrl: p.coverImageUrl || "/images/core_background.png",
    location: p.location || "Jawa Tengah",
  }));

  const title = portfolio.titleI18n?.id || "Detail Proyek";
  const categoryBadge = portfolio.categoryName || "KOMERSIAL";
  const location = portfolio.location || "Jawa Tengah, Indonesia";
  const coverImageUrl = portfolio.coverImageUrl || "/images/core_background.png";
  const galleryImages: PortfolioDetailGalleryImage[] = (portfolio.images || []).map((img: any) => ({
    id: img.id,
    imageUrl: img.imageUrl,
  }));

  // JSON-LD Schema.org Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: title,
    description: `Instalasi rangka atap baja ringan proyek ${title} di ${location}`,
    image: [coverImageUrl],
    locationCreated: {
      "@type": "Place",
      name: location,
    },
    creator: {
      "@type": "Organization",
      name: "CV. Tri Jaya Utama",
      url: "https://tjutruss.com",
    },
    publisher: {
      "@type": "Organization",
      name: "TJU TRUSS SYSTEM",
      logo: {
        "@type": "ImageObject",
        url: "https://tjutruss.com/images/logo_tju.png",
      },
    },
  };

  return (
    <PublicLayout>
      {/* Real view counter intent consumer */}
      <ViewTrackerTrigger type="portfolio" id={id} />

      {/* Dynamic SEO JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PortfolioDetailContent
        id={id}
        title={title}
        location={location}
        categoryBadge={categoryBadge}
        coverImageUrl={coverImageUrl}
        galleryImages={galleryImages}
        otherProjects={otherProjects}
      />
    </PublicLayout>
  );
}
