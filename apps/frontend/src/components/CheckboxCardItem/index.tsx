import { Checkbox } from "@radix-ui/react-checkbox";

import { cn } from "@/lib/utils";
import { Typography } from "@/components/base/Typography";

interface CheckboxCardItem {
  className?: string;
  checked?: boolean;
  description?: string;
  Icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  label: string;
  onCheckedChange?: (checked: boolean) => void;
  value: string;
}

export const CheckboxCardItem: React.FC<CheckboxCardItem> = ({ className, checked, description, Icon, label, onCheckedChange, value }) => (
  <Checkbox
    id={value}
    onCheckedChange={onCheckedChange}
    checked={checked}
    value={value}
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
  </Checkbox>
);

CheckboxCardItem.displayName = "CheckboxCardItem";
