"use client";

import { createBetterModalReact } from "better-modal/react";
import { modals } from "./registry";

export const { useBetterModal, BetterModalProvider } =
    createBetterModalReact(modals);