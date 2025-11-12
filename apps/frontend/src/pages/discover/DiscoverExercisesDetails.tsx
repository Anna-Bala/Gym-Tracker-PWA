import type { Exercise } from "@gym-tracker-pwa/schemas";

import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Drawer } from "@/components/Drawer";
import { Typography } from "@/components/base/Typography";
import Badge from "@/components/ui/badge";

interface DiscoverExercisesDetailsProps {
  exerciseDetails: Exercise;
  isExercisePanelOpen: boolean;
  setIsExercisePanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleExercisePanelOpen: () => void;
}

const DiscoverExercisesDetails = ({ exerciseDetails, isExercisePanelOpen, setIsExercisePanelOpen, toggleExercisePanelOpen }: DiscoverExercisesDetailsProps) => {
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
    <Drawer isOpen={isExercisePanelOpen} setIsOpen={setIsExercisePanelOpen}>
      <div className="flex flex-row justify-between w-full">
        <Typography className="font-semibold" variant="h3">
          {exerciseDetails.name}
        </Typography>
        <Button className="pr-0 text-muted-foreground" variant="ghost" onClick={toggleExercisePanelOpen}>
          Close
        </Button>
      </div>
      <div className="flex flex-col mt-6 overflow-auto scrollbar-none">
        {exerciseDetailsRows.map(
          ({ badgeVariant, isVisible, items, label }, index) =>
            isVisible && (
              <div className={cn("flex flex-wrap gap-2", { "mt-3": index > 0 })}>
                <Typography className="font-medium" variant="md-20">
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
        <img alt={exerciseDetails?.name} src={exerciseDetails?.image} className="w-3/5 mt-6 mb-2 h-auto m-auto" />
        <Typography variant="sm-20">{exerciseDetails?.description}</Typography>
      </div>
    </Drawer>
  );
};

export default DiscoverExercisesDetails;
