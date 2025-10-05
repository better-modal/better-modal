"use client";

import { useModal, useModalStore } from "better-modal/react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const sheetVariants = cva("", {
  variants: {
    size: {
      sm: "sm:max-w-sm",
      md: "sm:max-w-md",
      lg: "max-w-lg",
      xl: "sm:max-w-xl",
      "2xl": "sm:max-w-2xl",
      "3xl": "sm:max-w-3xl",
      "4xl": "sm:max-w-4xl",
      "5xl": "sm:max-w-5xl",
      "6xl": "sm:max-w-6xl",
      "7xl": "sm:max-w-7xl",
      full: "w-full",
    },
  },
});

type Props = {
  title: string;
  description: string;
  side?: "top" | "right" | "bottom" | "left";
} & VariantProps<typeof sheetVariants>;

export function ShadcnSheetSizes({
  children,
  title,
  description,
  size,
  side = "right",
}: { children: React.ReactNode } & Props) {
  const modal = useModal();
  const store = useModalStore();

  return (
    <Sheet
      open={modal.open}
      onOpenChange={(v) => !v && store.dismiss(modal.id)}
    >
      <SheetContent
        side={side}
        data-side={side}
        className={sheetVariants({ size })}
        onAnimationEnd={() => {
          if (!modal.open) store.remove(modal.id);
        }}
      >
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  );
}
