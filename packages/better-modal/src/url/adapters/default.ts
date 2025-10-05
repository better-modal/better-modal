import { createAdapter } from "../adapter";

export function createBetterModalDefaultAdapter() {
    return createAdapter(() => {
        return {
            read: (key: string) => {
                const url = new URL(window.location.href);
                const value = url.searchParams.get(key);
                if (value) {
                    try {
                        return JSON.parse(value)
                    } catch (error) {
                        return null;
                    }
                }
                return null;
            },
            write: (key: string, value: any) => {
                const url = new URL(window.location.href);
                url.searchParams.set(key, JSON.stringify(value));
                window.history.replaceState({}, "", url.toString());
            },
            remove: (key: string) => {
                const url = new URL(window.location.href);
                url.searchParams.delete(key);
                window.history.replaceState({}, "", url.toString());
            }
        }
    })

}

export type DefaultAdapter = ReturnType<typeof createBetterModalDefaultAdapter>;