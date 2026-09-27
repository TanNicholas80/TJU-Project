"use client";

import { PublicLayout } from "@/components/layout/public-layout";
import { ErrorView } from "@/components/common/error-view";

export default function ServerErrorPage() {
  return (
    <PublicLayout>
      <ErrorView
        code={500}
        onRetry={() => {
          if (typeof window !== "undefined") {
            window.location.reload();
          }
        }}
        secondaryActionText="Coba Lagi"
      />
    </PublicLayout>
  );
}
