import { useState } from "react";
import { CircleAlert } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { Alert } from "@/components/Alert";
import { authFetch } from "@/lib/fetchClient";
import { Button } from "@/components/ui";
import { changeUserTheme } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Loader } from "@/components/Loader";
import { ResponsivePageShell } from "@/components/base/ResponsivePageShell";
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
  const [isLogoutError, setIsLogoutError] = useState(false);
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);

  const { theme, setTheme } = useTheme();

  const handleDarkModeChange = (value: boolean) => {
    const newTheme = value ? "dark" : "light";
    setTheme(newTheme);
    changeUserTheme(newTheme);
    document.body.classList.toggle("dark");
  };

  const navigate = useNavigate();

  const handleLogoutAction = async () => {
    setIsLogoutLoading(true);
    setIsLogoutError(false);

    await authFetch("/auth/logout", {
      method: "POST",
      credentials: "include",
    })
      .then(() => navigate("/login"))
      .catch(() => setIsLogoutError(true))
      .finally(() => setIsLogoutLoading(false));
  };

  const buttonClasses =
    "text-base flex items-center justify-start text-foreground p-3 gap-4 font-medium rounded-2xl border border-border bg-card/90 shadow-compact-xs transition-[border-color,background-color,box-shadow] hover:cursor-pointer hover:bg-accent/60 hover:border-primary/35 hover:shadow-compact-md";
  const iconClasses = "!w-10 !h-10";
  const chevronClasses = "!w-6 !h-6 rotate-180 ml-auto mr-2 stroke-[3]";

  return (
    <ResponsivePageShell hideMobileBackButton title="Settings">
      <div className="grid grid-cols-1 gap-4 xl:gap-6">
        <div className="flex flex-col gap-4">
          {settingsOptions.map(({ Icon, label, to }) => {
            return (
              <Link className={buttonClasses} to={to} key={label}>
                <>
                  <Icon className={cn(iconClasses, "text-foreground")} />
                  <Typography variant="md-24">{label}</Typography>
                  <Chevron className={chevronClasses} />
                </>
              </Link>
            );
          })}

          <div className="flex items-center rounded-2xl border border-border bg-card/90 p-3 gap-4 shadow-compact-xs">
            <Moon className={cn(iconClasses, "text-foreground")} />
            <Label className={cn("text-base font-medium")} htmlFor="dark-mode">
              Dark Mode
            </Label>
            <Switch className="ml-auto" checked={theme === "dark"} onCheckedChange={handleDarkModeChange} id="dark-mode" />
          </div>
        </div>

        <div className="flex flex-col gap-4 xl:sticky xl:top-24">
          {isLogoutError && (
            <Alert
              variant="destructive"
              title="We couldn't sign you out"
              icon={<CircleAlert />}
              description="Something went wrong on our end. Please try clicking 'Logout' again, or simply close your browser window to finish."
            />
          )}
          <Button
            className={cn(buttonClasses, "text-destructive border-destructive justify-center gap-1 md:w-fit md:m-auto")}
            variant="outline"
            size="lg"
            onClick={handleLogoutAction}
            disabled={isLogoutLoading}
          >
            <>
              <PersonExit className={cn(iconClasses, "text-destructive")} />
              Logout
              <Loader color="destructive" variant="inline" isLoading={isLogoutLoading} />
            </>
          </Button>
        </div>
      </div>
    </ResponsivePageShell>
  );
};

export default Settings;
