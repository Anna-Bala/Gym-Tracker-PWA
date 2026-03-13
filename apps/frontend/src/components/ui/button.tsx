import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg typography-sm-16 font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/30 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-compact-xs hover:bg-primary/92 hover:shadow-compact-sm",
        destructive:
          "bg-destructive text-white shadow-compact-xs hover:bg-destructive/92 hover:shadow-compact-sm focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline: "border border-border/80 bg-background text-foreground shadow-none hover:bg-accent/45 hover:text-accent-foreground dark:bg-card/30 dark:hover:bg-accent/60",
        secondary: "bg-secondary text-secondary-foreground shadow-none hover:bg-secondary/88",
        ghost: "hover:bg-accent/45 hover:text-accent-foreground dark:hover:bg-accent/60",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-4 py-2.5 has-[>svg]:px-3.5",
        sm: "h-9 gap-1.5 rounded-md px-3.5 has-[>svg]:px-3",
        lg: "h-12 px-6 has-[>svg]:px-4.5",
        icon: "size-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants };
