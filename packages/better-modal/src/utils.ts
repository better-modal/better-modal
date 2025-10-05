export function getByPath<T>(path: string, obj: T): T | undefined {
    // @ts-expect-error
    return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

export function err(message: string): never {
    throw new Error(message);
}

interface ProxyCallbackOptions {
    path: readonly string[];
    args: readonly unknown[];
}

type ProxyCallback = (opts: ProxyCallbackOptions) => unknown;

// shoutout to trpc<https://trpc.io/> for this 
export function createRecursiveProxy(
    callback: ProxyCallback,
    path: readonly string[] = [],
) {
    const proxy: unknown = new Proxy(
        () => {
            // dummy no-op function since we don't have any
            // client-side target we want to remap to
        },
        {
            get(_obj, key) {
                if (typeof key !== "string") return undefined;

                // Recursively compose the full path until a function is invoked
                return createRecursiveProxy(callback, [...path, key]);
            },
            apply(_1, _2, args) {
                // Call the callback function with the entire path we
                // recursively created and forward the arguments
                return callback({
                    path,
                    args,
                });
            },
        },
    );

    return proxy;
}


export function omit(values: any, defaults: any) {
    return Object.entries(values).reduce((acc, [key, val]) => {
        const def = defaults?.[key];
        if (val && typeof val === "object") {
            const child = omit(val, def ?? {});
            if (Object.keys(child).length) acc[key] = child;
        } else if (val !== def) {
            acc[key] = val;
        }
        return acc;
    }, {} as Record<string, any>);
}