"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export type ErrorStatusCode = 400 | 401 | 403 | 404 | 500 | 502 | 503;

export interface ErrorViewProps {
  /**
   * HTTP status code (e.g. 403, 404, 500).
   */
  code?: ErrorStatusCode | number | string;
  /**
   * Custom main heading. If omitted, uses localized i18n preset.
   */
  title?: string;
  /**
   * Detailed explanation text. If omitted, uses localized i18n preset.
   */
  description?: string;
  /**
   * Label for the primary CTA button. If omitted, uses localized i18n preset.
   */
  actionText?: string;
  /**
   * Navigation link for the primary button (defaults to "/").
   */
  actionHref?: string;
  /**
   * Optional retry callback, useful for 500 server errors.
   */
  onRetry?: () => void;
  /**
   * Optional custom secondary action button label.
   */
  secondaryActionText?: string;
  className?: string;
}

export function ErrorView({
  code = 404,
  title,
  description,
  actionText,
  actionHref = "/",
  onRetry,
  secondaryActionText,
  className,
}: ErrorViewProps) {
  const { t } = useI18n();
  const numericCode = typeof code === "number" ? code : parseInt(String(code), 10);

  // Dynamic lookup from next-intl dictionary
  const localizedTitle =
    title ||
    t(`errors.${numericCode}.title`) ||
    "Terjadi kesalahan.";

  const localizedDescription =
    description ||
    t(`errors.${numericCode}.description`) ||
    "Halaman yang diminta mengalami kendala. Silakan coba kembali.";

  const localizedActionText = actionText || t("errors.backHome") || "Kembali ke Beranda";
  const localizedRetryText = secondaryActionText || t("errors.retry") || "Coba Lagi";

  return (
    <main
      className={cn(
        "flex flex-1 flex-col items-center justify-center py-20 px-4 sm:px-6 lg:px-8 text-center min-h-[55vh]",
        className
      )}
    >
      <div className="w-full max-w-xl mx-auto flex flex-col items-center">
        {/* Big Status Code */}
        <span
          className="text-7xl sm:text-8xl md:text-9xl font-extrabold tracking-tight text-[#20449A] select-none"
          aria-hidden="true"
        >
          {code}
        </span>

        {/* Title */}
        <h1 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#1E1F24]">
          {localizedTitle}
        </h1>

        {/* Description */}
        <p className="mt-3.5 text-sm sm:text-base md:text-lg leading-relaxed text-[#62636C] max-w-lg">
          {localizedDescription}
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {onRetry && (
            <Button
              variant="outline"
              size="lg"
              onClick={onRetry}
              className="gap-2 font-medium"
            >
              <RotateCcw className="h-4 w-4" />
              {localizedRetryText}
            </Button>
          )}

          <Link href={actionHref}>
            <Button
              variant="primary"
              size="lg"
              className="px-6 py-2.5 font-medium shadow-sm hover:shadow-md transition-all group"
            >
              <span>{localizedActionText}</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
