import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";

import { cn } from "@/lib/utils";
import { navigationItems } from "./constants";
import { Typography } from "@/components/base/Typography";

interface Navigation {
  isHidden?: boolean;
  children: ReactNode;
}

export const Navigation: React.FC<Navigation> = ({ children, isHidden }) => {
  if (isHidden) return children;

  return (
    <>
      {children}
      <div className="flex justify-between w-full fixed bottom-0 left-0 px-6 py-4 bg-background border-t border-muted shadow-wide-xl gap-4 z-20 lg:w-1/12 lg:sticky lg:top-8 lg:border-0 lg:shadow-none lg:flex-col lg:max-h-[90vh] lg:gap-12 lg:justify-start">
        {navigationItems.map(({ customIconClasses, Icon, label, location }) => (
          <NavLink
            className={({ isActive }) =>
              cn("flex flex-1 flex-col items-center lg:justify-center lg:flex-none lg:last:mt-auto", {
                "text-accent-foreground font-bold stroke-[3]": isActive,
                "stroke-2 text-muted-foreground dark:text-accent": !isActive,
              })
            }
            to={location}
            key={location}
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

Navigation.displayName = "Navigation";
