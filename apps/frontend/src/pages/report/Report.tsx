import { useEffect, useState } from "react";
import type { UserStatistics } from "@gym-tracker-pwa/schemas";

import { authFetch } from "@/lib/fetchClient";
import { Loader } from "@/components/Loader";
import { Typography } from "@/components/base/Typography";
import ReportBmi from "./ReportBmi";
import ReportSummary from "./ReportSummary";

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
    <section className="flex flex-col">
      <Typography className="w-full text-center font-semibold mb-6" variant="h2">
        Report
      </Typography>
      {isLoading ? (
        <Loader className="m-auto" color="primary" variant="inline" size="lg" isLoading={isLoading} />
      ) : (
        <div className="flex flex-col gap-6">
          <ReportSummary />
          <ReportBmi height={userStatisticsReport!.height} weight={userStatisticsReport!.weight} />
        </div>
      )}
    </section>
  );
};

export default Report;
