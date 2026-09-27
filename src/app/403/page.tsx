import { PublicLayout } from "@/components/layout/public-layout";
import { ErrorView } from "@/components/common/error-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "403 - Akses Terbatas | TJU TRUSS SYSTEM",
  description: "Anda tidak memiliki izin untuk mengakses halaman ini.",
};

export default function ForbiddenPage() {
  return (
    <PublicLayout>
      <ErrorView code={403} />
    </PublicLayout>
  );
}
