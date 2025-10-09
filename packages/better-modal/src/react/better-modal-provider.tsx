"use client";

import * as React from "react";
import { createBetterModalClient } from "../client";
import type { AnyRegistry } from "../def";
import { type ModalState, ModalStore } from "../store";
import { ModalProvider } from "./modal-context";
import { ModalStoreProvider, useModalStore } from "./modal-store-context";
import { ModalClientProvider } from "./modals-provider";

export function Provider() {
  const client = useModalStore();

  const [modalState, setModalState] = React.useState<ModalState>({
    modals: [],
  });

  React.useEffect(() => {
    const unsubscribe = client.subscribe((newState: ModalState) => {
      setModalState(newState);
    });

    return () => {
      unsubscribe();
    };
  }, [client]);

  return (
    <React.Fragment>
      {modalState.modals.map((modal, idx) => {
        const Variant = client.getVariant(modal.variant);

        return (
          <ModalProvider key={`${modal.id}-${idx}`} modal={modal}>
            <Variant {...modal.values.variant}>
              <modal.ui {...modal.values.component} />
            </Variant>
          </ModalProvider>
        );
      })}
    </React.Fragment>
  );
}

export function createBetterModalProvider(registry: AnyRegistry) {
  return ({ children }: { children: React.ReactNode }) => {
    const [store] = React.useState(
      () => new ModalStore(registry._def.variants),
    );
    const [client] = React.useState(() =>
      createBetterModalClient(store, registry),
    );

    return (
      <ModalStoreProvider store={store}>
        <ModalClientProvider client={client}>
          {children}
          <Provider />
        </ModalClientProvider>
      </ModalStoreProvider>
    );
  };
}
