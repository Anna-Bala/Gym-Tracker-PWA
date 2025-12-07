import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { FullOnboarding } from "@gym-tracker-pwa/schemas";

import { AgeDrawer, GenderDrawer, HeightDrawer, WeightDrawer } from "./drawers";
import { authFetch } from "@/lib/fetchClient";
import { Button } from "@/components/ui";
import { Loader } from "@/components/Loader";
import { Typography } from "@/components/base/Typography";
import Chevron from "@icons/chevron.svg?react";

const bodyMetricMissingText = "missing information";

const BodyMetricsSettings = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [openDrawer, setOpenDrawer] = useState<"gender" | "age" | "height" | "weight">();
  const [userOnboardingData, setUserOnboardingData] = useState<FullOnboarding>();

  useEffect(() => {
    const fetchUserOnboardingData = async () => {
      await authFetch("/onboarding", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })
        .then(async (response) => {
          const responseData = await response.json();
          setUserOnboardingData(responseData);
        })
        .finally(() => setIsLoading(false));
    };

    fetchUserOnboardingData();
  }, []);

  const bodyMetricsSettingsOptions = useMemo(
    () => [
      {
        label: "Gender",
        currentValue: !userOnboardingData?.gender ? bodyMetricMissingText : userOnboardingData.gender === "F" ? "Female" : "Male",
        onClick: () => setOpenDrawer("gender"),
      },
      {
        label: "Age",
        currentValue: !userOnboardingData?.age ? bodyMetricMissingText : `${userOnboardingData.age} years`,
        onClick: () => setOpenDrawer("age"),
      },
      {
        label: "Height",
        currentValue: !userOnboardingData?.height ? bodyMetricMissingText : `${userOnboardingData.height} cm`,
        onClick: () => setOpenDrawer("height"),
      },
      {
        label: "Weight",
        currentValue: !userOnboardingData?.weight ? bodyMetricMissingText : `${userOnboardingData.weight} kg`,
        onClick: () => setOpenDrawer("weight"),
      },
    ],
    [userOnboardingData]
  );

  const closeDrawers = () => setOpenDrawer(undefined);
  const handleOnboardingSettingsSave = async (key: string, value: string | number) => {
    await authFetch("/onboarding", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ [key]: value }),
    }).then(async (response) => {
      toast.success("Your changes have been saved successfully.");

      const responseData = await response.json();
      setUserOnboardingData(responseData);
      closeDrawers();
    });
  };

  return (
    <>
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
      {!isLoading && (
        <>
          <GenderDrawer onClose={closeDrawers} onSave={handleOnboardingSettingsSave} defaultValue={userOnboardingData!.gender} isOpen={openDrawer === "gender"} />
          <AgeDrawer onClose={closeDrawers} onSave={handleOnboardingSettingsSave} defaultValue={userOnboardingData!.age} isOpen={openDrawer === "age"} />
          <HeightDrawer onClose={closeDrawers} onSave={handleOnboardingSettingsSave} defaultValue={userOnboardingData!.height} isOpen={openDrawer === "height"} />
          <WeightDrawer onClose={closeDrawers} onSave={handleOnboardingSettingsSave} defaultValue={userOnboardingData!.weight} isOpen={openDrawer === "weight"} />
        </>
      )}
    </>
  );
};

export default BodyMetricsSettings;
