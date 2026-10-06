import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicLayout } from "@/components/layout/public-layout";
import { BlogDetailContent, RelatedPost } from "@/components/blog/blog-detail-content";
import { getPostById, getPosts } from "@/lib/data-service";
import { ViewTrackerTrigger } from "@/lib/view-tracker";

interface BlogPostPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await getPostById(Number(id));

  if (!post) {
    return { title: "Artikel Tidak Ditemukan | TJU TRUSS SYSTEM" };
  }

  const title = post.titleI18n?.id || "Blog & Artikel";
  const description =
    post.excerptI18n?.id ||
    "Wawasan rekayasa dan panduan teknis desain rangka atap baja ringan berstandar engineering tinggi dari TJU TRUSS SYSTEM.";
  const coverImage = post.coverImageUrl || "/images/gambar_1.JPG";
  const canonicalUrl = `https://tjutruss.com/blog/${id}`;

  return {
    title: `${title} | TJU TRUSS SYSTEM`,
    description,
    keywords: [
      post.categoryName || "Engineering",
      "Rangka Atap Baja Ringan",
      "Software HAKI Rangka Atap",
      "Konstruksi Atap Presisi",
      "CV. Tri Jaya Utama",
      "Baja Ringan G550",
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "article",
      siteName: "TJU TRUSS SYSTEM",
      images: [
        {
          url: coverImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      publishedTime: post.createdAt ? new Date(post.createdAt).toISOString() : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [coverImage],
    },
  };
}

export default async function BlogPostDetailPage({ params }: BlogPostPageProps) {
  const { id } = await params;
  const post = await getPostById(Number(id));

  if (!post) {
    notFound();
  }

  const allPosts = await getPosts(6);
  const relatedPosts: RelatedPost[] = (allPosts as any[])
    .filter((p: any) => p.id !== (post as any).id)
    .slice(0, 3)
    .map((p: any) => ({
      id: p.id,
      title: p.titleI18n?.id || "Artikel Lainnya",
      coverImageUrl: p.coverImageUrl || "/images/gambar_1.JPG",
      categoryName: p.categoryName || "Engineering",
      createdAt: p.createdAt,
    }));

  const title = post.titleI18n?.id || "Artikel";
  const categoryName = post.categoryName || "Engineering";
  const coverImageUrl = post.coverImageUrl || "/images/gambar_1.JPG";
  const excerpt = post.excerptI18n?.id || "";
  const contentHtml = post.contentHtmlI18n?.id || `<p>${excerpt}</p>`;

  // Schema.org JSON-LD for rich snippet SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: excerpt,
    image: [coverImageUrl],
    datePublished: post.createdAt ? new Date(post.createdAt).toISOString() : new Date().toISOString(),
    author: {
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
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://tjutruss.com/blog/${id}`,
    },
  };

  return (
    <PublicLayout>
      {/* Real view counter intent consumer */}
      <ViewTrackerTrigger type="article" id={id} />

      {/* Dynamic SEO JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <BlogDetailContent
        id={id}
        title={title}
        categoryName={categoryName}
        coverImageUrl={coverImageUrl}
        contentHtml={contentHtml}
        relatedPosts={relatedPosts}
      />
    </PublicLayout>
  );
}
