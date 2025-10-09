import type { AnyLazyComponent, ExtractPropsFromLazyComponent } from "./lazy";
import type { AnyPlugin } from "./plugin";
import type { Prettify } from "./types";

type AnyValues = {
    variant: Record<string, any>;
    component: Record<string, any>;
};

export type DefaultValuesShape<Values extends AnyValues> = {
    variant?: Partial<Values["variant"]>;
    component?: Partial<Values["component"]>;
};

export type BaseModalDefinition<
    Values extends AnyValues,
    DefaultValues extends DefaultValuesShape<Values>,
> = {
    _def: {
        component: AnyComponent;
        config: {
            variant: string;
            defaultValues: DefaultValues;
        };
        $types: {
            variantValues: Values["variant"];
            values: {
                variant: Values["variant"];
                component: Values["component"];
            };
        };
    };
    withDefaults: <T extends DefaultValuesShape<Values>>(
        defaultValues: T,
    ) => BaseModalDefinition<Values, Prettify<DefaultValues & T>>;
};

export interface Registry<
    T extends ModalsRecord,
    TVariants extends Variants,
    Plugins extends readonly AnyPlugin[],
> {
    _def: {
        record: T;
        variants: TVariants;
        plugins: Plugins;
    };
}

type MakeOptionalWithDefaults<T, D> = Prettify<
    {
        [K in keyof T as K extends keyof D ? never : K]: T[K];
    } & {
        [K in keyof T as K extends keyof D ? K : never]?: T[K];
    }
>;

type RequiredProps<TAvailable, TDefaults> = {
    [K in keyof TAvailable]: K extends keyof TDefaults
    ? TDefaults[K] extends Record<string, any>
    ? MakeOptionalWithDefaults<TAvailable[K], TDefaults[K]>
    : TAvailable[K]
    : TAvailable[K];
};

type AllOptional<T> = {} extends T ? true : false;

type MakeTopLevelOptional<T> = {
    [K in keyof T as AllOptional<T[K]> extends true ? never : K]: T[K];
} & {
    [K in keyof T as AllOptional<T[K]> extends true ? K : never]?: T[K];
};

export type MissingProps<T extends AnyModalDefinition> = Prettify<
    MakeTopLevelOptional<
        RequiredProps<
            T["_def"]["$types"]["values"],
            T["_def"]["config"]["defaultValues"]
        >
    >
>;

export type AnyRegistry = Registry<any, any, any>;

export type ModalsRecord = ModalDefinitionStructure;

type ModalDefinitionRecord = Record<
    string,
    AnyModalDefinition | AnyBaseModalDefinition
>;

export type ModalDefinitionStructure = Record<
    string,
    ModalDefinitionRecord | AnyBaseModalDefinition
>;

export function createModalDefinition<
    Values extends AnyValues,
    DefaultValues extends DefaultValuesShape<Values> = {},
>(
    component: AnyComponent,
    variant: string,
    defaultValues: DefaultValues = {} as DefaultValues,
): BaseModalDefinition<Values, DefaultValues> {
    return {
        _def: {
            $types: {} as any,
            component,
            config: {
                variant,
                defaultValues,
            },
        },
        withDefaults: <T extends DefaultValuesShape<Values>>(newDefaults: T) => {
            const mergedDefaults = {
                variant: {
                    ...(defaultValues.variant ?? {}),
                    ...(newDefaults.variant ?? {}),
                },
                component: {
                    ...(defaultValues.component ?? {}),
                    ...(newDefaults.component ?? {}),
                },
            } as Prettify<DefaultValues & T>;

            return createModalDefinition<Values, Prettify<DefaultValues & T>>(
                component,
                variant,
                mergedDefaults,
            );
        },
    };
}

export type AnyBaseModalDefinition = BaseModalDefinition<any, any>;

export type ModalDefinition<
    T extends AnyBaseModalDefinition = AnyBaseModalDefinition,
    Id extends string = string,
> = Omit<T, "withDefaults"> & { id: Id };

export type AnyModalDefinition = ModalDefinition;

export function toModalDefinition(modal: AnyBaseModalDefinition, id: string) {
    return {
        id,
        ...modal,
    };
}

type UnsupportedProps = "children";

export type ExtractProps<T extends AnyComponent> = T extends AnyLazyComponent
    ? ExtractPropsFromLazyComponent<T>
    : T extends SyncComponent
    ? Omit<Parameters<T>[0], UnsupportedProps>
    : never;

type SyncComponent = (props: any) => any;
// type AsyncComponent = (props: any) => Promise<JSX.Element>;

export type AnyComponent = SyncComponent | AnyLazyComponent;

export type Variants = Record<string, SyncComponent>;

export type AnyVariant = SyncComponent;
