"use client";

import * as React from "react";
import { PublicLayout } from "@/components/layout/public-layout";
import { ErrorView } from "@/components/common/error-view";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Optionally log error to monitoring service (e.g. Sentry/Console)
    console.error("App Error caught by Next.js Error Boundary:", error);
  }, [error]);

  return (
    <PublicLayout>
      <ErrorView
        code={500}
        onRetry={reset}
        secondaryActionText="Coba Lagi"
      />
    </PublicLayout>
  );
}
