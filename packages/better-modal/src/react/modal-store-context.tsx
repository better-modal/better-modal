"use client";

import * as React from "react";
import type { ModalStore } from "../store";

const ModalClientContext = React.createContext<ModalStore | null>(null);

export function ModalStoreProvider({
  children,
  store,
}: {
  store: ModalStore;
  children: React.ReactNode;
}) {
  return (
    <ModalClientContext.Provider value={store}>
      {children}
    </ModalClientContext.Provider>
  );
}

export function useModalStore() {
  const ctx = React.useContext(ModalClientContext);

  if (!ctx) {
    throw new Error("useModalStore must be used within a ModalStoreProvider");
  }

  return ctx;
}
