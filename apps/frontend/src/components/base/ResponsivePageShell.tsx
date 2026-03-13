import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { MobileHeaderNavigation } from "@/components/MobileHeaderNavigation";
import { Typography } from "@/components/base/Typography";

interface ResponsivePageShellProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  hideMobileBackButton?: boolean;
  title?: string;
}

export const ResponsivePageShell = ({ children, className, contentClassName, hideMobileBackButton = false, title }: ResponsivePageShellProps) => (
  <section className={cn("flex min-h-[90vh] flex-col pb-24 xl:min-h-[calc(100vh-5rem)] xl:pb-8 lg:max-w-[800px] lg:m-auto", className)}>
    <div className="xl:hidden">
      <MobileHeaderNavigation centerText hideGoBackButton={hideMobileBackButton} headerText={title} />
    </div>

    <header className={cn("hidden xl:block", { hidden: !title })}>
      <div className="mx-auto flex w-full max-w-[760px] flex-col items-center text-center">
        <Typography className="max-w-[22ch] text-balance font-bold tracking-tight text-foreground" variant="h2">
          {title}
        </Typography>
      </div>
    </header>

    <div className={cn("mt-5 w-full xl:mt-8", contentClassName)}>{children}</div>
  </section>
);

ResponsivePageShell.displayName = "ResponsivePageShell";

export default ResponsivePageShell;
