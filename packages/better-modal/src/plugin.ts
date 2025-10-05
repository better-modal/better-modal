import type { apply, Type } from "free-types";
import type { AnyModalDefinition, AnyRegistry } from "./def";
import type { ModalStore } from "./store";

export interface NoopDecorator extends Type<1> {
    type: {};
}

type PluginModalMethods<M extends Record<string, any>> = {
    [K in keyof M]: (ctx: {
        store: ModalStore;
        modal: AnyModalDefinition;
    }) => M[K];
};

type PluginClientMethods<M extends Record<string, any>> = {
    [K in keyof M]: (ctx: { store: ModalStore; modals: AnyRegistry }) => M[K];
};

export type Plugin<
    ModalDecorator extends Type = NoopDecorator,
    ModalMethods extends Record<string, any> = {},
    ClientDecorator extends Type = NoopDecorator,
    ClientMethods extends Record<string, any> = {},
> = {
    _modalDecorator: ModalDecorator;
    modal: PluginModalMethods<ModalMethods>;
    _clientDecorator: ClientDecorator;
    client: PluginClientMethods<ClientMethods>;
};

export type AnyPlugin = Plugin<any, any, any, any>;

export function createPlugin<
    ModalDecorator extends Type = NoopDecorator,
    ModalMethods extends Record<string, any> = {},
    ClientDecorator extends Type = NoopDecorator,
    ClientMethods extends Record<string, any> = {},
>(config: {
    modal?: PluginModalMethods<ModalMethods>;
    client?: PluginClientMethods<ClientMethods>;
}): Plugin<ModalDecorator, ModalMethods, ClientDecorator, ClientMethods> {
    return {
        _modalDecorator: {} as ModalDecorator,
        modal: (config.modal ?? {}) as PluginModalMethods<ModalMethods>,
        _clientDecorator: {} as ClientDecorator,
        client: (config.client ?? {}) as PluginClientMethods<ClientMethods>,
    };
}

export interface MergeDecoratorsType<Decorators extends Type[]>
    extends Type<1> {
    type: MergeDecoratorResults<this[0], Decorators>;
}

export type MergeDecoratorResults<
    TValue,
    Decorators extends Type[],
> = Decorators extends [
    infer First extends Type,
    ...infer Rest extends Type[],
]
    ? apply<First, [TValue]> & MergeDecoratorResults<TValue, Rest>
    : {};

type ExtractModalDecorators<T extends readonly AnyPlugin[]> =
    T extends readonly [infer First extends AnyPlugin, ...infer Rest]
    ? Rest extends readonly AnyPlugin[]
    ? [First["_modalDecorator"], ...ExtractModalDecorators<Rest>]
    : []
    : [];

type ExtractClientDecorators<T extends readonly AnyPlugin[]> =
    T extends readonly [infer First extends AnyPlugin, ...infer Rest]
    ? Rest extends readonly AnyPlugin[]
    ? [First["_clientDecorator"], ...ExtractClientDecorators<Rest>]
    : []
    : [];

export type ExtractPlugins<T extends readonly AnyPlugin[]> =
    MergeDecoratorsType<ExtractModalDecorators<T>>;

export type ExtractClientPlugins<T extends readonly AnyPlugin[]> =
    MergeDecoratorsType<ExtractClientDecorators<T>>;
