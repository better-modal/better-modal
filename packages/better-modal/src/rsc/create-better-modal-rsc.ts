import type { AnyRegistry } from "../def";
import { createAction } from "./action";
import { createRSCPlugin } from "./plugin";



export function createBetterModalRSC(modals: AnyRegistry) {
    return {
        createAction: () => {
            return createAction(modals);
        },
        createRSCPlugin,
        // 🚨 Using this fix will opt out of lazy loading
        FixReactClientManifest: () => {
            return null;
        },
    };
}

