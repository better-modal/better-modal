export type LazyComponent<T> = {
    _tag: "lazy";
    loader: () => T,
    preload?: () => Promise<T>
};


export function lazy<T>(loader: () => T, preload?: () => Promise<T>): LazyComponent<T> {
    return {
        _tag: "lazy",
        loader,
        preload
    };
}

export type AnyLazyComponent = LazyComponent<any>;


export function isLazyComponent(c: any): c is AnyLazyComponent {
    return typeof c === "object" && c?._tag === "lazy";
}

export type ExtractPropsFromLazyComponent<T extends AnyLazyComponent> = Parameters<Awaited<ReturnType<T["loader"]>>>[0];
