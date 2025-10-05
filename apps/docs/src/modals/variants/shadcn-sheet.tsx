"use client";

import { useModal, useModalStore } from "better-modal/react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type Props = {
  title: string;
  description: string;
};

export function ShadcnSheet({
  children,
  title,
  description,
}: { children: React.ReactNode } & Props) {
  const modal = useModal();
  const store = useModalStore();

  return (
    <Sheet
      open={modal.open}
      onOpenChange={(v) => !v && store.dismiss(modal.id)}
    >
      <SheetContent
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
