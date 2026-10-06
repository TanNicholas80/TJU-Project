import { Metadata } from "next";
import { CarouselForm } from "@/components/admin/carousel/carousel-form";
import { getCarouselsAdmin } from "@/actions/carousel";

export const metadata: Metadata = {
  title: "Tambah Slide Hero Carousel | Admin TJU Truss",
};

export default async function CreateCarouselPage() {
  const res = await getCarouselsAdmin();
  const nextOrder = (res.data?.length || 0) + 1;

  const defaultData = {
    imageUrl: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1920&q=80",
    subheaderI18n: { id: "SOLUSI TERINTEGRASI", en: "INTEGRATED SOLUTIONS", zh: "综合解决方案" },
    titleI18n: { id: "", en: "", zh: "" },
    descriptionI18n: { id: "", en: "", zh: "" },
    loadingTitleI18n: { id: "Strength", en: "Strength", zh: "强度" },
    ctaTextI18n: { id: "Konsultasi Proyek", en: "Project Consultation", zh: "项目咨询" },
    ctaLink: "#contact",
    sortOrder: nextOrder,
    isActive: true,
  };

  return (
    <div className="w-full">
      <CarouselForm initialData={defaultData} isEdit={false} />
    </div>
  );
}
