import { useState } from "react";

import { AgeSelector } from "@/components/AgeSelector";
import BodyMetricsDrawerWrapper from "./BodyMetricsDrawerWrapper";

interface AgeDrawerProps {
  defaultValue: number;
  isOpen: boolean;
  onClose: () => void;
  onSave: (key: string, value: number) => void;
}

const AgeDrawer = ({ defaultValue, isOpen, onClose, onSave }: AgeDrawerProps) => {
  const [value, setValue] = useState(defaultValue);

  const handleSaveAction = () => onSave("age", value);
  const handleCloseAction = () => {
    setValue(defaultValue);
    onClose();
  };

  return (
    <BodyMetricsDrawerWrapper isOpen={isOpen} isSaveActionDisabled={value === defaultValue} onClose={handleCloseAction} onSave={handleSaveAction} title="Age">
      <AgeSelector initialValue={value.toString()} onChange={setValue} visibleCount={18} />
    </BodyMetricsDrawerWrapper>
  );
};

export default AgeDrawer;
