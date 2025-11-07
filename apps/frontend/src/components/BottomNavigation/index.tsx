import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";

import { cn } from "@/lib/utils";
import { navigationItems } from "./constants";
import { Typography } from "@/components/base/Typography";

interface BottomNavigation {
  isHidden?: boolean;
  children: ReactNode;
}

export const BottomNavigation: React.FC<BottomNavigation> = ({ children, isHidden }) => {
  if (isHidden) return children;

  return (
    <>
      {children}
      <div className="flex justify-between w-full fixed bottom-0 left-0 px-6 py-4 bg-background border-t border-muted shadow-wide-xl gap-4 z-20">
        {navigationItems.map(({ customIconClasses, Icon, label, location }) => (
          <NavLink
            className={({ isActive }) =>
              cn("flex flex-1 flex-col items-center", { "text-accent-foreground font-bold stroke-[3]": isActive, "stroke-2 text-muted-foreground dark:text-accent": !isActive })
            }
            to={location}
          >
            <>
              <Icon className={cn("w-10 h-10", customIconClasses)} />
              <Typography variant="sm-20">{label}</Typography>
            </>
          </NavLink>
        ))}
      </div>
    </>
  );
};

BottomNavigation.displayName = "BottomNavigation";
