import { Metadata } from "next";
import { PortfolioForm } from "@/components/admin/portfolios/portfolio-form";

export const metadata: Metadata = {
  title: "Tambah Portofolio Proyek | Admin TJU TRUSS",
};

export default function CreatePortfolioPage() {
  return <PortfolioForm />;
}
