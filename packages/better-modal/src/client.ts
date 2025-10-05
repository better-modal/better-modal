import type { apply } from "free-types";
import {
    type AnyBaseModalDefinition,
    type AnyModalDefinition,
    type AnyRegistry,
    type ModalDefinition,
    type ModalDefinitionStructure,
    toModalDefinition
} from "./def";
import type { AnyPlugin, ExtractClientPlugins, ExtractPlugins } from "./plugin";
import { defaultPlugin } from "./plugins/default";
import type { ModalStore } from "./store";
import { createRecursiveProxy, err, getByPath } from "./utils";

const DEFAULT_PLUGINS = [defaultPlugin] as const;

export function createBetterModalClient<Registry extends AnyRegistry,>(store: ModalStore, registry: Registry) {
    const plugins = registry._def.plugins;
    const allPlugins = [...DEFAULT_PLUGINS, ...(plugins ?? [])]

    const modalMethodContext = allPlugins.reduce(
        // biome-ignore lint/performance/noAccumulatingSpread: idc
        (acc, plugin) => ({ ...acc, ...plugin.modal }),
        {} as Record<
            string,
            (ctx: {
                store: ModalStore;
                modal: AnyModalDefinition;
            }) => (...args: unknown[]) => unknown
        >,
    );

    const clientMethodContext = allPlugins.reduce(
        // biome-ignore lint/performance/noAccumulatingSpread: idc
        (acc, plugin) => ({ ...acc, ...plugin.client }),
        {} as Record<
            string,
            (ctx: {
                store: ModalStore;
                modals: AnyRegistry;
            }) => (...args: unknown[]) => unknown
        >,
    );

    const modalsProxy = createRecursiveProxy((opts) => {
        const path = [...opts.path];

        if (path.length === 1) {
            const method = path.at(0) as string;

            if (method in clientMethodContext === false) {
                throw new Error(`Method ${method} not found`);
            }

            return clientMethodContext[method]({
                store,
                modals: registry,
            })(...opts.args);
        }

        const method = path.pop() as keyof typeof modalMethodContext;

        if (!method) {
            throw new Error(`Method ${path.pop()} not found`);
        }

        const id = path.join(".");

        const _modal =
            (getByPath(id, registry._def.record) as unknown as AnyBaseModalDefinition) ??
            err(`Modal ${path.join(".")} not found`);

        const modal = toModalDefinition(_modal, id);

        if (method in modalMethodContext === false) {
            throw new Error(`Method ${String(method)} not found`);
        }

        return modalMethodContext[method]({
            store,
            modal,
        })(...opts.args);
    });

    return modalsProxy as ModalClient<Registry>;
}

export type ModalClient<
    T extends AnyRegistry,
> = ModalClientBuilder<T["_def"]["record"], T["_def"]["plugins"]> & apply<ExtractClientPlugins<T["_def"]["plugins"]>, [T]>;

type ModalClientBuilder<T extends AnyRegistry["_def"]["record"], Plugins extends readonly AnyPlugin[], Path extends string = ""> = {
    [K in keyof T]: T[K] extends AnyBaseModalDefinition
    ? apply<
        ExtractPlugins<Plugins>,
        [ModalDefinition<T[K], Path extends "" ? K & string : `${Path}.${K & string}`>]
    >
    : T[K] extends ModalDefinitionStructure
    ? ModalClientBuilder<T[K], Plugins, Path extends "" ? K & string : `${Path}.${K & string}`>
    : unknown;
}


export type AnyModalClient = ModalClient<any>;
