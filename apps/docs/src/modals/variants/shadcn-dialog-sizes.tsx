"use client";

import { useModal, useModalStore } from "better-modal/react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const dialogVariants = cva("", {
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
      "8xl": "sm:max-w-8xl",
      "9xl": "sm:max-w-9xl",
      full: "sm:max-w-full h-full",
    },
  },
});

type Props = {
  title: string;
  description: string;
} & VariantProps<typeof dialogVariants>;

export function ShadcnDialogSizes({
  children,
  title,
  description,
  size,
}: { children: React.ReactNode } & Props) {
  const modal = useModal();
  const store = useModalStore();

  return (
    <Dialog
      open={modal.open}
      onOpenChange={(v) => !v && store.dismiss(modal.id)}
    >
      <DialogContent
        className={dialogVariants({ size })}
        onAnimationEnd={() => {
          if (!modal.open) store.remove(modal.id);
        }}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
