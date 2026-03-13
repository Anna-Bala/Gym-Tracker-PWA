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
      <div className="xl:pl-[272px]">{children}</div>
      <nav className="flex justify-between w-full fixed bottom-0 left-0 px-5 py-3 bg-gradient-to-b from-background/95 to-background/82 border-t border-border/90 shadow-wide-lg backdrop-blur-md gap-3 z-20 xl:w-[252px] xl:h-screen xl:top-0 xl:left-0 xl:flex-col xl:items-stretch xl:justify-start xl:gap-2 xl:px-4 xl:py-5 xl:border-t-0 xl:border-r xl:border-border/85 xl:bg-background/90 xl:shadow-none xl:backdrop-blur-xl">
        <Typography className="hidden px-4 pb-3 pt-1 font-semibold text-muted-foreground tracking-wide uppercase xl:block" variant="xs">
          Gym Tracker
        </Typography>
        {navigationItems.map(({ customIconClasses, Icon, label, location }) => (
          <NavLink
            className={({ isActive }) =>
              cn(
                "group flex flex-1 flex-col items-center rounded-xl py-1.5 transition-[color,background-color,border-color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background xl:flex-none xl:flex-row xl:justify-start xl:gap-4 xl:px-4 xl:py-3 xl:last:mt-auto",
                {
                  "border border-primary/40 bg-accent/40 text-foreground font-semibold shadow-compact-sm": isActive,
                  "border border-transparent text-muted-foreground hover:bg-accent/60 hover:border-border hover:text-foreground": !isActive,
                }
              )
            }
            to={location}
            key={location}
          >
            {({ isActive }) => (
              <>
                <Icon className={cn("w-9 h-9 xl:w-7 xl:h-7", customIconClasses, { "text-muted-foreground": !isActive, "text-primary": isActive })} />
                <Typography className="text-[11px] md:text-sm xl:text-[18px] xl:leading-[1.25]" variant="sm-20">
                  {label}
                </Typography>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </>
  );
};

Navigation.displayName = "Navigation";
