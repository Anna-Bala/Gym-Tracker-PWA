import { Link } from "react-router-dom";

import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Typography } from "@/components/base/Typography";
import Chevron from "@icons/chevron.svg?react";
import Moon from "@icons/moon-no-color.svg?react";
import PersonExit from "@icons/person-exit-no-color.svg?react";
import PersonLifting from "@icons/person-lifting-no-color.svg?react";
import PersonPortrait from "@icons/person-portrait-no-color.svg?react";

const Settings = () => {
  const settingsOptions = [
    {
      label: "Profile & Security",
      Icon: PersonPortrait,
      to: "/settings/profile",
    },
    {
      label: "Body Metrics",
      Icon: PersonLifting,
      to: "/settings/metrics",
    },
    {
      label: "Dark Mode",
      Icon: Moon,
      onClick: () => {},
    },
    {
      label: "Logout",
      Icon: PersonExit,
      onClick: () => {},
    },
  ];

  const buttonClasses = "text-base flex items-center !px-0 justify-start text-foreground py-2 gap-4 font-medium";
  const iconClasses = "!w-10 !h-10 text-foreground";
  const chevronClasses = "!w-6 !h-6 rotate-180 ml-auto mr-2";

  return (
    <section>
      <Typography className="w-full text-center font-semibold" variant="h2">
        Settings
      </Typography>
      <div className="flex flex-col w-full mt-6 gap-4 h-[calc(100vh-230px)]">
        {settingsOptions.map(({ Icon, label, onClick, to }) => {
          const isLogout = label === "Logout";

          return to ? (
            <Link className={buttonClasses} to={to} key={label}>
              <>
                <Icon className={iconClasses} />
                <Typography variant="md-24">{label}</Typography>
                <Chevron className={chevronClasses} />
              </>
            </Link>
          ) : onClick ? (
            <Button className={cn(buttonClasses, { "mt-auto text-destructive border border-destructive justify-center gap-1": isLogout })} variant="link" size="lg" onClick={onClick} key={label}>
              <>
                <Icon className={cn(iconClasses, { "text-destructive": isLogout })} />
                {label}
                {!isLogout && <Chevron className={chevronClasses} />}
              </>
            </Button>
          ) : null;
        })}
      </div>
    </section>
  );
};

export default Settings;
