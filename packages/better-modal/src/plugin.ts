import type { AnyModalDefinition, AnyRegistry } from "./def";
import type * as HKT from "./hkt";
import type { ModalStore } from "./store";

export interface NoopDecorator extends HKT.TypeLambda {
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
    ModalDecorator extends HKT.TypeLambda = NoopDecorator,
    ModalMethods extends Record<string, any> = {},
    ClientDecorator extends HKT.TypeLambda = NoopDecorator,
    ClientMethods extends Record<string, any> = {},
> = {
    _modalDecorator: ModalDecorator;
    modal: PluginModalMethods<ModalMethods>;
    _clientDecorator: ClientDecorator;
    client: PluginClientMethods<ClientMethods>;
};

export type AnyPlugin = Plugin<any, any, any, any>;

export function createPlugin<
    ModalDecorator extends HKT.TypeLambda = NoopDecorator,
    ModalMethods extends Record<string, any> = {},
    ClientDecorator extends HKT.TypeLambda = NoopDecorator,
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

export interface MergeDecoratorsType<
    Decorators extends readonly HKT.TypeLambda[],
> extends HKT.TypeLambda {
    readonly type: MergeDecoratorResults<this["Target"], Decorators>;
}

type MergeDecoratorResults<
    TValue,
    Decorators extends readonly HKT.TypeLambda[],
> = Decorators extends [
    infer First extends HKT.TypeLambda,
    ...infer Rest extends readonly HKT.TypeLambda[],
]
    ? ApplyDecorator<First, TValue> & MergeDecoratorResults<TValue, Rest>
    : {};

type ApplyDecorator<F extends HKT.TypeLambda, Target> = HKT.Kind<
    F,
    never,
    never,
    never,
    Target
>;

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
