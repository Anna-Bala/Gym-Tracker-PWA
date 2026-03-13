import { Link } from "react-router-dom";
import { WorkoutPlan } from "@gym-tracker-pwa/schemas";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/base/EmptyState";
import { SectionCard } from "@/components/base/SectionCard";
import { SectionHeader } from "@/components/base/SectionHeader";
import { WorkoutPlanItem } from "@/components/WorkoutPlanItem";
import Paper from "@icons/paper.svg?react";
import Plus from "@icons/plus.svg?react";

interface AllUserWorkoutPlansProps {
  userWorkoutPlans: WorkoutPlan[];
  handleAIWorkoutPlanCreation: () => void;
}

const AllUserWorkoutPlans = ({ userWorkoutPlans, handleAIWorkoutPlanCreation }: AllUserWorkoutPlansProps) => {
  const emptyUserWorkoutPlans = userWorkoutPlans.length === 0;

  return (
    <SectionCard className="mt-8" tone="muted">
      <SectionHeader
        title="All Your Workout Plans"
        action={
          !emptyUserWorkoutPlans ? (
            <Button asChild size="sm">
              <Link to="/home/create-workout-plan">
                <Plus className="h-4 w-4" />
                New plan
              </Link>
            </Button>
          ) : null
        }
      />
      {emptyUserWorkoutPlans ? (
        <EmptyState
          className="mt-5"
          icon={<Paper />}
          title="No workout plans yet"
          description="Create your own workout plans for routines you already love or generate one with AI."
          action={
            <>
              <Button variant="default" asChild>
                <Link to="/home/create-workout-plan">Create your workout plan</Link>
              </Button>
              <Button variant="secondary" onClick={handleAIWorkoutPlanCreation}>
                Generate workout plan with AI
              </Button>
            </>
          }
        />
      ) : (
        <div className="flex w-full flex-col gap-3 mt-5">
          {userWorkoutPlans.map((userWorkoutPlan) => (
            <WorkoutPlanItem workoutPlan={userWorkoutPlan} key={userWorkoutPlan.id} />
          ))}
        </div>
      )}
    </SectionCard>
  );
};

export default AllUserWorkoutPlans;
