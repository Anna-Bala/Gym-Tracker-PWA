import { useEffect, useMemo, useState } from "react";
import type { FullOnboarding } from "@gym-tracker-pwa/schemas";

import { API_ENDPOINT_PREFIX } from "@/secrets";
import { Button } from "@/components/ui";
import { Loader } from "@/components/Loader";
import { Typography } from "@/components/base/Typography";
import { useAuth } from "@/contexts/auth/useAuth";
import Chevron from "@icons/chevron.svg?react";

const bodyMetricMissingText = "missing information";

const BodyMetricsSettings = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userOnboardingData, setUserOnboardingData] = useState<FullOnboarding>();

  const { accessToken } = useAuth();

  useEffect(() => {
    if (!accessToken) return;

    const fetchUserOnboardingData = async () => {
      await fetch(`${API_ENDPOINT_PREFIX}/onboarding`, {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
        credentials: "include",
      })
        .then(async (response) => {
          const responseData = await response.json();
          setUserOnboardingData(responseData);
        })
        .finally(() => setIsLoading(false));
    };

    fetchUserOnboardingData();
  }, [accessToken]);

  const bodyMetricsSettingsOptions = useMemo(
    () => [
      {
        label: "Gender",
        currentValue: !userOnboardingData?.gender ? bodyMetricMissingText : userOnboardingData.gender === "F" ? "Female" : "Male",
        onClick: () => {},
      },
      {
        label: "Age",
        currentValue: !userOnboardingData?.age ? bodyMetricMissingText : `${userOnboardingData.age} years`,
        onClick: () => {},
      },
      {
        label: "Height",
        currentValue: !userOnboardingData?.height ? bodyMetricMissingText : `${userOnboardingData.height} cm`,
        onClick: () => {},
      },
      {
        label: "Weight",
        currentValue: !userOnboardingData?.weight ? bodyMetricMissingText : `${userOnboardingData.weight} kg`,
        onClick: () => {},
      },
    ],
    [userOnboardingData]
  );

  return (
    <section className="flex flex-col h-[90vh]">
      <Typography className="w-full text-center font-semibold" variant="h2">
        Body Metrics
      </Typography>

      {isLoading ? (
        <Loader className="m-auto" color="primary" variant="inline" size="lg" isLoading={isLoading} />
      ) : (
        <div className="flex flex-col w-full mt-6 gap-4 h-[calc(100vh-230px)]">
          {bodyMetricsSettingsOptions.map(({ currentValue, label, onClick }) => {
            return (
              <Button className="w-full text-base flex items-center !px-0 justify-start text-foreground py-2 font-medium" variant="link" size="lg" onClick={onClick} key={label}>
                <>
                  {label}
                  <span className="text-sm ml-auto font-normal">{currentValue}</span>
                  <Chevron className="!w-6 !h-6 rotate-180 mr-2" />
                </>
              </Button>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default BodyMetricsSettings;
