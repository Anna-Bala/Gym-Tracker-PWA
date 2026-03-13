import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Typography } from "@/components/base/Typography";
import Chevron from "@icons/chevron.svg?react";

interface MobileHeaderNavigation {
  centerText?: boolean;
  children?: ReactNode;
  headerText?: string;
  hideGoBackButton?: boolean;
}

export const MobileHeaderNavigation: React.FC<MobileHeaderNavigation> = ({ centerText, children, headerText, hideGoBackButton }) => {
  const navigate = useNavigate();

  return (
    <header
      className={cn(
        "flex w-full items-center min-h-14 relative rounded-[1.35rem] border border-border/70 bg-background/85 px-2 shadow-wide-xs backdrop-blur-md transition-[background-color,border-color,box-shadow]",
        {
          "gap-2": !hideGoBackButton,
          hidden: !headerText && hideGoBackButton,
        }
      )}
    >
      {!hideGoBackButton ? (
        <Button className="relative z-10 rounded-xl" variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <Chevron className="!h-7 !w-7 text-foreground stroke-[4]" />
        </Button>
      ) : null}
      <Typography
        className={cn("text-foreground font-extrabold", {
          "pointer-events-none absolute left-1/2 top-1/2 w-[calc(100%-7rem)] -translate-x-1/2 -translate-y-1/2 px-2 text-center": centerText,
          "text-left min-w-0 flex-1 pl-1": !centerText,
        })}
        variant="h5"
      >
        {headerText}
      </Typography>
      {children ? <div className="flex items-center relative z-10 ml-auto">{children}</div> : null}
    </header>
  );
};

MobileHeaderNavigation.displayName = "MobileHeaderNavigation";
