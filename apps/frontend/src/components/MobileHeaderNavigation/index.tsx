import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Typography } from "@/components/base/Typography";
import Chevron from "@icons/chevron.svg?react";

interface MobileHeaderNavigation {
  centerText?: boolean;
  headerText: string;
  hideGoBackButton?: boolean;
}

export const MobileHeaderNavigation: React.FC<MobileHeaderNavigation> = ({ centerText, headerText, hideGoBackButton }) => {
  const navigate = useNavigate();

  return (
    <header className={cn("flex items-center relative h-9 w-full", { "gap-4": !hideGoBackButton })}>
      {!hideGoBackButton ? (
        <Button className="-ml-2" variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <Chevron className="!w-8 !h-8 text-foreground stroke-[5]" />
        </Button>
      ) : null}
      <Typography className={cn("w-max text-foreground font-semibold", { "text-center absolute left-1/2 -translate-x-1/2": centerText, "text-left": !centerText })} variant="h2">
        {headerText}
      </Typography>
    </header>
  );
};

MobileHeaderNavigation.displayName = "MobileHeaderNavigation";
