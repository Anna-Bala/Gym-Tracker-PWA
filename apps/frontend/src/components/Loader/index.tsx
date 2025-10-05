import React from "react";
import { LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";

interface LoaderProps {
  color: "white" | "primary";
  isLoading: boolean;
  variant: "inline" | "full-screen";
}

export const Loader: React.FC<LoaderProps> = ({ color, isLoading, variant }) => {
  if (!isLoading) return null;

  return (
    <div className={cn("flex items-center justify-center bg-black/75 fixed z-10 inset-0", { "h-6 w-6 inline-block": variant === "inline", "h-full w-full": variant === "full-screen" })}>
      <LoaderCircle className={cn("animate-spin h-12 w-12", { "text-white": color === "white", "text-primary": color === "primary" })} />
    </div>
  );
};

Loader.displayName = "Loader";
