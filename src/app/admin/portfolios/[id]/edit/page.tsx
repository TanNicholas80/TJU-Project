import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortfolioForm } from "@/components/admin/portfolios/portfolio-form";
import { getPortfolioByIdAdmin } from "@/actions/portfolios";

interface EditPortfolioPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EditPortfolioPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Edit Portofolio #${id} | Admin TJU TRUSS`,
  };
}

export default async function EditPortfolioPage({ params }: EditPortfolioPageProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const res = await getPortfolioByIdAdmin(id);
  if (!res.success || !res.data) {
    notFound();
  }

  return (
    <div className="w-full">
      <PortfolioForm initialData={res.data} portfolioId={id} isEdit={true} />
    </div>
  );
}
