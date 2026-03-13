import { cn } from "@/lib/utils";
import { Typography } from "@/components/base/Typography";

interface TimeFieldButtonProps {
  isActive: boolean;
  label: string;
  onClick: () => void;
  value: string;
}

export const TimeFieldButton = ({ isActive, label, onClick, value }: TimeFieldButtonProps) => (
  <button
    type="button"
    className={cn(
      "flex min-w-0 flex-col rounded-lg border px-4 py-3 text-left transition-colors",
      isActive ? "border-primary/35 bg-primary/5" : "border-border bg-card hover:bg-accent/35 hover:cursor-pointer"
    )}
    onClick={onClick}
  >
    <Typography className="text-muted-foreground" variant="xxs">
      {label}
    </Typography>
    <Typography className="truncate font-semibold" variant="sm-20">
      {value}
    </Typography>
  </button>
);

TimeFieldButton.displayName = "TimeFieldButton";
