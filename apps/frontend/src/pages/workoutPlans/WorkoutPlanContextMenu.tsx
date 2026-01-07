import { EllipsisVertical } from "lucide-react";
import { type WorkoutPlanDetails } from "@gym-tracker-pwa/schemas";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui";
import { ButtonGroup } from "@/components/ui/button-group";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface WorkoutPlanContextMenuProps {
  workoutPlanDetails: WorkoutPlanDetails;
}

const WorkoutPlanContextMenu = ({ workoutPlanDetails }: WorkoutPlanContextMenuProps) => {
  const navigate = useNavigate();

  const handleEditAction = () => {
    navigate(`/home/workout-plan/${workoutPlanDetails.id}/edit`, { state: { ...workoutPlanDetails } });
  };

  return (
    <ButtonGroup className="ml-auto">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            <EllipsisVertical className="!w-6 !h-6" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={handleEditAction}>Edit workout plan</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem variant="destructive">Delete workout plan</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
};

export default WorkoutPlanContextMenu;
