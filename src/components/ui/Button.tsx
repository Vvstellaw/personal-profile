"use client";

import { cn } from "@/lib/utils";
import type { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

const variantClasses = {
  primary:
    "bg-apple-accent text-white hover:bg-apple-accent-hover active:scale-[0.97]",
  secondary:
    "bg-black/5 text-apple-text hover:bg-black/10 active:scale-[0.97]",
  ghost:
    "bg-transparent text-apple-text hover:bg-black/5 active:scale-[0.97]",
  danger:
    "bg-transparent text-apple-danger border border-apple-danger/30 hover:bg-apple-danger/5 active:scale-[0.97]",
};

const sizeClasses = {
  sm: "px-3 py-1.5 text-xs rounded-full",
  md: "px-5 py-2 text-sm rounded-full",
  lg: "px-7 py-3 text-base rounded-full",
};

export function Button({
  variant = "primary",
  size = "md",
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-apple-accent/40",
        variantClasses[variant],
        sizeClasses[size],
        disabled && "opacity-40 pointer-events-none",
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
