"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);

  // If on login page, render clean auth layout without sidebar
  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-[#F9F9FB]">{children}</div>;
  }

  // Map route to human title
  const getPageTitle = () => {
    if (pathname.includes("/admin/carousel")) return "Manajemen Hero Carousel";
    if (pathname.includes("/admin/banners")) return "Manajemen Banner Halaman";
    if (pathname.includes("/admin/certifications")) return "Manajemen Sertifikasi Mutu";
    if (pathname.includes("/admin/portfolio-categories")) return "Manajemen Kategori Portofolio";
    if (pathname.includes("/admin/portfolios")) return "Manajemen Portofolio Proyek";
    if (pathname.includes("/admin/standards")) return "Standar Kualitas & Keahlian";
    if (pathname.includes("/admin/posts")) return "Manajemen Blog & Artikel";
    if (pathname.includes("/admin/settings")) return "Pengaturan Kontak & Profil";
    return "Dashboard Overview";
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F9F9FB]">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex shrink-0">
        <AdminSidebar />
      </div>

      {/* Mobile Drawer Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative z-50 flex w-72 flex-col">
            <AdminSidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader
          title={getPageTitle()}
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-10">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
