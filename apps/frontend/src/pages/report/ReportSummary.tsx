import { Typography } from "@/components/base/Typography";
import Fire from "@icons/fire.svg?react";
import PersonRunning from "@icons/person-running.svg?react";
import Timer from "@icons/timer.svg?react";

interface ReportSummaryProps {
  totalCalories: number;
  totalDuration: number;
  totalWorkouts: number;
}

const ReportSummary = ({ totalCalories, totalDuration, totalWorkouts }: ReportSummaryProps) => {
  const reportSummaryColumns = [
    {
      Icon: PersonRunning,
      amount: totalWorkouts,
      label: "workouts",
    },
    {
      Icon: Timer,
      amount: Math.round(totalDuration / 60),
      label: "minutes",
    },
    {
      Icon: Fire,
      amount: totalCalories,
      label: "kcal",
    },
  ];

  return (
    <section className="grid grid-cols-3 gap-2 p-3 border border-border rounded-2xl bg-gradient-to-b from-card to-muted/25 shadow-wide-xs xl:p-4">
      {reportSummaryColumns.map(({ amount, Icon, label }) => (
        <div className="flex flex-col flex-1 items-center gap-1 rounded-xl bg-background/65 border border-border/70 p-2" key={label}>
          <Icon className="w-8 h-8 text-muted-foreground stroke-2" />
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
