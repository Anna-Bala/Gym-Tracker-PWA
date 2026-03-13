import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Typography } from "@/components/base/Typography";

interface SectionHeaderProps extends Omit<ComponentProps<"div">, "title"> {
  action?: ReactNode;
  description?: ReactNode;
  title: ReactNode;
}

export const SectionHeader = ({ action, className, description, title, ...props }: SectionHeaderProps) => (
  <div className={cn("flex flex-col gap-3 md:flex-row md:items-start md:justify-between", className)} {...props}>
    <div className="space-y-1.5">
      <Typography className="font-bold text-foreground" variant="h4">
        {title}
      </Typography>
      {description ? (
        <Typography className="font-normal text-muted-foreground" variant="sm-20">
          {description}
        </Typography>
      ) : null}
    </div>
    {action ? <div className="shrink-0">{action}</div> : null}
  </div>
);

SectionHeader.displayName = "SectionHeader";
