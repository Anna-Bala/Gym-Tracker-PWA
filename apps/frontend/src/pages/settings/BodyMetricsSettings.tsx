import { Button } from "@/components/ui";
import { Typography } from "@/components/base/Typography";
import Chevron from "@icons/chevron.svg?react";

const BodyMetricsSettings = () => {
  const bodyMetricsSettingsOptions = [
    {
      label: "Gender",
      currentValue: "Female",
      onClick: () => {},
    },
    {
      label: "Age",
      currentValue: "24 years",
      onClick: () => {},
    },
    {
      label: "Height",
      currentValue: "169 cm",
      onClick: () => {},
    },
    {
      label: "Weight",
      currentValue: "90 kg",
      onClick: () => {},
    },
  ];

  return (
    <section>
      <Typography className="w-full text-center font-semibold" variant="h2">
        Body Metrics
      </Typography>

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
    </section>
  );
};

export default BodyMetricsSettings;
