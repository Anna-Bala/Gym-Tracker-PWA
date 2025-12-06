import { ScrollPicker } from "@/components/ScrollPicker";

interface HeightSelector {
  className?: string;
  initialValue: string;
  onChange?: (value: number) => void;
  visibleCount: number;
}

const heightOptions = Array.from({ length: 220 - 100 + 1 }, (_, i) => (i + 100).toString()).map((height) => ({ label: height, value: height }));

export const HeightSelector: React.FC<HeightSelector> = ({ className, initialValue, onChange, visibleCount }) => (
  <ScrollPicker className={className} infinite initialValue={initialValue} onChange={onChange} optionItemHeight={60} options={heightOptions} suffix="cm" visibleCount={visibleCount} />
);

HeightSelector.displayName = "HeightSelector";
