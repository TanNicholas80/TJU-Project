"use client";

import * as React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { I18nProvider } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface PublicLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function PublicLayout({ children, className }: PublicLayoutProps) {
  return (
    <I18nProvider>
      <div className={cn("min-h-screen flex flex-col bg-[#F9F9FB] text-[#1E1F24]", className)}>
        <Navbar />
        <div className="flex-1 flex flex-col">{children}</div>
        <Footer />
      </div>
    </I18nProvider>
  );
}
