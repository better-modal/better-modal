import type { AnyRegistry, AnyVariant } from "./def";
import { isLazyComponent } from "./lazy";
import { err } from "./utils";

export interface ModalInstance {
    id: string;
    variant: string;
    values: {
        variant: any;
        component: any;
    };
    ui: any
    open: boolean;
}

export type ModalState = {
    modals: ModalInstance[];
};

type AnyObserver<T> = (state: T) => void;

class Observer<T> {
    private observers: Set<AnyObserver<T>> = new Set();
    private readyObservers: Set<() => void> = new Set();

    subscribe(observer: AnyObserver<T>): () => void {
        this.observers.add(observer);

        if (this.observers.size >= 1) {
            this.readyObservers.forEach((observer) => {
                observer();
            });
        }

        return () => this.unsubscribe(observer);
    }

    unsubscribe(observer: AnyObserver<T>): void {
        this.observers.delete(observer);
    }

    notify(state: T): void {
        this.observers.forEach((observer) => {
            observer(state);
        });
    }

    onReady(observer: () => void): () => void {
        this.readyObservers.add(observer);

        if (this.observers.size >= 1) {
            this.readyObservers.forEach((observer) => {
                observer();
                this.readyObservers.delete(observer);
            });
        }

        return () => this.readyObservers.delete(observer);
    }
}

type IDObserver = (modal: ModalInstance | null) => void;

export class ModalStore extends Observer<ModalState> {
    private modals: Map<string, ModalInstance[]> = new Map();
    private variants: Map<string, AnyVariant> = new Map();

    private idObservers: Map<string, IDObserver[]> = new Map();

    constructor(variants: Record<string, AnyVariant> = {}) {
        super();
        for (const [name, variant] of Object.entries(variants)) {
            this.variants.set(name, variant);
        }
    }

    subscribeTo(id: string, observer: IDObserver): () => void {
        const observers = this.idObservers.get(id) ?? [];
        const newObservers = [...observers, observer];
        this.idObservers.set(id, newObservers);

        return () => {
            const currentObservers = this.idObservers.get(id) ?? [];
            const index = currentObservers.indexOf(observer);
            if (index > -1) {
                currentObservers.splice(index, 1);
                if (currentObservers.length === 0) {
                    this.idObservers.delete(id);
                }
            }
        };
    }


    private notifyIdObservers(id: string, modal: ModalInstance | null): void {
        const observers = this.idObservers.get(id);
        observers?.forEach((observer) => { observer(modal) });
    }

    add(modal: ModalInstance) {
        const id = modal.id;

        const ui = isLazyComponent(modal.ui)
            ? modal.ui.loader()
            : modal.ui;

        const newModal = {
            ...modal,
            ui,
            id,
        };

        const currentModals = this.modals.get(id) ?? [];
        const newModals = [...currentModals, newModal];
        this.modals.set(id, newModals);

        this.notifyIdObservers(id, newModal);
        this.notify(this.getState());
    }

    dismiss(id: string) {
        const modal = this.modals.get(id)?.find((modal) => modal.id === id);
        if (!modal) {
            console.warn(`Tried to dismiss modal with id ${id} but it doesn't exist`);
            return
        }

        modal.open = false;

        this.notifyIdObservers(id, modal);

        this.notify(this.getState());
    }

    remove(id: string) {
        const deleted = this.modals.delete(id);

        if (!deleted) {
            console.warn(`Tried to remove modal with id ${id} but it doesn't exist`);
        }

        this.notifyIdObservers(id, null);
        this.notify(this.getState());
    }

    getVariant(variant: string) {
        return this.variants.get(variant) ?? err(`Variant ${variant} not found`);
    }

    getState(): ModalState {
        return {
            modals: Array.from(this.modals.values()).flat(),
        };
    }
}


export function createModalStore(def: AnyRegistry) {
    return new ModalStore(def._def.variants);
}