import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Typography } from "@/components/base/Typography";

interface EmptyStateProps extends Omit<ComponentProps<"div">, "title"> {
  action?: ReactNode;
  description: ReactNode;
  icon?: ReactNode;
  secondaryDescription?: ReactNode;
  title: ReactNode;
}

export const EmptyState = ({ action, className, description, icon, secondaryDescription, title, ...props }: EmptyStateProps) => (
  <div className={cn("flex flex-col items-center rounded-[0.95rem] border border-dashed border-border/70 bg-muted/22 px-5 py-8 text-center md:px-8 md:py-10", className)} {...props}>
    {icon ? <div className="mb-4 text-primary [&_svg]:h-14 [&_svg]:w-14">{icon}</div> : null}
    <Typography className="font-bold text-foreground" variant="lg">
      {title}
    </Typography>
    <Typography className="mt-2 max-w-xl text-balance font-normal text-muted-foreground" variant="md-20">
      {description}
    </Typography>
    {secondaryDescription ? (
      <Typography className="mt-1 max-w-xl text-balance font-normal text-muted-foreground" variant="sm-20">
        {secondaryDescription}
      </Typography>
    ) : null}
    {action ? <div className="mt-5 flex w-full max-w-md flex-col gap-3">{action}</div> : null}
  </div>
);

EmptyState.displayName = "EmptyState";
