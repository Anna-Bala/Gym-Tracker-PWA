import { Typography } from "@/components/base/Typography";
import Fire from "@icons/fire.svg?react";
import PersonRunning from "@icons/person-running.svg?react";
import Timer from "@icons/timer.svg?react";

const ReportSummary = () => {
  const reportSummaryColumns = [
    {
      Icon: PersonRunning,
      amount: 0,
      label: "workouts",
    },
    {
      Icon: Timer,
      amount: 0,
      label: "minutes",
    },
    {
      Icon: Fire,
      amount: 0,
      label: "kcal",
    },
  ];

  return (
    <section className="flex justify-between py-2 px-3 border border-border rounded-md">
      {reportSummaryColumns.map(({ amount, Icon, label }) => (
        <div className="flex flex-col flex-1 items-center gap-1" key={label}>
          <Icon className="w-8 h-8 text-chart-2 stroke-2" />
          <Typography className="font-semibold" variant="sm-16">
            {amount}
          </Typography>
          <Typography className="text-muted-foreground" variant="sm-16">
            {label}
          </Typography>
        </div>
      ))}
    </section>
  );
};

export default ReportSummary;
