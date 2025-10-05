import type { ModalClient } from "../client";
import type { AnyRegistry } from "../def";
import { createBetterModalProvider } from "./better-modal-provider";
import { useBetterModal as _useBetterModal } from "./modals-provider";

export function createBetterModalReact<
    T extends AnyRegistry,
>(registry: T) {
    return {
        useBetterModal: () => {
            return _useBetterModal() as ModalClient<T>
        },
        BetterModalProvider: createBetterModalProvider(registry),
    };
}
