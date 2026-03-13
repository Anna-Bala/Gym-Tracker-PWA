import type { Exercise } from "@gym-tracker-pwa/schemas";

import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Drawer } from "@/components/Drawer";
import { Typography } from "@/components/base/Typography";
import Badge from "@/components/ui/badge";

interface ExercisesDetailsProps {
  exerciseDetails: Exercise;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  footerContent?: React.ComponentType<any>;
  isExercisePanelOpen: boolean;
  setIsExercisePanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleExercisePanelOpen: () => void;
}

const ExercisesDetails = ({ exerciseDetails, footerContent: Footer, isExercisePanelOpen, setIsExercisePanelOpen, toggleExercisePanelOpen }: ExercisesDetailsProps) => {
  const closeExerciseDetailsPanel = () => setIsExercisePanelOpen(false);

  const exerciseDetailsRows = [
    {
      label: "Primary muscles",
      items: exerciseDetails.primaryMuscles,
      isVisible: true,
      badgeVariant: "default" as const,
    },
    {
      label: "Secondary muscles",
      items: exerciseDetails.secondaryMuscles,
      isVisible: !!exerciseDetails.secondaryMuscles?.length,
      badgeVariant: "secondary" as const,
    },
    {
      label: "Equipment Type",
      items: exerciseDetails.categories,
      isVisible: !!exerciseDetails.categories?.length,
      badgeVariant: "outline" as const,
    },
    {
      label: "Movement Type",
      items: exerciseDetails.types,
      isVisible: !!exerciseDetails.types?.length,
      badgeVariant: "outline" as const,
    },
  ];

  return (
    <Drawer
      isOpen={isExercisePanelOpen}
      onAnimationEnd={closeExerciseDetailsPanel}
      footerContent={Footer && <Footer closeExerciseDetailsPanel={closeExerciseDetailsPanel} exerciseDetails={exerciseDetails} />}
    >
      <div className="flex flex-row justify-between w-full">
        <Typography className="font-semibold" variant="h3">
          {exerciseDetails.name}
        </Typography>
        <Button className="pr-0 text-muted-foreground lg:pr-4" variant="ghost" onClick={toggleExercisePanelOpen}>
          Close
        </Button>
      </div>
      <div className="flex flex-col mt-6 overflow-scroll scrollbar-none">
        {exerciseDetailsRows.map(
          ({ badgeVariant, isVisible, items, label }, index) =>
            isVisible && (
              <div className={cn("flex flex-wrap gap-2", { "mt-4": index > 0 })} key={label}>
                <Typography className="text-foreground font-semibold" variant="md-20">
                  {label}:
                </Typography>
                {items?.map(({ name }) => (
                  <Badge variant={badgeVariant} key={name}>
                    {name}
                  </Badge>
                ))}
              </div>
            )
        )}
        <div className="surface-muted mt-6 overflow-hidden px-4 py-5">
          <img alt={exerciseDetails?.name} src={exerciseDetails?.image} className="invert-80 m-auto h-auto w-3/5 max-w-52 dark:invert-0" />
        </div>
        {exerciseDetails?.description && (
          <Typography className="text-muted-foreground my-4" variant="sm-20">
            {exerciseDetails.description}
          </Typography>
        )}
      </div>
    </Drawer>
  );
};

export default ExercisesDetails;
