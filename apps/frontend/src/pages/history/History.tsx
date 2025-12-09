import { useState } from "react";

import { Calendar } from "@/components/ui/calendar";
import { Typography } from "@/components/base/Typography";
import Fire from "@icons/fire.svg?react";
import PersonRunning from "@icons/person-running.svg?react";
import Timer from "@icons/timer.svg?react";
import Zzz from "@icons/zzz.svg?react";

const History = () => {
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(new Date());

  const dayStatistics = [
    {
      statistic: 0,
      Icon: PersonRunning,
      suffix: "",
    },
    {
      statistic: 0,
      Icon: Timer,
      suffix: "min",
    },
    {
      statistic: 0,
      Icon: Fire,
      suffix: "kcal",
    },
  ];

  return (
    <section className="flex flex-col pb-24">
      <Typography className="w-full text-center font-semibold" variant="h2">
        History
      </Typography>
      <Calendar mode="single" selected={calendarDate} onSelect={setCalendarDate} className="mt-6 w-full rounded-md border" />
      <div className="w-full border rounded-md mt-4 p-3 bg-card">
        <div className="flex w-full items-center justify-between">
          <Typography className="font-semibold" variant="md-20">
            {calendarDate?.toLocaleDateString("en-US", { month: "short", day: "2-digit", weekday: "short" })}
          </Typography>
          <div className="flex items-center gap-1">
            {dayStatistics.map(({ Icon, statistic, suffix }) => (
              <>
                <Icon className="w-6 h-6 text-chart-2 stroke-2" />
                <Typography variant="sm-20">
                  {statistic} {suffix}
                </Typography>
              </>
            ))}
          </div>
        </div>
        <hr className="my-4 w-full border-border dark:border-accent" />
        <Typography className="font-semibold text-center" variant="lg">
          Empty
        </Typography>
        <Typography className="text-center mt-2 text-muted-foreground" variant="md-20">
          You did not exercise on this date
        </Typography>
        <Zzz className="!w-12 !h-12  mt-4 text-primary mx-auto" />
      </div>
    </section>
  );
};

export default History;
