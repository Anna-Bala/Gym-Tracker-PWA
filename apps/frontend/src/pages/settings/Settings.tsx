import { Link } from "react-router-dom";

import { Button } from "@/components/ui";
import { changeUserTheme } from "@/lib/api";
import { cn } from "@/lib/utils";
import { MobileHeaderNavigation } from "@/components/MobileHeaderNavigation";
import { Switch } from "@/components/ui/switch";
import { Typography } from "@/components/base/Typography";
import { useTheme } from "@/contexts/theme/useTheme";
import Chevron from "@icons/chevron.svg?react";
import Label from "@/components/ui/label";
import Moon from "@icons/moon-no-color.svg?react";
import PersonExit from "@icons/person-exit-no-color.svg?react";
import PersonLifting from "@icons/person-lifting-no-color.svg?react";
import PersonPortrait from "@icons/person-portrait-no-color.svg?react";

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
];

const Settings = () => {
  const { theme, setTheme } = useTheme();

  const handleDarkModeChange = (value: boolean) => {
    const newTheme = value ? "dark" : "light";
    setTheme(newTheme);
    changeUserTheme(newTheme);
    document.body.classList.toggle("dark");
  };

  const buttonClasses = "text-base flex items-center !px-0 justify-start text-foreground py-2 gap-4 font-medium";
  const iconClasses = "!w-10 !h-10 text-foreground";
  const chevronClasses = "!w-6 !h-6 rotate-180 ml-auto mr-2 stroke-[3]";

  return (
    <section>
      <MobileHeaderNavigation centerText hideGoBackButton headerText="Settings" />
      <div className="flex flex-col w-full mt-6 gap-4 h-[calc(100vh-230px)]">
        {settingsOptions.map(({ Icon, label, to }) => {
          return (
            <Link className={buttonClasses} to={to} key={label}>
              <>
                <Icon className={iconClasses} />
                <Typography variant="md-24">{label}</Typography>
                <Chevron className={chevronClasses} />
              </>
            </Link>
          );
        })}

        <div className="flex items-center">
          <Moon className={iconClasses} />
          <Label className={cn(buttonClasses, "ml-4")} htmlFor="dark-mode">
            Dark Mode
          </Label>
          <Switch className="ml-auto" checked={theme === "dark"} onCheckedChange={handleDarkModeChange} id="dark-mode" />
        </div>

        <Button className={cn(buttonClasses, "mt-auto text-destructive border border-destructive justify-center gap-1")} variant="outline" size="lg">
          <>
            <PersonExit className={cn(iconClasses, "text-destructive")} />
            Logout
          </>
        </Button>
      </div>
    </section>
  );
};

export default Settings;
