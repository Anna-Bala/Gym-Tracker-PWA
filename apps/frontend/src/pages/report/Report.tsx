import { useEffect, useState } from "react";
import type { UserStatistics } from "@gym-tracker-pwa/schemas";

import { authFetch } from "@/lib/fetchClient";
import { Loader } from "@/components/Loader";
import { ResponsivePageShell } from "@/components/base/ResponsivePageShell";
import ReportBmi from "./ReportBmi";
import ReportSummary from "./ReportSummary";
import ReportWorkouts from "./ReportWorkouts";

const Report = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userStatisticsReport, setUserStatisticsReport] = useState<UserStatistics>();

  useEffect(() => {
    const fetchUserStatisticsReport = async () => {
      await authFetch("/user/statistic", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })
        .then(async (response) => {
          const responseData = await response.json();
          setUserStatisticsReport(responseData);
        })
        .finally(() => setIsLoading(false));
    };

    fetchUserStatisticsReport();
  }, []);

  return (
    <ResponsivePageShell contentClassName="xl:mx-auto xl:max-w-[960px]" hideMobileBackButton title="Report">
      {isLoading ? (
        <Loader className="m-auto" color="primary" variant="inline" size="lg" isLoading={isLoading} />
      ) : (
        <div className="flex flex-col gap-6">
          <ReportSummary totalWorkouts={userStatisticsReport!.totalWorkouts} totalCalories={userStatisticsReport!.totalCalories} totalDuration={userStatisticsReport!.totalDuration} />
          <ReportWorkouts />
          <ReportBmi height={userStatisticsReport!.height} weight={userStatisticsReport!.weight} />
        </div>
      )}
    </ResponsivePageShell>
  );
};

export default Report;
