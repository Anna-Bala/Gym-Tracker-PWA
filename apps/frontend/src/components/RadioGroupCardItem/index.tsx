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
    className={cn("flex flex-row gap-4 bg-card items-center w-full ring-[1px] ring-border rounded py-4 px-4 data-[state=checked]:ring-2 data-[state=checked]:ring-primary", className)}
  >
    <>
      {Icon && <Icon className="w-12 h-12" />}
      <div className="flex flex-col gap-1">
        <Typography className="font-bold w-full text-left" variant="md-24">
          {label}
        </Typography>
        {description && (
          <Typography className="font-light text-left" variant="sm-20">
            {description}
          </Typography>
        )}
      </div>
    </>
  </RadioGroupItem>
);

RadioGroupCardItem.displayName = "RadioGroupCardItem";
