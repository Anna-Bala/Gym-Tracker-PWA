import { RadioGroupCardItem } from "@/components/RadioGroupCardItem";
import FemaleSign from "@icons/female-sign.svg?react";
import MaleSign from "@icons/male-sign.svg?react";

const genderOptions = [
  {
    label: "Female",
    value: "F",
    Icon: FemaleSign,
  },
  {
    label: "Male",
    value: "M",
    Icon: MaleSign,
  },
];

export const GenderSelector: React.FC = () => genderOptions.map((option) => <RadioGroupCardItem key={option.value} className="flex-col" {...option} />);

GenderSelector.displayName = "GenderSelector";
