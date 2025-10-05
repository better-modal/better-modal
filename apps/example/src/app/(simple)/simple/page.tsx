"use client";

import { useBetterModal } from "@/app/(simple)/_modals/react";

export default function Page() {
  const bm = useBetterModal();

  return (
    <button onClick={() => bm.simple.open()} type="button">
      Open
    </button>
  );
}
