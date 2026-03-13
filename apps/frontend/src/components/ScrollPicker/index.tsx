"use client";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { WheelPicker, WheelPickerWrapper, type WheelPickerOption } from "../ui/wheel-picker";

interface ScrollPicker {
  className?: string;
  infinite?: boolean;
  initialValue?: string;
  onChange?: (value: number) => void;
  optionItemHeight?: number;
  options: WheelPickerOption[];
  suffix?: "years" | "cm" | "kg" | "days" | "sec";
  visibleCount?: number;
}

export const ScrollPicker: React.FC<ScrollPicker> = ({ className, infinite, initialValue, onChange, options, suffix, visibleCount }) => {
  const [selectedOption, setSelectedOption] = useState(initialValue ?? options[0].value);
  const isLg = window.innerWidth >= 1024;
  const itemHeight = isLg ? 65 : window.innerHeight * 0.09;
  const count = isLg ? 13 : visibleCount;

  return (
    <WheelPickerWrapper className={cn("h-full flex items-center justify-center mx-auto", className)}>
      <WheelPicker
        classNames={{
          optionItem: "!text-4xl",
          highlightItem: cn("!text-4xl", {
            "after:content-['years']": suffix === "years",
            "after:content-['cm']": suffix === "cm",
            "after:content-['kg']": suffix === "kg",
            "after:content-['days']": suffix === "days",
            "after:content-['sec']": suffix === "sec",
          }),
        }}
        infinite={infinite}
        options={options}
        value={selectedOption}
        visibleCount={count}
        optionItemHeight={itemHeight}
        onValueChange={(newValue) => {
          setSelectedOption(newValue);
          onChange?.(Number(newValue));
        }}
      />
    </WheelPickerWrapper>
  );
};

ScrollPicker.displayName = "ScrollPicker";
