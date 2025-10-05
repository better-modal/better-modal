import type { AnyUrlSyncableModal } from "./create-url-sync-plugin";

export interface Adapter<O = {}> {
    init: (def: AnyUrlSyncableModal[]) => {
        read: (key: string) => any;
        write: (key: string, value: any) => void;
        remove: (key: string) => void;

    },
    _def: {
        $types: {
            options: O;
        };
    };
}

export type AnyAdapter = Adapter<{}>;

export function createAdapter<O = {}>(
    init: Adapter<O>["init"],
): Adapter<O> {
    return {
        init,
        _def: {
            $types: {
                options: {} as O,
            },
        },
    }
}
