import { Metadata } from "next";
import { BannerForm } from "@/components/admin/banners/banner-form";

export const metadata: Metadata = {
  title: "Tambah Banner Halaman Baru | Admin TJU Truss",
};

export default function CreateBannerPage() {
  const defaultData = {
    pageSlug: "about-us",
    titleI18n: { id: "About Us", en: "About Us", zh: "关于我们" },
    breadcrumbI18n: { id: "Home > About US", en: "Home > About US", zh: "首页 > 关于我们" },
    backgroundImageUrl: "/images/core_background.png",
  };

  return (
    <div className="w-full">
      <BannerForm initialData={defaultData} isEdit={false} />
    </div>
  );
}
