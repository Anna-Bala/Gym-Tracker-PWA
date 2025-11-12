import React, { type ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Drawer as DrawerBase, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";

interface DrawerProps {
  children?: ReactNode;
  className?: string;
  description?: ReactNode;
  footerContent?: ReactNode;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title?: ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({ children, className, description, footerContent, isOpen, setIsOpen, title }) => (
  <DrawerBase open={isOpen} onAnimationEnd={() => setIsOpen(false)}>
    <DrawerContent className={cn("px-6", className)}>
      <DrawerHeader>
        <DrawerTitle>{title}</DrawerTitle>
        {description && <DrawerDescription>{description}</DrawerDescription>}
      </DrawerHeader>
      {children}
      <DrawerFooter>{footerContent}</DrawerFooter>
    </DrawerContent>
  </DrawerBase>
);

Drawer.displayName = "Drawer";
