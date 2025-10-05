import { betterModal } from "better-modal";
import { ShadcnDialog } from "@/components/shadcn-dialog";

const m = betterModal({
    variants: {
        dialog: ShadcnDialog,
    },
});

export const modal = m.modal;
export const registry = m.registry;