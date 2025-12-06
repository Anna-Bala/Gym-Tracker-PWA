import { useState } from "react";
import { RadioGroup } from "@radix-ui/react-radio-group";

import { GenderSelector } from "@/components/GenderSelector";
import BodyMetricsDrawerWrapper from "./BodyMetricsDrawerWrapper";

type GenderOptions = "M" | "F";

interface GenderDrawerProps {
  defaultValue: GenderOptions;
  isOpen: boolean;
  onClose: () => void;
  onSave: (key: string, value: GenderOptions) => void;
}

const GenderDrawer = ({ defaultValue, isOpen, onClose, onSave }: GenderDrawerProps) => {
  const [value, setValue] = useState(defaultValue);

  const handleSaveAction = () => onSave("gender", value);
  const handleCloseAction = () => {
    setValue(defaultValue);
    onClose();
  };

  return (
    <BodyMetricsDrawerWrapper isOpen={isOpen} isSaveActionDisabled={value === defaultValue} onClose={handleCloseAction} onSave={handleSaveAction} title="Gender">
      <RadioGroup className="flex flex-row gap-4 mt-6" onValueChange={(value) => setValue(value as GenderOptions)} value={value}>
        <GenderSelector />
      </RadioGroup>
    </BodyMetricsDrawerWrapper>
  );
};

export default GenderDrawer;
