"use client";

import { useModal, useModalStore } from "better-modal/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  title: string;
  description: string;
};

export function ShadcnDialog({
  children,
  title,
  description,
}: { children: React.ReactNode } & Props) {
  const modal = useModal();
  const store = useModalStore();

  return (
    <Dialog
      open={modal.open}
      onOpenChange={(v) => !v && store.dismiss(modal.id)}
    >
      <DialogContent
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
