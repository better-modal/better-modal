import type { Type } from "free-types";
import type { AnyModalDefinition } from "../def";
import { isLazyComponent } from "../lazy";
import { createPlugin } from "../plugin";

type Methods = {
    preload: () => Promise<void>;
};

interface MethodDecorator extends Type<1> {
    type: this[0] extends AnyModalDefinition ? Methods : unknown;
}

const plugin = createPlugin<MethodDecorator, Methods>({
    modal: {
        preload: (ctx) => {
            return async () => {
                const component = ctx.modal._def.component;

                if (!isLazyComponent(component)) {
                    console.warn(
                        `Modal ${ctx.modal.id} is not a lazy component and can't be preloaded`,
                    );
                    return;
                }

                await component.preload?.();
            };
        },
    },
});

export const preloadPlugin = plugin;
