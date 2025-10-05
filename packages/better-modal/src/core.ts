/** biome-ignore-all lint/suspicious/noExplicitAny: lib */

import {
  type AnyComponent,
  type BaseModalDefinition,
  createModalDefinition,
  type ExtractProps,
  type ModalsRecord,
  type Registry,
  type Variants,
} from "./def";
import type { AnyPlugin } from "./plugin";
import { defaultPlugin } from "./plugins/default";
import type { Prettify } from "./types";

type ModalOptions<
  TVariants extends Variants,
  Plugins extends readonly AnyPlugin[] | undefined,
> = {
  variants: TVariants;
  plugins?: Plugins;
};

type NormalizePlugins<P> = P extends readonly AnyPlugin[] ? P : readonly [];

type PluginsWithDefault<P> = readonly [...NormalizePlugins<P>, typeof defaultPlugin];

function createModalFn<TVariants extends Variants>(): <
  Component extends AnyComponent,
  V extends keyof TVariants,
>(
  component: Component,
  variant: V,
) => BaseModalDefinition<
  {
    component: Prettify<ExtractProps<Component>>;
    variant: Prettify<ExtractProps<TVariants[V]>>;
  },
  {}
> {
  return <Component extends AnyComponent, V extends keyof TVariants>(
    component: Component,
    variant: V,
  ) => {
    type ComponentValues = Prettify<ExtractProps<typeof component>>;
    type VariantValues = Prettify<ExtractProps<TVariants[V]>>;

    type Values = {
      component: ComponentValues;
      variant: VariantValues;
    };

    return createModalDefinition<Values>(component, variant as string, {});
  };
}

function createModalsFn<const Options extends ModalOptions<any, readonly AnyPlugin[] | undefined>>(options: Options) {
  return function modals<T extends ModalsRecord>(def: T) {
    type BasePlugins = NormalizePlugins<Options["plugins"]>;
    type WithDefault = PluginsWithDefault<Options["plugins"]>;

    const plugins = (options.plugins ?? []) as BasePlugins;
    const pluginsWithDefault = [...plugins, defaultPlugin] as WithDefault;

    return {
      _def: {
        record: def,
        variants: options.variants,
        plugins: pluginsWithDefault,
      },
    } satisfies Registry<T, Options["variants"], WithDefault>;
  };
}

export function betterModal<const Options extends ModalOptions<any, any>>(options: Options) {
  return {
    modal: createModalFn<Options["variants"]>(),
    registry: createModalsFn(options),
  };
}