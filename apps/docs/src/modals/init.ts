import { betterModal } from "better-modal";
import { ShadcnAlertDialog } from "@/modals/variants/shadcn-alert-dialog";
import { ShadcnAlertDialogAction } from "@/modals/variants/shadcn-alert-dialog-action";
import { ShadcnDialog } from "@/modals/variants/shadcn-dialog";
import { ShadcnDialogSizes } from "@/modals/variants/shadcn-dialog-sizes";
import { ShadcnSheet } from "@/modals/variants/shadcn-sheet";
import { ShadcnSheetSizes } from "@/modals/variants/shadcn-sheet-sizes";

export const m = betterModal({
    variants: {
        "shadcn-dialog": ShadcnDialog,
        "shadcn-sheet": ShadcnSheet,
        "shadcn-alert-dialog": ShadcnAlertDialog,
        "shadcn-dialog-sizes": ShadcnDialogSizes,
        "shadcn-sheet-sizes": ShadcnSheetSizes,
        "shadcn-alert-dialog-action": ShadcnAlertDialogAction,
    },
});

export const modal = m.modal;
export const registry = m.registry;
