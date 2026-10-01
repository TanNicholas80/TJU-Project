"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Images,
  Award,
  Briefcase,
  FileText,
  Settings,
  LogOut,
  ExternalLink,
  ChevronRight,
  Bookmark,
  ShieldCheck,
  FolderTree,
} from "lucide-react";
import { signOut } from "@/lib/auth-client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    name: "Hero Carousel",
    href: "/admin/carousel",
    icon: Images,
  },
  {
    name: "Banner Halaman",
    href: "/admin/banners",
    icon: Bookmark,
  },
  {
    name: "Sertifikasi Mutu",
    href: "/admin/certifications",
    icon: ShieldCheck,
  },
  {
    name: "Kategori Portofolio",
    href: "/admin/portfolio-categories",
    icon: FolderTree,
  },
  {
    name: "Portofolio Proyek",
    href: "/admin/portfolios",
    icon: Briefcase,
  },
  {
    name: "Standar Kualitas",
    href: "/admin/standards",
    icon: Award,
  },
  {
    name: "Blog & Artikel",
    href: "/admin/posts",
    icon: FileText,
  },
  {
    name: "Pengaturan Kontak",
    href: "/admin/settings",
    icon: Settings,
  },
];

interface AdminSidebarProps {
  className?: string;
  onCloseMobile?: () => void;
}

export function AdminSidebar({ className, onCloseMobile }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      toast.success("Berhasil logout dari sistem CMS");
      router.push("/admin/login");
    } catch {
      toast.error("Gagal logout. Silakan coba lagi.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <aside
      className={cn(
        "flex h-full w-64 flex-col border-r border-[#E2E4EB] bg-white text-[#1E1F24]",
        className
      )}
    >
      {/* Brand Header */}
      <div className="flex h-20 items-center justify-between px-6 border-b border-[#E2E4EB]">
        <Link href="/admin" className="flex items-center gap-3">
          <Image
            src="/images/logo_tju.png"
            alt="TJU Truss"
            width={140}
            height={36}
            className="h-8 w-auto object-contain"
          />
          <span className="rounded bg-[#EEF2FA] px-2 py-0.5 text-[10px] font-bold tracking-wider text-[#20449A] uppercase">
            CMS
          </span>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
        <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-[#62636C] mb-3">
          Manajemen Konten
        </p>

        {navigationItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={cn(
                "group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-[#20449A] text-white shadow-sm"
                  : "text-[#62636C] hover:bg-[#EEF2FA] hover:text-[#20449A]"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "h-4 w-4 transition-colors",
                    isActive
                      ? "text-white"
                      : "text-[#62636C] group-hover:text-[#20449A]"
                  )}
                />
                <span>{item.name}</span>
              </div>
              {isActive && <ChevronRight className="h-4 w-4 opacity-75" />}
            </Link>
          );
        })}
      </div>

      {/* Footer Actions: Public Site Link & Logout */}
      <div className="border-t border-[#E2E4EB] p-4 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold text-[#62636C] hover:bg-[#F9F9FB] hover:text-[#20449A] transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="h-3.5 w-3.5" />
            Buka Website Publik
          </span>
          <ChevronRight className="h-3 w-3 text-zinc-400" />
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>{isLoggingOut ? "Keluar..." : "Keluar (Logout)"}</span>
        </button>
      </div>
    </aside>
  );
}
