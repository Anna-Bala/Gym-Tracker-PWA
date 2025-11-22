import { useEffect, useState } from "react";
import type { UserStatistics } from "@gym-tracker-pwa/schemas";

import { API_ENDPOINT_PREFIX } from "@/secrets";
import { Loader } from "@/components/Loader";
import { Typography } from "@/components/base/Typography";
import { useAuth } from "@/contexts/auth/useAuth";
import ReportBmi from "./ReportBmi";
import ReportSummary from "./ReportSummary";

const Report = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userStatisticsReport, setUserStatisticsReport] = useState<UserStatistics>();

  const { accessToken } = useAuth();

  useEffect(() => {
    if (!accessToken) return;

    const fetchUserStatisticsReport = async () => {
      await fetch(`${API_ENDPOINT_PREFIX}/user/statistic`, {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
        credentials: "include",
      })
        .then(async (response) => {
          const responseData = await response.json();
          setUserStatisticsReport(responseData);
        })
        .finally(() => setIsLoading(false));
    };

    fetchUserStatisticsReport();
  }, [accessToken]);

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
