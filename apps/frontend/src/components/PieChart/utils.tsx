import type { PieSectorDataItem } from "recharts/types/polar/Pie";

const RADIAN = Math.PI / 180;

const generateLabelRotationValues = (totalLabels: number, totalAngle = 180) => {
  if (totalLabels <= 0) return [];

  const segmentAngle = totalAngle / totalLabels;
  const rotationValues = [];
  const startAngle = 180;

  for (let i = 0; i < totalLabels; i++) {
    const centerFromStart = (totalLabels - 1 - i) * segmentAngle + segmentAngle / 2;
    const midAngle = startAngle - centerFromStart;

    const textRotation = midAngle - 90;

    rotationValues.push(Math.round(textRotation));
  }

  return rotationValues;
};

export const renderCustomLabel = (props: PieSectorDataItem & { index: number }) => {
  const { cx, cy, innerRadius, outerRadius, midAngle, payload, index } = props;
  const label = payload.label;
  const labelAdditionalInfo = payload.labelAdditionalInfo;

  if (!cx || !cy || !innerRadius || !outerRadius) return null;

  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;

  const angleInRadians = -(midAngle ?? 0) * RADIAN;
  const positionX = Number(cx) + radius * Math.cos(angleInRadians);
  const positionY = Number(cy) + radius * Math.sin(angleInRadians);

  const labelRotationValues = generateLabelRotationValues(5, 180);
  const rotation = labelRotationValues[index];

  const labelLines = (label || "").split("\n").filter((line: string) => line.length > 0);
  const totalLines = labelLines.length + (labelAdditionalInfo ? 1 : 0);

  const initialDy = -(totalLines - 1) * 0.6 + "em";

  return (
    <text x={positionX} y={positionY} fill="white" textAnchor="middle" transform={`rotate(${rotation} ${positionX} ${positionY})`}>
      {labelLines.map((labelLine: string, index: number) => (
        <tspan x={positionX} dy={index === 0 ? initialDy : "1.2em"} key={`line-${index}`}>
          {labelLine}
        </tspan>
      ))}

      {labelAdditionalInfo && (
        <tspan x={positionX} dy={labelLines.length === 0 ? initialDy : "1.2em"} key="additional-info">
          {labelAdditionalInfo}
        </tspan>
      )}
    </text>
  );
};
