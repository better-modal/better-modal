"use client";

import { useEffect, useMemo } from "react";
import { useModalStore } from "../react";
import { omit } from "../utils";
import type { Adapter } from "./adapter";
import type { AnyUrlSyncableModal } from "./create-url-sync-plugin";

type Options = {
  settings: AnyUrlSyncableModal[];
};

export function createBetterModalUrlSyncer(_adapter: Adapter) {
  function Inner({ options }: { options: Options }) {
    const store = useModalStore();
    const adapter = _adapter.init(options.settings);

    const modals = useMemo(
      () =>
        options.settings
          .map((setting) => setting.modal)
          .filter((modal) => {
            const isAsync =
              modal._def.component.constructor.name === "AsyncFunction";

            if (isAsync) {
              console.warn(
                `Modal ${modal.id} is an async modal and can't be synced to the url`,
              );
            }

            return !isAsync;
          }),
      [options.settings],
    );

    // biome-ignore lint/correctness/useExhaustiveDependencies: idc
    useEffect(() => {
      const unsubscribes = modals.map((modal) => {
        const path = modal.id;

        return store.subscribeTo(path, (updatedModal) => {
          if (updatedModal) {
            //  Only write the values that are not the default values
            const variant = omit(
              updatedModal.values.variant,
              modal._def.config.defaultValues.variant,
            );
            const component = omit(
              updatedModal.values.component,
              modal._def.config.defaultValues.component,
            );

            const values: [string, any][] = [];

            if (Object.keys(variant).length) {
              values.push(["variant", variant]);
            }

            if (Object.keys(component).length) {
              values.push(["component", component]);
            }

            adapter.write(path, Object.fromEntries(values));
          } else {
            adapter.remove(path);
          }
        });
      });

      return () => {
        unsubscribes.forEach((unsub) => {
          unsub();
        });
      };
    }, []);

    // biome-ignore lint/correctness/useExhaustiveDependencies: idc
    useEffect(() => {
      const unsubscribe = store.onReady(() => {
        for (const modal of modals) {
          const path = modal.id;

          const values = adapter.read(path);

          if (values) {
            store.add({
              open: true,
              id: path,
              variant: modal._def.config.variant,
              ui: modal._def.component,
              values: {
                variant: {
                  ...(values?.variant ?? {}),
                  ...modal._def.config.defaultValues.variant,
                },
                component: {
                  ...(values?.component ?? {}),
                  ...modal._def.config.defaultValues.component,
                },
              },
            });
          }
        }
      });

      return unsubscribe;
    }, []);

    return null;
  }

  return function UrlSyncer(options: Options) {
    return (
      // <NuqsAdapter>
      <Inner options={options} />
      // </NuqsAdapter>
    );
  };
}
