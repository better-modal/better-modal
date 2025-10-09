import type { AnyModalDefinition } from "../def";
import type * as HKT from "../hkt";
import { createPlugin } from "../plugin";
import type { AnyAdapter } from "./adapter";

export type UrlSyncableModal<Def extends AnyModalDefinition, Options> = {
    modal: Def;
    options: Options;
};

export type AnyUrlSyncableModal = UrlSyncableModal<any, any>;

function toUrlSyncableModal<Def extends AnyModalDefinition, Options>(
    modal: Def,
    options: Options,
): UrlSyncableModal<Def, Options> {
    return {
        modal,
        options,
    };
}

type Methods<Options = undefined, Def extends AnyModalDefinition = AnyModalDefinition> = Options extends Record<string, never> ?
    {
        sync: (options?: Options) => UrlSyncableModal<Def, Options>
    } :
    {
        sync: (options: Options) => UrlSyncableModal<Def, Options>
    }


export interface UrlSyncPluginDecorator<Options = undefined> extends HKT.TypeLambda {
    readonly type: this["Target"] extends AnyModalDefinition
    ? Methods<Options, this["Target"]>
    : unknown;
}

export function createUrlSyncPlugin<Adapter extends AnyAdapter>(
    _adapter: Adapter,
) {
    type Options = Adapter["_def"]["$types"]["options"];

    return createPlugin<UrlSyncPluginDecorator<Options>, Methods>({
        modal: {
            sync: (ctx) => {
                return (options) => {
                    return toUrlSyncableModal(ctx.modal, options);
                };
            },
        },
    });
}
