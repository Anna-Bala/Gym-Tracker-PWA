import { useEffect, useState } from "react";

import { Progress } from "@/components/ui/progress";
import { SectionCard } from "@/components/base/SectionCard";
import { SectionHeader } from "@/components/base/SectionHeader";
import { Typography } from "@/components/base/Typography";

const progressPercentageInfo = {
  10: "Waking up the digital trainer",
  30: "Sorting through 500+ exercises",
  50: "Doing the heavy lifting for you",
  70: "Double-checking the math (the AI doesn't skip leg day)",
  90: "Grabbing the weights. Just a second!",
};

interface GeneratingAiWorkoutPlanProps {
  isGeneratingAIWorkoutPlan: boolean;
}

const GeneratingAiWorkoutPlan = ({ isGeneratingAIWorkoutPlan }: GeneratingAiWorkoutPlanProps) => {
  const [progress, setProgress] = useState(10);

  useEffect(() => {
    const interval = setInterval(
      () =>
        setProgress((prevState) => {
          if (prevState >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prevState + 20;
        }),
      12000
    );
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isGeneratingAIWorkoutPlan) setProgress(100);
  }, [isGeneratingAIWorkoutPlan]);

  return (
    <SectionCard className="mt-8" tone="accent">
      <SectionHeader title="AI is currently generating your workout plan..." />
      <Progress className="mt-5" value={progress} />

      <Typography className="w-full text-center font-normal text-muted-foreground mt-4" variant="md-20">
        {progressPercentageInfo[progress as keyof typeof progressPercentageInfo]}
      </Typography>
    </SectionCard>
  );
};

export default GeneratingAiWorkoutPlan;
