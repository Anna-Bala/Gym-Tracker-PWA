import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import { Badge } from "../ui";
import { cn } from "@/lib/utils";
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
    { Icon: null, text: `${workoutPlan.focusArea.join(" / ")}` },
  ];

  return (
    <Link
      className={cn(
        "flex items-center p-3 rounded-md",
        {
          "gap-4 bg-card border border-border": variant === "default",
          "flex-wrap bg-card border-2 border-primary": variant === "primary",
        },
        className
      )}
      to={`/home/workout-plan/${workoutPlan.id}`}
    >
      <div className="flex flex-grow flex-col">
        <Typography
          className={cn("flex items-center font-normal text-left", {
            "text-card-foreground": variant === "default",
            "text-primary-foreground": variant === "primary",
          })}
          variant="lg"
        >
          {workoutPlan.ai && (
            <Badge className="mr-4" variant="secondary">
              AI
            </Badge>
          )}
          {workoutPlan.name}
        </Typography>
        <div className="flex flex-wrap gap-1 items-center mt-1">
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

      {children}
    </Link>
  );
};

WorkoutPlanItem.displayName = "WorkoutPlanItem";
