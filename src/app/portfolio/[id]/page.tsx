import { redirect } from "next/navigation";

export default async function PortfolioIdRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/portofolio/${id}`);
}
