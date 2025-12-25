import { Link } from "react-router-dom";
import { WorkoutPlan } from "@gym-tracker-pwa/schemas";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Typography } from "@/components/base/Typography";
import { WorkoutPlanItem } from "@/components/WorkoutPlanItem";
import Paper from "@icons/paper.svg?react";
import Plus from "@icons/plus.svg?react";

interface AllUserWorkoutPlansProps {
  userWorkoutPlans: WorkoutPlan[];
}

const AllUserWorkoutPlans = ({ userWorkoutPlans }: AllUserWorkoutPlansProps) => {
  const emptyUserWorkoutPlans = userWorkoutPlans.length === 0;

  return (
    <>
      <div className="w-full flex justify-between items-center mt-8">
        <Typography className="w-full font-semibold" variant="h4">
          All Your Workout Plans
        </Typography>
        <Link className={cn("bg-primary rounded-3xl p-2", { hidden: emptyUserWorkoutPlans })} to="/home/create-workout-plan">
          <Plus className="text-white w-5 h-5" />
        </Link>
      </div>
      {emptyUserWorkoutPlans ? (
        <>
          <Paper className="!w-24 !h-24 mt-4 text-primary mx-auto" />
          <Typography className="w-full text-center font-normal text-muted-foreground mt-2" variant="md-20">
            You haven't created any workout plans yet
          </Typography>
          <Typography className="w-full text-center font-normal text-muted-foreground mt-1" variant="sm-20">
            Create your own workout plans for routines you already love or want full control over.
          </Typography>
          <Button className="mt-3" variant="default" asChild>
            <Link to="/home/create-workout-plan">Create your workout plan</Link>
          </Button>
        </>
      ) : (
        <div className="flex flex-col w-full gap-2 mt-3">
          {userWorkoutPlans.map((userWorkoutPlan) => (
            <WorkoutPlanItem workoutPlan={userWorkoutPlan} key={userWorkoutPlan.id} />
          ))}
        </div>
      )}
    </>
  );
};

export default AllUserWorkoutPlans;
