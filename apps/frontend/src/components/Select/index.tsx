import type { ReactNode } from "react";
import { Select as SelectBase, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Select {
  className?: string;
  handleValueChange(value: string): void;
  options: { label: string; value: string }[];
  placeholder?: ReactNode;
  value: string;
}

export const Select: React.FC<Select> = ({ className, handleValueChange, options, placeholder, value }) => (
  <SelectBase value={value} onValueChange={handleValueChange}>
    <SelectTrigger className={className}>
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
    <SelectContent>
      {options.map(({ label, value }) => (
        <SelectItem value={value} key={value}>
          {label}
        </SelectItem>
      ))}
    </SelectContent>
  </SelectBase>
);

Select.displayName = "Select";
