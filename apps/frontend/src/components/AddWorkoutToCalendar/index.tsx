"use client";
import { useState } from "react";
import { atcb_action, type AddToCalendarActionType } from "add-to-calendar-button-react";

import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Drawer } from "@/components/Drawer";
import { generateWorkoutPlanScheduleForCalendar } from "./utils";
import { TimeSelector } from "../TimeSelector";
import { to24HourTime, toMinutes } from "../TimeSelector/utils";
import { Typography } from "@/components/base/Typography";
import CalendarIcon from "@icons/calendar.svg?react";

interface AddToCalendarProps {
  calendarEventName: string;
  calendarEventDescription?: string;
  className?: string;
  workoutDays: string[];
}

export const AddWorkoutToCalendar: React.FC<AddToCalendarProps> = ({ calendarEventName, calendarEventDescription, className, workoutDays }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [startTime, setStartTime] = useState({ hour: "12", minute: "00", period: "AM" as "AM" | "PM" });
  const [endTime, setEndTime] = useState({ hour: "01", minute: "00", period: "PM" as "AM" | "PM" });

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);
  const handleDrawerAnimationEnd = (open: boolean) => {
    if (!open) setIsDrawerOpen(false);
  };

  const isTimeRangeValid = toMinutes(endTime) > toMinutes(startTime);
  const calendarStartTime = to24HourTime(startTime);
  const calendarEndTime = to24HourTime(endTime);
  const dates = generateWorkoutPlanScheduleForCalendar(workoutDays, calendarEventName, calendarStartTime);
  const canSaveToCalendar = isTimeRangeValid && dates.length > 0;

  const eventConfig = dates.length
    ? ({
        name: calendarEventName,
        description: calendarEventDescription,
        options: ["Apple", "Google", "Outlook.com"],
        startTime: calendarStartTime,
        endTime: calendarEndTime,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        dates,
      } satisfies AddToCalendarActionType)
    : null;

  const handleAddToCalendarClick = async () => {
    if (!canSaveToCalendar || !eventConfig) {
      return;
    }

    await atcb_action({
      ...eventConfig,
      listStyle: "modal",
    });
    document.body.style.pointerEvents = "auto";
  };

  return (
    <>
      <Button className={cn("mt-4", className)} onClick={openDrawer} size="lg" variant="secondary">
        <CalendarIcon className="!h-6 !w-6" />
        Add to calendar
      </Button>

      <Drawer
        isOpen={isDrawerOpen}
        onAnimationEnd={handleDrawerAnimationEnd}
        footerContent={
          <Button disabled={!canSaveToCalendar} variant="default" onClick={handleAddToCalendarClick}>
            <CalendarIcon className="!h-6 !w-6" />
            Save to calendar
          </Button>
        }
      >
        <div className="flex w-full flex-row justify-between gap-4">
          <Typography className="font-semibold" variant="h3">
            Pick workout plan time window
          </Typography>

          <Button className="pr-0 text-muted-foreground lg:pr-4" onClick={closeDrawer} variant="ghost">
            Close
          </Button>
        </div>

        <div className="surface-muted mt-4 p-4">
          <TimeSelector startTime={startTime} endTime={endTime} setStartTime={setStartTime} setEndTime={setEndTime} />
        </div>
      </Drawer>
    </>
  );
};

AddWorkoutToCalendar.displayName = "AddWorkoutToCalendar";
