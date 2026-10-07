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

  if (!id) {
    notFound();
  }

  const res = await getCarouselById(id);
  if (!res.success || !res.data) {
    notFound();
  }

  return (
    <div className="w-full">
      <CarouselForm initialData={res.data} carouselId={id} isEdit={true} />
    </div>
  );
}
