"use client";
import { useModal, useModalStore } from "better-modal/react";
import { useState, useTransition } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Props = {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  onError?: (e: unknown) => void | Promise<void>;
  children: React.ReactNode;
};

export function ShadcnAlertDialogAction({
  title,
  description,
  children,
  onConfirm,
  onCancel,
  onError,
  confirmText = "Confirm",
  cancelText = "Cancel",
}: Props) {
  const modal = useModal();
  const store = useModalStore();

  const [isPending, startTransition] = useTransition();

  const handleConfirm = async (e: React.MouseEvent) => {
    if (!onConfirm) return;
    e.preventDefault();

    startTransition(async () => {
      try {
        const result = onConfirm();
        if (result instanceof Promise) {
          await result;
        }
        store.dismiss(modal.id);
      } catch (e) {
        onError?.(e);
      }
    });
  };

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
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              store.dismiss(modal.id);
              onCancel?.();
            }}
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={isPending}>
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
