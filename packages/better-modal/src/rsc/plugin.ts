import type { Type } from "free-types";
import type { AnyModalDefinition, MissingProps } from "../def";
import { createPlugin } from "../plugin";
import type { Action } from "./action";

type Methods<Def extends AnyModalDefinition> = {
    openAsync: (props: MissingProps<Def>) => Promise<void>;
};

interface Plugin extends Type<1> {
    type: this[0] extends AnyModalDefinition ? Methods<this[0]> : unknown;
}

export function createRSCPlugin(action: Action) {
    const plugin = createPlugin<Plugin, Methods<AnyModalDefinition>>({
        modal: {
            openAsync: (ctx) => {
                return async (props) => {
                    const modal = ctx.modal;

                    const allComponentValues = {
                        ...(modal._def.config.defaultValues.component ?? {}),
                        ...(props.component ?? {}),
                    };

                    const allVariantValues = {
                        ...(modal._def.config.defaultValues.variant ?? {}),
                        ...(props.variant ?? {}),
                    };

                    const ui = await action(modal.id, allComponentValues);

                    ctx.store.add({
                        id: modal.id,
                        open: true,
                        ui: () => ui,
                        variant: modal._def.config.variant,
                        values: {
                            variant: allVariantValues,
                            component: allComponentValues,
                        },
                    });
                };
            },
        },
    });

    return plugin;
}
