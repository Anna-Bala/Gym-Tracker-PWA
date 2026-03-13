import { RadioGroupItem } from "@radix-ui/react-radio-group";

import { cn } from "@/lib/utils";
import { Typography } from "@/components/base/Typography";

interface RadioGroupCardItem {
  className?: string;
  description?: string;
  Icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  label: string;
  value: string;
}

export const RadioGroupCardItem: React.FC<RadioGroupCardItem> = ({ className, description, Icon, label, value }) => (
  <RadioGroupItem
    value={value}
    id={value}
    className={cn(
      "surface-card flex w-full flex-row items-center gap-4 p-4 transition-all data-[state=checked]:border-primary/35 data-[state=checked]:bg-primary/[0.04] hover:border-primary/50 hover:bg-primary/[0.05] hover:cursor-pointer",
      className
    )}
  >
    <>
      {Icon && <Icon className="h-11 w-11 text-primary" />}
      <div className="flex flex-col gap-1">
        <Typography className="w-full text-left font-bold text-foreground" variant="md-24">
          {label}
        </Typography>
        {description && (
          <Typography className="text-left font-normal text-muted-foreground" variant="sm-20">
            {description}
          </Typography>
        )}
      </div>
    </>
  </RadioGroupItem>
);

RadioGroupCardItem.displayName = "RadioGroupCardItem";
