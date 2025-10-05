"use client";

import * as React from "react";
import type { ModalInstance } from "../store";

const ModalContext = React.createContext<ModalInstance | null>(null);

export function ModalProvider({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: ModalInstance;
}) {
  return (
    <ModalContext.Provider value={modal}>{children}</ModalContext.Provider>
  );
}

export function useModal() {
  const ctx = React.useContext(ModalContext);

  if (!ctx) {
    throw new Error("useModal must be used within a ModalProvider");
  }

  return ctx;
}
