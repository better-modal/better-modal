import type { Type } from "free-types";
import type { AnyModalDefinition } from "../def";
import { createPlugin } from "../plugin";
import type { AnyAdapter } from "./adapter";

export type UrlSyncableModal<
    Def extends AnyModalDefinition,
    Options,
> = {
    modal: Def;
    options: Options;
};

export type AnyUrlSyncableModal = UrlSyncableModal<any, any>;

function toUrlSyncableModal<
    Def extends AnyModalDefinition,
    Options,
>(
    modal: Def,
    options: Options,
): UrlSyncableModal<Def, Options> {
    return {
        modal,
        options,
    };
}

type Methods<Def extends AnyModalDefinition = AnyModalDefinition, Options = {}> = {
    sync: (
        options: Options,
    ) => UrlSyncableModal<Def, Options>;
};

export interface UrlSyncPluginDecorator<Options>
    extends Type<1> {
    type: this[0] extends AnyModalDefinition ? Methods<this[0], Options> : unknown;
}

export function createUrlSyncPlugin<Adapter extends AnyAdapter>(
    _adapter: Adapter,
) {
    const plugin = createPlugin<
        UrlSyncPluginDecorator<Adapter>,
        Methods
    >({
        modal: {
            sync: (ctx) => {
                return (options) => {
                    return toUrlSyncableModal(ctx.modal, options);
                };
            },
        },
    });

    return plugin;
}
