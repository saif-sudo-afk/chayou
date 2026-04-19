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
            "!border-border !bg-panel !text-white !shadow-[0_18px_50px_rgba(0,0,0,0.35)]",
          title: "!text-white",
          description: "!text-muted",
          actionButton: "!bg-gold !text-black",
          cancelButton: "!bg-brand !text-white",
        },
      }}
    />
  );
}
