import { ScrollPicker } from "@/components/ScrollPicker";

interface AgeSelector {
  className?: string;
  initialValue: string;
  onChange?: (value: number) => void;
  visibleCount: number;
}

const ageOptions = Array.from({ length: 100 - 18 + 1 }, (_, i) => (i + 18).toString()).map((age) => ({ label: age, value: age }));

export const AgeSelector: React.FC<AgeSelector> = ({ className, initialValue, onChange, visibleCount }) => (
  <ScrollPicker className={className} infinite initialValue={initialValue} onChange={onChange} optionItemHeight={60} options={ageOptions} suffix="years" visibleCount={visibleCount} />
);

AgeSelector.displayName = "AgeSelector";
