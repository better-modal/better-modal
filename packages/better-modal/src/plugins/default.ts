import type { Type } from "free-types";
import type { Simplify } from "type-fest";
import {
    type AnyComponent,
    type AnyModalDefinition,
    type AnyRegistry,
    createModalDefinition,
    type ExtractProps,
    type MissingProps,
    toModalDefinition,
} from "../def";
import { isLazyComponent } from "../lazy";
import { createPlugin } from "../plugin";
import type { ModalStore } from "../store";
import type { Prettify } from "../types";

type Actions = {
    dismiss: () => void;
    remove: () => void;
};

type Context = Prettify<{
    modal: {
        id: string;
    };
    actions: Actions;
}>;

type ModalMethods<Def extends AnyModalDefinition = AnyModalDefinition> =
    {} extends MissingProps<Def>
    ? {
        open: (
            input?: MissingProps<Def> | ((ctx: Context) => MissingProps<Def>),
        ) => Context;
    }
    : {
        open: (
            input: MissingProps<Def> | ((ctx: Context) => MissingProps<Def>),
        ) => Context;
    };

export interface ModalDecorator extends Type<1> {
    type: this[0] extends AnyModalDefinition ? ModalMethods<this[0]> : unknown;
}

type ClientMethods<Def extends AnyRegistry = AnyRegistry> = {
    open: <
        Component extends AnyComponent,
        T extends keyof Def["_def"]["variants"],
    >(
        component: Component,
        variant: T & string,
        values: {
            variant: Prettify<ExtractProps<Def["_def"]["variants"][T]>>;
            component: Prettify<ExtractProps<Component>>;
        },
    ) => void;
};

export interface ClientDecorator extends Type<1> {
    type: this[0] extends AnyRegistry ? ClientMethods<this[0]> : unknown;
}

const plugin = createPlugin<
    ModalDecorator,
    ModalMethods,
    ClientDecorator,
    ClientMethods
>({
    modal: {
        open: (ctx) => {
            return (_input) => {
                const openCtx = {
                    modal: {
                        id: ctx.modal.id,
                    },
                    actions: {
                        dismiss: () => ctx.store.dismiss(ctx.modal.id),
                        remove: () => ctx.store.remove(ctx.modal.id),
                    },
                } satisfies Context;

                const input = _input
                    ? typeof _input === "function"
                        ? _input(openCtx)
                        : _input
                    : {};

                const values = {
                    variant: input.variant,
                    component: input.component,
                };

                openFn(ctx.modal, ctx.modal._def.config.variant, ctx.store, values);

                return openCtx;
            };
        },
    },
    client: {
        open: (ctx) => {
            return (component, variant, values) => {
                const id = `tmp_${variant}_${Date.now()}`;
                const baseModal = createModalDefinition(component, variant, {});
                const modal = toModalDefinition(baseModal, id);
                return openFn(modal, variant, ctx.store, values);
            };
        },
    },
});

export const defaultPlugin = plugin;

function openFn(
    modal: AnyModalDefinition,
    variant: string,
    store: ModalStore,
    values: any,
) {
    const componentValues = {
        ...(modal._def.config.defaultValues.component ?? {}),
        ...(values.component ?? {}),
    };

    const variantValues = {
        ...(modal._def.config.defaultValues.variant ?? {}),
        ...(values.variant ?? {}),
    };

    const component = modal._def.component;

    const ui = isLazyComponent(component)
        ? component.loader()
        : modal._def.component;

    store.add({
        id: modal.id,
        ui,
        open: true,
        variant,
        values: {
            variant: variantValues,
            component: componentValues,
        },
    });
}
