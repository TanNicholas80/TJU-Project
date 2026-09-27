import { PublicLayout } from "@/components/layout/public-layout";
import { ErrorView } from "@/components/common/error-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Halaman Tidak Ditemukan | TJU TRUSS SYSTEM",
  description: "Halaman yang Anda cari tidak ditemukan.",
};

export default function NotFound() {
  return (
    <PublicLayout>
      <ErrorView code={404} />
    </PublicLayout>
  );
}
