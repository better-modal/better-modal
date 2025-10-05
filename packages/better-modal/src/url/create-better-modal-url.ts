"use client";

import type { AnyAdapter } from "./adapter";
import { createBetterModalDefaultAdapter } from "./adapters/default";
import { createBetterModalUrlSyncer } from "./better-modal-url-syncer";
import { createUrlSyncPlugin } from "./create-url-sync-plugin";

type Options<Adapter extends AnyAdapter> = {
    adapter?: Adapter;
};

export function createBetterModalUrlSync<Adapter extends AnyAdapter>(
    options?: Options<Adapter>,
) {
    const _adapter = options?.adapter ?? createBetterModalDefaultAdapter();

    return {
        BetterModalUrlSyncer: createBetterModalUrlSyncer(_adapter),
        urlSyncPlugin: createUrlSyncPlugin(_adapter),
    };
}
