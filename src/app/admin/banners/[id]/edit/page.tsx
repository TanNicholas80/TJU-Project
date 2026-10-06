import { Metadata } from "next";
import { notFound } from "next/navigation";
import { BannerForm } from "@/components/admin/banners/banner-form";
import { getBannerById } from "@/actions/banners";

interface EditBannerPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EditBannerPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Edit Banner #${id} | Admin TJU Truss`,
  };
}

export default async function EditBannerPage({ params }: EditBannerPageProps) {
  const { id } = await params;
  const bannerId = parseInt(id, 10);

  if (isNaN(bannerId)) {
    notFound();
  }

  const res = await getBannerById(bannerId);
  if (!res.success || !res.data) {
    notFound();
  }

  return (
    <div className="w-full">
      <BannerForm initialData={res.data} bannerId={bannerId} isEdit={true} />
    </div>
  );
}
