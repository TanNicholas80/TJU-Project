"use client";

import * as React from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type LanguageCode = "id" | "en" | "zh";

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeName: string;
  flag: React.ReactNode;
}

// Crisp inline SVGs for supported flags
const FlagID = () => (
  <svg
    viewBox="0 0 640 480"
    className="h-3.5 w-5 rounded-xs object-cover shadow-xs border border-black/10 inline-block shrink-0"
    aria-hidden="true"
  >
    <g fillRule="evenodd" strokeWidth="1pt">
      <path fill="#e70011" d="M0 0h640v240H0z" />
      <path fill="#fff" d="M0 240h640v240H0z" />
    </g>
  </svg>
);

const FlagGB = () => (
  <svg
    viewBox="0 0 640 480"
    className="h-3.5 w-5 rounded-xs object-cover shadow-xs border border-black/10 inline-block shrink-0"
    aria-hidden="true"
  >
    <path fill="#012169" d="M0 0h640v480H0z" />
    <path
      fill="#FFF"
      d="m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0z"
    />
    <path
      fill="#C8102E"
      d="m424 281 216 159v40L369 281zm-208-82L0 40V0l271 200zM640 0v3L432 161l16 38L640 43zm-640 480v-3l208-158-16-39L0 437z"
    />
    <path fill="#FFF" d="M240 0h160v480H240zM0 160h640v160H0z" />
    <path fill="#C8102E" d="M267 0h107v480H267zM0 187h640v107H0z" />
  </svg>
);

const FlagCN = () => (
  <svg
    viewBox="0 0 640 480"
    className="h-3.5 w-5 rounded-xs object-cover shadow-xs border border-black/10 inline-block shrink-0"
    aria-hidden="true"
  >
    <path fill="#ee1c25" d="M0 0h640v480H0z" />
    <path
      fill="#ff0"
      d="M125 152 78 120l-47 31 18-54-47-32 58-1 19-54 18 55 58 1-46 33zm60-92 3 20-17-10-18 10 4-20-15-12 20-3 9-18 8 18 20 2zm34 42 10 18-20-3-13 15-2-20-18-8 19-5 6-19 13 14 20-4zm11 49 16 13-20 4-7 19-10-17-20 1 14-14-1-20 18 9 15-13zm-21 44 20 5-15 13 1 20-18-9-16 13 2-20-15-13 20-1 7-19z"
    />
  </svg>
);

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: "id",
    label: "ID",
    nativeName: "Bahasa Indonesia",
    flag: <FlagID />,
  },
  {
    code: "en",
    label: "EN",
    nativeName: "English",
    flag: <FlagGB />,
  },
  {
    code: "zh",
    label: "ZH",
    nativeName: "中文 (Mandarin)",
    flag: <FlagCN />,
  },
];

interface LanguageSwitcherProps {
  currentLocale?: LanguageCode;
  onLanguageChange?: (code: LanguageCode) => void;
  className?: string;
}

export function LanguageSwitcher({
  currentLocale = "id",
  onLanguageChange,
  className,
}: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedLang, setSelectedLang] = React.useState<LanguageCode>(currentLocale);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setSelectedLang(currentLocale);
  }, [currentLocale]);

  // Handle outside click to close dropdown
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const activeOption =
    SUPPORTED_LANGUAGES.find((l) => l.code === selectedLang) ||
    SUPPORTED_LANGUAGES[0];

  const handleSelect = (code: LanguageCode) => {
    setSelectedLang(code);
    setIsOpen(false);
    if (onLanguageChange) {
      onLanguageChange(code);
    }
  };

  return (
    <div ref={dropdownRef} className={cn("relative inline-block text-left", className)}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className={cn(
          "flex items-center gap-2 rounded-md border border-[#E2E4EB] bg-white px-3 py-2 text-xs font-semibold text-[#1E1F24] transition-all hover:bg-[#F9F9FB] hover:border-[#20449A]/30 focus:outline-none focus:ring-2 focus:ring-[#20449A]/20 cursor-pointer shadow-xs",
          isOpen && "border-[#20449A] ring-2 ring-[#20449A]/15"
        )}
      >
        <span className="flex items-center gap-1.5">
          {activeOption.flag}
          <span className="font-semibold tracking-wide uppercase">
            {activeOption.label}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-[#62636C] transition-transform duration-200",
            isOpen && "rotate-180 text-[#20449A]"
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 z-50 mt-1.5 w-44 origin-top-right rounded-lg border border-[#E2E4EB] bg-white p-1.5 shadow-lg ring-1 ring-black/5 animate-in fade-in-0 zoom-in-95 duration-100"
        >
          <div className="px-2 py-1 text-[10px] font-semibold tracking-wider text-[#62636C] uppercase">
            Pilih Bahasa / Language
          </div>
          <div className="h-[1px] bg-[#E2E4EB] my-1" />
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = lang.code === selectedLang;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelect(lang.code)}
                role="menuitem"
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs text-[#1E1F24] transition-colors hover:bg-[#EEF2FA] hover:text-[#20449A] cursor-pointer",
                  isSelected && "bg-[#EEF2FA] font-semibold text-[#20449A]"
                )}
              >
                <span className="flex items-center gap-2">
                  {lang.flag}
                  <span>{lang.nativeName}</span>
                </span>
                {isSelected && (
                  <Check className="h-3.5 w-3.5 text-[#20449A] shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
