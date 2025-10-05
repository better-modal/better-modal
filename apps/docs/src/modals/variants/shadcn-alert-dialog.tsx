"use client";

import { useModal, useModalStore } from "better-modal/react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Props = {
  title: string;
  description: string;
};

export function ShadcnAlertDialog({
  children,
  title,
  description,
}: { children: React.ReactNode } & Props) {
  const modal = useModal();
  const store = useModalStore();

  return (
    <AlertDialog
      open={modal.open}
      onOpenChange={(v) => !v && store.dismiss(modal.id)}
    >
      <AlertDialogContent
        onAnimationEnd={() => {
          if (!modal.open) store.remove(modal.id);
        }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        {children}
      </AlertDialogContent>
    </AlertDialog>
  );
}
