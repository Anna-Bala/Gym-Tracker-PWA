import { useState } from "react";

import { HeightSelector } from "@/components/HeightSelector";
import BodyMetricsDrawerWrapper from "./BodyMetricsDrawerWrapper";

interface HeightDrawerProps {
  defaultValue: number;
  isOpen: boolean;
  onClose: () => void;
  onSave: (key: string, value: number) => void;
}

const HeightDrawer = ({ defaultValue, isOpen, onClose, onSave }: HeightDrawerProps) => {
  const [value, setValue] = useState(defaultValue);

  const handleSaveAction = () => onSave("height", value);
  const handleCloseAction = () => {
    setValue(defaultValue);
    onClose();
  };

  return (
    <BodyMetricsDrawerWrapper isOpen={isOpen} isSaveActionDisabled={value === defaultValue} onClose={handleCloseAction} onSave={handleSaveAction} title="Height">
      <HeightSelector initialValue={value.toString()} onChange={setValue} visibleCount={18} />
    </BodyMetricsDrawerWrapper>
  );
};

export default HeightDrawer;
