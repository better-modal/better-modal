import { type JSX, lazy as lazyReact, Suspense } from "react";
import { lazy as lazyCore } from "../lazy";

type Options = {
  fallback?: () => JSX.Element;
};

export function lazy<T extends React.ComponentType<any>>(
  loader: () => Promise<T>,
  options: Options = {},
) {
  const { fallback: Fallback } = options;
  let loaded: T | null = null;

  return lazyCore(
    () => {
      if (loaded) {
        return loaded;
      }

      const ReactLazyComponent = lazyReact(() =>
        loader().then((c) => {
          loaded = c;
          return { default: c };
        }),
      );

      return (props: T) => (
        <Suspense fallback={Fallback ? <Fallback /> : undefined}>
          {/* @ts-expect-error */}
          <ReactLazyComponent {...props} />
        </Suspense>
      );
    },
    async () => {
      if (loaded) {
        return loaded;
      }

      let intervalId: number | null = null;

      const result = await Promise.race([
        new Promise<T>((resolve) => {
          intervalId = setInterval(() => {
            if (loaded) {
              return resolve(loaded);
            }
          }, 50);
        }),
        loader(),
      ]).finally(() => {
        if (intervalId) {
          clearInterval(intervalId);
        }
      });

      loaded = result;

      return loaded;
    },
  );
}
