import "@ncdai/react-wheel-picker/style.css";

import * as WheelPickerPrimitive from "@ncdai/react-wheel-picker";

import { cn } from "@/lib/utils";

type WheelPickerOption = WheelPickerPrimitive.WheelPickerOption;
type WheelPickerClassNames = WheelPickerPrimitive.WheelPickerClassNames;

function WheelPickerWrapper({ className, ...props }: React.ComponentProps<typeof WheelPickerPrimitive.WheelPickerWrapper>) {
  return <WheelPickerPrimitive.WheelPickerWrapper className={cn("w-56 px-1", className)} {...props} />;
}

function WheelPicker({ classNames, ...props }: React.ComponentProps<typeof WheelPickerPrimitive.WheelPicker>) {
  return (
    <WheelPickerPrimitive.WheelPicker
      classNames={{
        optionItem: cn("typography-xs text-muted-foreground", classNames?.optionItem),
        highlightWrapper: cn("text-primary border-t border-b border-primary bg-background", classNames?.highlightWrapper),
        highlightItem: cn(
          "bg-background typography-xs relative after:absolute after:right-[25px] after:bottom-[20px] after:text-foreground after:text-xl after:font-normal",
          classNames?.highlightItem
        ),
      }}
      {...props}
    />
  );
}

export { WheelPicker, WheelPickerWrapper };
export type { WheelPickerClassNames, WheelPickerOption };
