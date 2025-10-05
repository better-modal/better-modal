"use client";

import { useEffect } from "react";
import { useModalStore } from "../react";

export function createBetterModalDevtools() {
  return {
    BetterModalDevtools: () => {
      const store = useModalStore();

      useEffect(() => {
        // @ts-expect-error
        window._betterModal = () => store.getState();
      }, [store]);

      return (
        <button
          type="button"
          style={{
            position: "fixed",
            bottom: 2,
            right: 2,
            backgroundColor: "black",
            borderRadius: "8px",
            padding: "8px",
            zIndex: 1000,
            color: "white",
            fontWeight: "900",
          }}
          onClick={() => {
            console.log(store.getState());
          }}
        >
          BetterModalDevtools
        </button>
      );
    },
  };
}
