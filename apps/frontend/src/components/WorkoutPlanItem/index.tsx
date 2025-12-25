import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Typography } from "@/components/base/Typography";
import Chevron from "@icons/chevron.svg?react";
import Timer from "@icons/timer.svg?react";

interface WorkoutPlanItemProps {
  children?: ReactNode;
  className?: string;
  variant?: "default" | "primary";
  workoutPlan: { id: number; name: string; duration: number; focusArea: string[] };
}

export const WorkoutPlanItem = ({ children, className, variant = "default", workoutPlan }: WorkoutPlanItemProps) => (
  <Link
    className={cn(
      "flex flex-wrap items-center p-3 rounded-md",
      {
        "bg-card border border-border": variant === "default",
        "bg-card border-2 border-primary": variant === "primary",
      },
      className
    )}
    to={`/home/workout-plan/${workoutPlan.id}`}
  >
    <div className="flex flex-grow flex-col">
      <Typography
        className={cn("font-normal text-left", {
          "text-card-foreground": variant === "default",
          "text-primary-foreground": variant === "primary",
        })}
        variant="lg"
      >
        {workoutPlan.name}
      </Typography>
      <div className="flex gap-2 items-center mt-1">
        <Typography
          className={cn("flex items-center gap-1 font-light", {
            "text-card-foreground": variant === "default",
            "text-primary-foreground": variant === "primary",
          })}
          variant="sm-20"
        >
          <Timer className="w-6 h-6" />
          {workoutPlan.duration / 60} mins
        </Typography>
        <Typography className={cn("font-thin text-[3px]", { "text-card-foreground": variant === "default", "text-primary-foreground": variant === "primary" })} variant="sm-20">
          &#9679;
        </Typography>
        <Typography
          className={cn("font-light", {
            "text-card-foreground": variant === "default",
            "text-primary-foreground": variant === "primary",
          })}
          variant="sm-20"
        >
          {workoutPlan.focusArea.join(" / ")}
        </Typography>
      </div>
    </div>

    <Chevron className={cn("!w-6 !h-6 rotate-180 mr-2", { "text-card-foreground": variant === "default", "text-primary-foreground": variant === "primary" })} />

    {children}
  </Link>
);

WorkoutPlanItem.displayName = "WorkoutPlanItem";
