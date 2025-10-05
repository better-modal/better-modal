"use client";

import * as React from "react";
import type { AnyModalClient } from "../client";

const ModalsContext = React.createContext<AnyModalClient | null>(null);

export function ModalClientProvider({
  children,
  client,
}: {
  client: AnyModalClient;
  children: React.ReactNode;
}) {
  return (
    <ModalsContext.Provider value={client}>{children}</ModalsContext.Provider>
  );
}

export function useBetterModal() {
  const ctx = React.useContext(ModalsContext);

  if (!ctx) {
    throw new Error("useBetterModal must be used within a ModalClientProvider");
  }

  return ctx;
}
