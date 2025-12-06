import { ScrollPicker } from "@/components/ScrollPicker";

interface WeightSelector {
  className?: string;
  initialValue: string;
  onChange?: (value: number) => void;
  visibleCount: number;
}

const weightOptions = Array.from({ length: 200 - 40 + 1 }, (_, i) => (i + 40).toString()).map((weight) => ({ label: weight, value: weight }));

export const WeightSelector: React.FC<WeightSelector> = ({ className, initialValue, onChange, visibleCount }) => (
  <ScrollPicker className={className} infinite initialValue={initialValue} onChange={onChange} optionItemHeight={60} options={weightOptions} suffix="kg" visibleCount={visibleCount} />
);

WeightSelector.displayName = "WeightSelector";
