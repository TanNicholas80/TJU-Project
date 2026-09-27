"use client";

import * as React from "react";
import { PublicLayout } from "@/components/layout/public-layout";
import { ErrorView, type ErrorStatusCode } from "@/components/common/error-view";
import { Button } from "@/components/ui/button";

export default function ErrorPreviewPage() {
  const [activeCode, setActiveCode] = React.useState<ErrorStatusCode>(404);

  return (
    <PublicLayout>
      {/* Interactive Switcher Bar for Review */}
      <div className="bg-white border-b border-[#E2E4EB] py-3 px-4 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#62636C] uppercase tracking-wider">
              Preview State:
            </span>
            <div className="inline-flex rounded-lg border border-[#E2E4EB] p-1 bg-[#F0F1F5]/60">
              {([403, 404, 500] as ErrorStatusCode[]).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setActiveCode(code)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    activeCode === code
                      ? "bg-[#20449A] text-white shadow-xs"
                      : "text-[#62636C] hover:text-[#1E1F24]"
                  }`}
                >
                  Error {code}
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs text-[#62636C]">
            Status: <span className="font-semibold text-[#20449A]">HTTP {activeCode}</span>
          </div>
        </div>
      </div>

      {/* Render the selected ErrorView */}
      <ErrorView
        code={activeCode}
        onRetry={
          activeCode === 500
            ? () => alert("Simulasi: Percobaan menghubungkan ulang ke server...")
            : undefined
        }
      />
    </PublicLayout>
  );
}
