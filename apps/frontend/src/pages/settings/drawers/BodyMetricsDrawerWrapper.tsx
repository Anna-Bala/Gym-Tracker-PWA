import type { ReactNode } from "react";

import { Button } from "@/components/ui";
import { Drawer } from "@/components/Drawer";
import { Typography } from "@/components/base/Typography";

interface BodyMetricsDrawerWrapperProps {
  children: ReactNode;
  isOpen: boolean;
  isSaveActionDisabled: boolean;
  onClose: () => void;
  onSave: () => void;
  title: string;
}

const BodyMetricsDrawerWrapper = ({ children, isOpen, isSaveActionDisabled, onClose, onSave, title }: BodyMetricsDrawerWrapperProps) => (
  <Drawer
    isOpen={isOpen}
    onAnimationEnd={onClose}
    footerContent={
      <Button disabled={isSaveActionDisabled} variant="default" onClick={onSave}>
        Save
      </Button>
    }
  >
    <div className="flex flex-row justify-between w-full">
      <Typography className="font-semibold" variant="h3">
        {title}
      </Typography>
      <Button className="pr-0 text-muted-foreground lg:pr-4" variant="ghost" onClick={onClose}>
        Close
      </Button>
    </div>

    <div className="w-full" onTouchStart={(e) => e.stopPropagation()} onTouchMove={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()} onPointerMove={(e) => e.stopPropagation()}>
      {children}
    </div>
  </Drawer>
);

export default BodyMetricsDrawerWrapper;
