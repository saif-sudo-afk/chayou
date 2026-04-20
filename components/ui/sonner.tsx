"use client";

import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      closeButton
      position="top-right"
      richColors
      theme="dark"
      toastOptions={{
        classNames: {
          toast:
            "!border-border !bg-surface !text-text !shadow-[0_18px_50px_rgba(78,2,0,0.16)]",
          title: "!text-text",
          description: "!text-muted",
          actionButton: "!bg-brand !text-surface",
          cancelButton: "!bg-gold !text-brand",
        },
      }}
    />
  );
}
