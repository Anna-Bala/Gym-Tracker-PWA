import React, { type ReactNode } from "react";
import { type VariantProps } from "class-variance-authority";

import { Alert as AlertBase, AlertTitle, AlertDescription, type alertVariants } from "../ui";

interface AlertProps extends VariantProps<typeof alertVariants> {
  className?: string;
  description?: ReactNode;
  icon?: ReactNode;
  title?: ReactNode;
}

export const Alert: React.FC<AlertProps> = ({ className, description, icon = null, title, variant }) => {
  return (
    <AlertBase className={className} variant={variant}>
      {icon}
      {title && <AlertTitle>{title}</AlertTitle>}
      {description && <AlertDescription>{description}</AlertDescription>}
    </AlertBase>
  );
};

Alert.displayName = "Alert";
