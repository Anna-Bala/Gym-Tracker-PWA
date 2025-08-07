import React from "react";
import type { JSX } from "react";

import { cn } from "@/lib/utils";

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant: "h1" | "h2" | "h3" | "h4" | "h5" | "lg" | "md-24" | "md-20" | "sm-20" | "sm-16" | "xs" | "xxs";
}

const variantsMapping: Record<TypographyProps["variant"], keyof JSX.IntrinsicElements> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  lg: "p",
  "md-24": "p",
  "md-20": "p",
  "sm-20": "p",
  "sm-16": "p",
  xs: "p",
  xxs: "p",
};

export const Typography = React.forwardRef<HTMLElement, TypographyProps>(({ className, variant, ...props }, ref) => {
  const Component = variantsMapping[variant] || "p";

  return React.createElement(Component, {
    ref,
    className: cn(`typography-${variant}`, className),
    ...props,
  });
});

Typography.displayName = "Typography";
