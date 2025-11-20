import type { PieSectorDataItem } from "recharts/types/polar/Pie";

export const Needle = ({ cx, cy, innerRadius, midAngle, outerRadius }: PieSectorDataItem) => {
  if (!innerRadius || !outerRadius || !innerRadius) return null;

  const needleLength = innerRadius + (outerRadius - innerRadius) / 4;

  return (
    <g>
      <circle cx={cx} cy={cy} r={6} fill="var(--foreground)" stroke="none" />
      <path
        d={`M${cx},${cy}l${needleLength},0`}
        strokeWidth={2}
        stroke="var(--foreground)"
        fill="var(--foreground)"
        strokeLinecap="round"
        style={{
          transform: `rotate(-${midAngle}deg)`,
          transformOrigin: `${cx}px ${cy}px`,
        }}
      />
    </g>
  );
};

Needle.displayName = "Needle";
