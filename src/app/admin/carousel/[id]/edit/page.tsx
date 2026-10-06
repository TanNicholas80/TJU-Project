import { Metadata } from "next";
import { notFound } from "next/navigation";
import { CarouselForm } from "@/components/admin/carousel/carousel-form";
import { getCarouselById } from "@/actions/carousel";

interface EditCarouselPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EditCarouselPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Edit Slide #${id} | Admin TJU Truss`,
  };
}

export default async function EditCarouselPage({ params }: EditCarouselPageProps) {
  const { id } = await params;
  const carouselId = parseInt(id, 10);

  if (isNaN(carouselId)) {
    notFound();
  }

  const res = await getCarouselById(carouselId);
  if (!res.success || !res.data) {
    notFound();
  }

  return (
    <div className="w-full">
      <CarouselForm initialData={res.data} carouselId={carouselId} isEdit={true} />
    </div>
  );
}
