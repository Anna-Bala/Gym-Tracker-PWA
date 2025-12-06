import { useState } from "react";

import { WeightSelector } from "@/components/WeightSelector";
import BodyMetricsDrawerWrapper from "./BodyMetricsDrawerWrapper";

interface WeightDrawerProps {
  defaultValue: number;
  isOpen: boolean;
  onClose: () => void;
  onSave: (key: string, value: number) => void;
}

const WeightDrawer = ({ defaultValue, isOpen, onClose, onSave }: WeightDrawerProps) => {
  const [value, setValue] = useState(defaultValue);

  const handleSaveAction = () => onSave("weight", value);
  const handleCloseAction = () => {
    setValue(defaultValue);
    onClose();
  };

  return (
    <BodyMetricsDrawerWrapper isOpen={isOpen} isSaveActionDisabled={value === defaultValue} onClose={handleCloseAction} onSave={handleSaveAction} title="Weight">
      <WeightSelector initialValue={value.toString()} onChange={setValue} visibleCount={18} />
    </BodyMetricsDrawerWrapper>
  );
};

export default WeightDrawer;
