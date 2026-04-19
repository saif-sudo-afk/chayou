"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type ProductGalleryProps = {
  images: string[];
  alt: string;
};

export function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0] ?? "");
  const [open, setOpen] = useState(false);

  if (!images[0]) {
    return <div className="h-full w-full rounded-[1.75rem] bg-white/5" />;
  }

  return (
    <>
      <button
        className="relative block h-full w-full overflow-hidden rounded-[1.75rem]"
        onClick={() => setOpen(true)}
        type="button"
      >
        <Image
          alt={alt}
          className="object-cover transition duration-500 hover:scale-105"
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          src={selectedImage}
        />
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl overflow-hidden p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>{alt}</DialogTitle>
            <DialogDescription>
              Swipe or tap through the gallery for a closer look.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 p-6 pt-4">
            <div className="relative h-[24rem] overflow-hidden rounded-[1.75rem] border border-border bg-black/30 sm:h-[32rem]">
              <Image
                alt={alt}
                className="object-cover"
                fill
                sizes="(max-width: 1024px) 100vw, 900px"
                src={selectedImage}
              />
            </div>
            <div className="flex snap-x gap-3 overflow-x-auto pb-2">
              {images.map((image) => (
                <button
                  className={cn(
                    "relative h-24 w-20 shrink-0 snap-start overflow-hidden rounded-[1rem] border border-border transition",
                    selectedImage === image && "border-gold",
                  )}
                  key={image}
                  onClick={() => setSelectedImage(image)}
                  type="button"
                >
                  <Image
                    alt={alt}
                    className="object-cover"
                    fill
                    sizes="96px"
                    src={image}
                  />
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
