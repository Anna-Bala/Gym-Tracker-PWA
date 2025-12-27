import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Typography } from "@/components/base/Typography";
import Chevron from "@icons/chevron.svg?react";
import Fire from "@icons/fire.svg?react";
import Timer from "@icons/timer.svg?react";

interface WorkoutPlanItemProps {
  children?: ReactNode;
  className?: string;
  variant?: "default" | "primary";
  workoutPlan: { id: number; calories: number; name: string; duration: number; focusArea: string[] };
}

export const WorkoutPlanItem = ({ children, className, variant = "default", workoutPlan }: WorkoutPlanItemProps) => {
  const workoutPlanRowInfo = [
    { Icon: Timer, text: `${Math.round(workoutPlan.duration / 60)} mins` },
    { Icon: Fire, text: `${workoutPlan.calories} kcal` },
    { Icon: null, text: `${workoutPlan.focusArea.join(" / ")}` },
  ];

  return (
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
        <div className="flex gap-1 items-center mt-1">
          {workoutPlanRowInfo.map(({ Icon, text }, index) => (
            <>
              <Typography
                className={cn("flex items-center gap-1 font-light", {
                  "text-card-foreground": variant === "default",
                  "text-primary-foreground": variant === "primary",
                })}
                variant="sm-20"
              >
                {Icon && <Icon className="w-6 h-6" />}
                {text}
              </Typography>
              {index < workoutPlanRowInfo.length - 1 && (
                <Typography className={cn("font-thin text-[3px]", { "text-card-foreground": variant === "default", "text-primary-foreground": variant === "primary" })} variant="sm-20">
                  &#9679;
                </Typography>
              )}
            </>
          ))}
        </div>
      </div>

      <Chevron className={cn("!w-6 !h-6 rotate-180 stroke-[3]", { "text-card-foreground": variant === "default", "text-primary-foreground": variant === "primary" })} />

      {children}
    </Link>
  );
};

WorkoutPlanItem.displayName = "WorkoutPlanItem";
