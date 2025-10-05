"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBetterModal } from "@/modals/react";

export function ModalButton({
  variant,
  options,
}: {
  variant: string;
  options: { name: string; value: string; values: string[] }[];
}) {
  const bm = useBetterModal();

  const [variantProps, setVariantProps] = useState<Record<string, string>>({});

  return (
    <div className="h-40 grid place-items-center relative">
      <div className="absolute top-0 inset-x-0">
        <div className="flex gap-2">
          {options.map((o) => (
            <Select
              key={o.name}
              onValueChange={(v) =>
                setVariantProps({ ...variantProps, [o.value]: v })
              }
            >
              <SelectTrigger size="sm">
                <SelectValue placeholder={o.name} />
              </SelectTrigger>
              <SelectContent>
                {o.values.map((v) => (
                  <SelectItem key={v} value={v}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>
      </div>

      <Button
        type="button"
        onClick={() => {
          bm.open(
            () => (
              <p>
                This modal is using the{" "}
                <span className="font-bold">{variant}</span> variant
              </p>
            ),
            variant,
            {
              variant: {
                title: "Default title",
                description: "Default description",
                ...variantProps,
                ...(variant === "shadcn-alert-dialog-action" && {
                  onConfirm: async () => {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                  },
                }),
              },
              component: {},
            },
          );
        }}
      >
        Open
      </Button>
    </div>
  );
}
