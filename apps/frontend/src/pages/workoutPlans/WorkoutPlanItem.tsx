import { Link } from "react-router-dom";
import { WorkoutPlan } from "@gym-tracker-pwa/schemas";

import { Typography } from "@/components/base/Typography";
import Chevron from "@icons/chevron.svg?react";

interface WorkoutPlanItemProps {
  workoutPlan: WorkoutPlan;
}

const WorkoutPlanItem = ({ workoutPlan }: WorkoutPlanItemProps) => (
  <Link className="flex items-center bg-card border border-border p-3 rounded-md" to={`/home/workout-plan/${workoutPlan.id}`}>
    <div className="flex flex-col w-full">
      <Typography className="font-normal text-left text-card-foreground" variant="lg">
        {workoutPlan.name}
      </Typography>
      <div className="flex gap-2 items-center mt-1">
        <Typography className="font-light text-card-foreground" variant="sm-20">
          {workoutPlan.duration / 60} mins
        </Typography>
        <Typography className="font-thin text-[3px] text-card-foreground" variant="sm-20">
          &#9679;
        </Typography>
        <Typography className="font-light text-card-foreground" variant="sm-20">
          {workoutPlan.focusArea.join(" / ")}
        </Typography>
      </div>
    </div>

    <Chevron className="!w-6 !h-6 rotate-180 mr-2" />
  </Link>
);

export default WorkoutPlanItem;
