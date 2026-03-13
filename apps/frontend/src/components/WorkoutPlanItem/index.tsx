import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import { Badge } from "../ui";
import { cn, formatFocusArea } from "@/lib/utils";
import { Typography } from "@/components/base/Typography";
import Fire from "@icons/fire.svg?react";
import Timer from "@icons/timer.svg?react";

interface WorkoutPlanItemProps {
  children?: ReactNode;
  className?: string;
  variant?: "default" | "primary";
  workoutPlan: { id: number; calories: number; name: string; ai: boolean; duration: number; focusArea: string[] };
}

export const WorkoutPlanItem = ({ children, className, variant = "default", workoutPlan }: WorkoutPlanItemProps) => {
  const workoutPlanRowInfo = [
    { Icon: Timer, text: `${Math.round(workoutPlan.duration / 60)} mins` },
    { Icon: Fire, text: `${workoutPlan.calories} kcal` },
    { Icon: null, text: formatFocusArea(workoutPlan.focusArea) },
  ];

  return (
    <Link
      className={cn(
        "surface-card flex items-center gap-4 p-4 transition-colors duration-200 hover:border-primary/50 hover:bg-primary/[0.05] md:px-5",
        {
          "surface-card-accent flex-wrap border-primary/22 bg-primary/[0.03]": variant === "primary",
        },
        className
      )}
      to={`/home/workout-plan/${workoutPlan.id}`}
    >
      <div className="flex flex-grow flex-col">
        <Typography
          className={cn("flex items-center font-normal text-left", {
            "text-card-foreground": variant === "default",
            "text-foreground": variant === "primary",
          })}
          variant="lg"
        >
          {workoutPlan.ai && (
            <Badge className="mr-3" variant="default">
              AI
            </Badge>
          )}
          {workoutPlan.name}
        </Typography>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {workoutPlanRowInfo.map(({ Icon, text }) => (
            <div className="contents" key={`${workoutPlan.id}-${text}`}>
              <Typography
                className={cn("flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-normal", {
                  "border-border/65 bg-muted/34 text-muted-foreground": variant === "default",
                  "border-primary/12 bg-background/80 text-muted-foreground": variant === "primary",
                })}
                variant="sm-20"
              >
                {Icon && <Icon className="h-4 w-4" />}
                {text}
              </Typography>
            </div>
          ))}
        </div>
      </div>

      {children ? <div className="w-full md:w-auto">{children}</div> : null}
    </Link>
  );
};

WorkoutPlanItem.displayName = "WorkoutPlanItem";
