"use client";

import * as React from "react";
import { Menu, Bell, User } from "lucide-react";
import { useSession } from "@/lib/auth-client";

interface AdminHeaderProps {
  onToggleMobileSidebar: () => void;
  title?: string;
}

export function AdminHeader({
  onToggleMobileSidebar,
  title = "CMS Dashboard Overview",
}: AdminHeaderProps) {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-[#E2E4EB] bg-white/95 px-6 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="inline-flex md:hidden items-center justify-center rounded-lg p-2 text-[#62636C] hover:bg-[#F0F1F5] hover:text-[#1E1F24]"
          aria-label="Toggle Navigation"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-[#1E1F24]">{title}</h1>
          <p className="text-xs text-[#62636C] hidden sm:block">
            Panel Administrasi & Pengelolaan Konten TJU Truss
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Status Live Badge */}
        <div className="hidden sm:inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Sistem Online
        </div>

        {/* User Pill */}
        <div className="flex items-center gap-2.5 rounded-full border border-[#E2E4EB] bg-[#F9F9FB] px-3.5 py-1.5 shadow-2xs">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#20449A] text-white">
            <User className="h-3.5 w-3.5" />
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold text-[#1E1F24]">
              {session?.user?.name || "Administrator"}
            </p>
            <p className="text-[10px] text-[#62636C]">
              {session?.user?.email || "admin@tjutruss.com"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
