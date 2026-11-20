import { Metadata } from "next";
import { PublicLayout } from "@/components/layout/public-layout";
import { PageHeroBanner } from "@/components/common/page-hero-banner";
import { ContactContentSection } from "@/components/contact/contact-content-section";
import { getPageBanner, getCompanyProfile } from "@/lib/data-service";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const [banner, profile] = await Promise.all([
    getPageBanner("contact"),
    getCompanyProfile(),
  ]);

  const title =
    "Hubungi Kami | TJU TRUSS SYSTEM - Konsultasi Konstruksi Rangka Atap Presisi";
  const description =
    "Hubungi CV. TRI JAYA UTAMA untuk konsultasi proyek, penawaran harga, dan instalasi rangka atap baja ringan SNI & software HAKI. Alamat: Jl. Patimura No.6C Semarang. Telp: (024) 3519 776.";

  const bannerImg = banner?.backgroundImageUrl || "/images/core_background.png";

  return {
    title,
    description,
    keywords: [
      "Kontak TJU Truss",
      "Hubungi CV. TRI JAYA UTAMA",
      "Alamat Pabrik Baja Ringan Semarang",
      "Konsultasi Rangka Atap Baja Ringan",
      "Harga Kuda Kuda Baja Ringan",
      "Aplikator Baja Ringan Semarang",
      "Customer Service TJU Truss",
    ],
    authors: [{ name: "CV. TRI JAYA UTAMA", url: "https://tjutruss.com" }],
    creator: "CV. TRI JAYA UTAMA",
    publisher: "CV. TRI JAYA UTAMA",
    openGraph: {
      type: "website",
      locale: "id_ID",
      alternateLocale: ["en_US", "zh_CN"],
      url: "https://tjutruss.com/contact",
      title,
      description,
      siteName: "TJU TRUSS SYSTEM",
      images: [
        {
          url: bannerImg,
          width: 1200,
          height: 630,
          alt: "Hubungi Kami - TJU TRUSS SYSTEM",
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
      canonical: "https://tjutruss.com/contact",
      languages: {
        "id-ID": "https://tjutruss.com/contact",
        "en-US": "https://tjutruss.com/en/contact",
        "zh-CN": "https://tjutruss.com/zh/contact",
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

export default async function ContactPage() {
  const [banner, profile] = await Promise.all([
    getPageBanner("contact"),
    getCompanyProfile(),
  ]);

  // Schema.org Structured Data for ContactPage & LocalBusiness
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        "@id": "https://tjutruss.com/contact/#webpage",
        url: "https://tjutruss.com/contact",
        name: "Hubungi Kami | TJU TRUSS SYSTEM - Konsultasi Konstruksi Rangka Atap",
        description:
          "Hubungi CV. TRI JAYA UTAMA untuk konsultasi proyek, penawaran harga, dan instalasi rangka atap baja ringan SNI & software HAKI.",
        inLanguage: "id-ID",
        isPartOf: {
          "@type": "WebSite",
          "@id": "https://tjutruss.com/#website",
          url: "https://tjutruss.com",
          name: "TJU TRUSS SYSTEM",
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
              name: "Kontak",
              item: "https://tjutruss.com/contact",
            },
          ],
        },
      },
      {
        "@type": "HomeAndConstructionBusiness",
        "@id": "https://tjutruss.com/#organization",
        name: "CV. TRI JAYA UTAMA (TJU TRUSS SYSTEM)",
        url: "https://tjutruss.com",
        logo: "https://tjutruss.com/images/logo_tju.png",
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
          latitude: -6.983033593017937,
          longitude: 110.42858347499702,
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ],
            opens: "08:00",
            closes: "17:00",
          },
        ],
      },
    ],
  };

  return (
    <PublicLayout profile={profile}>
      {/* JSON-LD Rich Snippet for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="flex flex-col w-full">
        {/* Hero Banner: Hubungi Kami (Home > Kontak) */}
        <PageHeroBanner
          title={
            banner?.titleI18n || {
              id: "Hubungi Kami",
              en: "Contact Us",
              zh: "联系我们",
            }
          }
          breadcrumbCurrent={banner?.breadcrumbI18n || "navigation.contact"}
          backgroundImageUrl={
            banner?.backgroundImageUrl || "/images/core_background.png"
          }
        />

        {/* Contact Content Section: 3 Info Cards + Google Maps + Send Message Form */}
        <ContactContentSection profile={profile} />
      </div>
    </PublicLayout>
  );
}
