import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const sectionCardVariants = cva("", {
  variants: {
    tone: {
      default: "border-t border-border/70 pt-5 md:pt-6",
      accent: "surface-card-accent p-5 md:p-6",
      muted: "surface-muted p-5 md:p-6",
    },
  },
  defaultVariants: {
    tone: "default",
  },
});

export const SectionCard = ({ className, tone, ...props }: ComponentProps<"section"> & VariantProps<typeof sectionCardVariants>) => {
  return <section className={cn(sectionCardVariants({ tone }), className)} {...props} />;
};

SectionCard.displayName = "SectionCard";
