"use client";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { formatTimeDisplay, toMinutes } from "./utils";
import { TimeFieldButton } from "./TimeFieldButton";
import { Typography } from "@/components/base/Typography";
import { WheelPicker, WheelPickerWrapper, type WheelPickerOption } from "@/components/ui/wheel-picker";

const hoursOptions: WheelPickerOption[] = ["12", ...Array.from({ length: 11 }, (_, index) => String(index + 1).padStart(2, "0"))].map((value) => ({
  label: value,
  value,
}));

const minutesOptions: WheelPickerOption[] = Array.from({ length: 60 }, (_, index) => {
  const value = String(index).padStart(2, "0");

  return { label: value, value };
});

export type TimeValue = {
  hour: string;
  minute: string;
  period: "AM" | "PM";
};

interface TimeSelectorProps {
  startTime: TimeValue;
  endTime: TimeValue;
  setStartTime: React.Dispatch<React.SetStateAction<TimeValue>>;
  setEndTime: React.Dispatch<React.SetStateAction<TimeValue>>;
}

export const TimeSelector = ({ endTime, setEndTime, setStartTime, startTime }: TimeSelectorProps) => {
  const [activeField, setActiveField] = useState<"start" | "end">("start");

  const pickerClassNames = {
    highlightItem: "!text-2xl font-semibold after:hidden",
    highlightWrapper: "border-y border-primary/20 bg-primary/6",
    optionItem: "!text-xl",
  };

  const activeTime = activeField === "start" ? startTime : endTime;
  const isTimeRangeValid = toMinutes(endTime) > toMinutes(startTime);

  const setTime = (nextValue: Partial<TimeValue>) => {
    if (activeField === "start") {
      setStartTime((previousValue) => ({ ...previousValue, ...nextValue }));
      return;
    }

    setEndTime((previousValue) => ({ ...previousValue, ...nextValue }));
  };

  return (
    <div className="flex w-full flex-col gap-4 pt-6 pb-4">
      <div className="grid grid-cols-2 gap-3">
        <TimeFieldButton isActive={activeField === "start"} label="Start time" onClick={() => setActiveField("start")} value={formatTimeDisplay(startTime)} />
        <TimeFieldButton isActive={activeField === "end"} label="End time" onClick={() => setActiveField("end")} value={formatTimeDisplay(endTime)} />
      </div>

      {!isTimeRangeValid ? (
        <Typography className="text-destructive" variant="xs">
          End time must be later than start time.
        </Typography>
      ) : null}
      <div
        className="rounded-3xl border border-border bg-muted/35 p-3"
        onPointerDown={(event) => event.stopPropagation()}
        onPointerMove={(event) => event.stopPropagation()}
        onTouchMove={(event) => event.stopPropagation()}
        onTouchStart={(event) => event.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between gap-3 px-1">
          <Typography className="font-medium capitalize" variant="sm-16">
            Editing {activeField} time
          </Typography>
          <Typography className="font-semibold" variant="sm-16">
            {formatTimeDisplay(activeTime)}
          </Typography>
        </div>

        <div className="grid grid-cols-[1fr_1fr_88px] gap-2">
          <WheelPickerWrapper className="!w-full rounded-2xl bg-background px-0">
            <WheelPicker classNames={pickerClassNames} onValueChange={(hour) => setTime({ hour })} optionItemHeight={44} options={hoursOptions} value={activeTime.hour} visibleCount={20} />
          </WheelPickerWrapper>

          <WheelPickerWrapper className="!w-full rounded-2xl bg-background px-0">
            <WheelPicker classNames={pickerClassNames} onValueChange={(minute) => setTime({ minute })} optionItemHeight={44} options={minutesOptions} value={activeTime.minute} visibleCount={20} />
          </WheelPickerWrapper>

          <div className="grid gap-2">
            {(["AM", "PM"] as const).map((period) => (
              <button
                key={period}
                type="button"
                className={cn(
                  "rounded-2xl border px-3 py-5 typography-sm-20 font-semibold transition-colors",
                  activeTime.period === period ? "border-primary bg-primary text-primary-foreground shadow-compact-sm" : "border-border bg-background hover:bg-accent/40"
                )}
                onClick={() => setTime({ period })}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

TimeSelector.displayName = "TimeSelector";
