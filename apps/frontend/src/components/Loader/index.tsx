import React from "react";
import { LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";

interface LoaderProps {
  color: "white" | "primary";
  isLoading: boolean;
  variant: "inline" | "full-screen";
  size?: "sm" | "md" | "lg";
}

export const Loader: React.FC<LoaderProps> = ({ color, isLoading, variant, size = "sm" }) => {
  if (!isLoading) return null;

  return (
    <div
      className={cn("flex items-center justify-center z-10", {
        "h-6 w-6": size === "sm",
        "h-10 w-10": size === "md",
        "h-14 w-14": size === "lg",
        "fixed inset-0 bg-black/75 h-full w-full": variant === "full-screen",
      })}
    >
      <LoaderCircle
        className={cn("animate-spin", { "h-full w-full": variant === "inline", "h-12 w-12": variant === "full-screen", "text-white": color === "white", "text-primary": color === "primary" })}
      />
    </div>
  );
};

Loader.displayName = "Loader";
