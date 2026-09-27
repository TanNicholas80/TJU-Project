"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";
import { FaTiktok, FaInstagram, FaFacebookF } from "react-icons/fa6";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const { t } = useI18n();

  return (
    <footer
      className={cn(
        "w-full bg-[#20449A] text-white mt-auto pt-14 pb-8",
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12">
          {/* Column 1: Brand Info & Socials */}
          <div className="md:col-span-5 space-y-5">
            <Link href="/" className="inline-block focus:outline-none">
              <div className="flex items-center gap-2">
                <Image
                  src="/images/logo_tju.png"
                  alt="TJU TRUSS SYSTEM"
                  width={180}
                  height={48}
                  className="h-9 w-auto object-contain brightness-0 invert"
                />
              </div>
            </Link>

            <p className="text-sm leading-relaxed text-blue-100/90 max-w-sm">
              {t("footer.companyDescription")}
            </p>

            {/* Social Media Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TJU Truss TikTok"
                className="flex h-9 w-9 items-center justify-center rounded-md bg-[#163378] text-white transition-all hover:bg-white hover:text-[#20449A] hover:scale-105"
              >
                <FaTiktok className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TJU Truss Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-md bg-[#163378] text-white transition-all hover:bg-white hover:text-[#20449A] hover:scale-105"
              >
                <FaInstagram className="h-4 w-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TJU Truss Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-md bg-[#163378] text-white transition-all hover:bg-white hover:text-[#20449A] hover:scale-105"
              >
                <FaFacebookF className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="md:col-span-3 space-y-4">
            <h3 className="text-base font-semibold text-white tracking-wide">
              {t("footer.quickLinks")}
            </h3>
            <ul className="space-y-2.5 text-sm text-blue-100/85">
              <li>
                <Link
                  href="/"
                  className="transition-colors hover:text-white hover:underline underline-offset-4"
                >
                  {t("navigation.home")}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="transition-colors hover:text-white hover:underline underline-offset-4"
                >
                  {t("navigation.about")}
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="transition-colors hover:text-white hover:underline underline-offset-4"
                >
                  {t("navigation.blog")}
                </Link>
              </li>
              <li>
                <Link
                  href="/portofolio"
                  className="transition-colors hover:text-white hover:underline underline-offset-4"
                >
                  {t("navigation.portfolio")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Semarang Contact Office */}
          <div className="md:col-span-4 space-y-4">
            <h3 className="text-base font-semibold text-white tracking-wide">
              {t("footer.citySemarang")}
            </h3>
            <ul className="space-y-3 text-sm text-blue-100/90">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 shrink-0 text-blue-200 mt-0.5" />
                <span className="leading-snug">
                  Jl. Patimura No.6C, Rejomulyo, Kec. Semarang Tim., Kota
                  Semarang, Jawa Tengah, 50126
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-blue-200" />
                <a
                  href="tel:0243519776"
                  className="hover:text-white transition-colors"
                >
                  (024) 3519 776
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-blue-200" />
                <a
                  href="mailto:admin@tjutruss.com"
                  className="hover:text-white transition-colors"
                >
                  admin@tjutruss.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="mt-12 border-t border-white/15 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-blue-100/80">
          <p>{t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
