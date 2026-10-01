"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { t, locale, setLocale } = useI18n();

  const navItems = [
    { label: t("navigation.home"), href: "/" },
    { label: t("navigation.about"), href: "/about" },
    { label: t("navigation.blog"), href: "/blog" },
    { label: t("navigation.portfolio"), href: "/portofolio" },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b border-[#E2E4EB]/80 bg-white/95 backdrop-blur-md transition-all",
        className
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group focus:outline-none">
          <Image
            src="/images/logo_tju.png"
            alt="TJU TRUSS SYSTEM"
            width={180}
            height={48}
            priority
            className="h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative py-2 text-sm font-medium transition-colors hover:text-[#20449A]",
                  isActive
                    ? "text-[#20449A] font-semibold"
                    : "text-[#62636C]"
                )}
              >
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] rounded-full bg-[#20449A] transition-all" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Dropdown Translate di Kiri, Hubungi Kami di Kanan */}
        <div className="hidden md:flex items-center gap-3">
          {/* 1. Dropdown translate berada di sebelah KIRI */}
          <LanguageSwitcher
            currentLocale={locale}
            onLanguageChange={setLocale}
          />

          {/* 2. Button Hubungi Kami berada di sebelah KANAN */}
          <Link href="/contact">
            <Button
              variant="orange"
              size="default"
              className="px-5 font-semibold text-sm shadow-xs"
            >
              {t("navigation.contact")}
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <LanguageSwitcher
            currentLocale={locale}
            onLanguageChange={setLocale}
          />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-md p-2 text-[#62636C] hover:bg-[#F0F1F5] hover:text-[#1E1F24] focus:outline-none"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E2E4EB] bg-white px-4 pt-3 pb-6 space-y-4 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-[#EEF2FA] text-[#20449A] font-semibold"
                    : "text-[#62636C] hover:bg-[#F9F9FB] hover:text-[#1E1F24]"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="pt-2 border-t border-[#E2E4EB]">
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full block"
            >
              <Button variant="orange" className="w-full font-semibold">
                {t("navigation.contact")}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
