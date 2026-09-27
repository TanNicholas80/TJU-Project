import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "primary"
    | "orange"
    | "accent"
    | "secondary"
    | "outline"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      type = "button",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer";

    const variantStyles: Record<string, string> = {
      default:
        "bg-[#20449A] text-white hover:bg-[#18367D] shadow-sm active:scale-[0.98]",
      primary:
        "bg-[#20449A] text-white hover:bg-[#18367D] shadow-sm active:scale-[0.98]",
      orange:
        "bg-[#F48902] text-white hover:bg-[#D87700] shadow-sm active:scale-[0.98]",
      accent:
        "bg-[#F48902] text-white hover:bg-[#D87700] shadow-sm active:scale-[0.98]",
      secondary:
        "bg-[#EEF2FA] text-[#20449A] hover:bg-[#DCE5F5] active:scale-[0.98]",
      outline:
        "border border-[#E2E4EB] bg-white text-[#1E1F24] hover:bg-[#F9F9FB] hover:text-[#20449A]",
      ghost:
        "hover:bg-[#F0F1F5] text-[#62636C] hover:text-[#1E1F24]",
      link: "text-[#20449A] underline-offset-4 hover:underline",
    };

    const sizeStyles: Record<string, string> = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3 text-xs",
      lg: "h-11 rounded-md px-8 text-base",
      icon: "h-10 w-10 p-0",
    };

    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          baseStyles,
          variantStyles[variant] || variantStyles.default,
          sizeStyles[size] || sizeStyles.default,
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
