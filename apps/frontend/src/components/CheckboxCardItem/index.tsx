import { Checkbox } from "@radix-ui/react-checkbox";

import { cn } from "@/lib/utils";
import { Typography } from "@/components/base/Typography";

interface CheckboxCardItem {
  className?: string;
  checked?: boolean;
  description?: string;
  Icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  label?: string;
  onCheckedChange?: (checked: boolean) => void;
  value: string;
}

export const CheckboxCardItem: React.FC<CheckboxCardItem> = ({ className, checked, description, Icon, label, onCheckedChange, value }) => (
  <Checkbox
    id={value}
    onCheckedChange={onCheckedChange}
    checked={checked}
    value={value}
    className={cn(
      "surface-card flex w-full flex-row items-center gap-4 p-4 transition-all data-[state=checked]:border-primary/35 data-[state=checked]:bg-primary/[0.04] hover:border-primary/50 hover:bg-primary/[0.05] hover:cursor-pointer",
      className
    )}
  >
    <>
      {Icon && <Icon className="h-11 w-11 text-primary" />}
      <div className="flex flex-col gap-1">
        {label && (
          <Typography className="w-full text-left font-bold text-foreground" variant="md-24">
            {label}
          </Typography>
        )}
        {description && (
          <Typography className="text-left font-normal text-muted-foreground" variant="sm-20">
            {description}
          </Typography>
        )}
      </div>
    </>
  </Checkbox>
);

CheckboxCardItem.displayName = "CheckboxCardItem";
