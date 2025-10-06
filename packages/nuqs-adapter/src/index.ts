import { createAdapter } from "better-modal/url";
import { type Parser, type UseQueryStateOptions, useQueryStates } from "nuqs";

type GlobalOptions = Pick<UseQueryStateOptions<any>, "history">;

type ModalOptions = {
    parser: Parser<any>;
};

export function createBetterModalsNuqsAdapter(options?: GlobalOptions) {
    return createAdapter<ModalOptions>((modals) => {
        const keyMap = Object.fromEntries(
            modals.map(({ modal, options }) => [modal.id, options.parser]),
        );

        const [state, setState] = useQueryStates(keyMap, options);

        return {
            read: (key) => {
                return state[key];
            },
            write: (key: string, value: any) => {
                setState({
                    [key]: { ...value },
                });
            },
            remove: (key: string) => {
                setState({
                    [key]: null,
                });
            },
        };
    });
}

export type NuqsAdapter = ReturnType<typeof createBetterModalsNuqsAdapter>;