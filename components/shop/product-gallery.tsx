"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const selectedImage = images[selectedIndex] ?? images[0] ?? "";
  const hasMultipleImages = images.length > 1;

  const showPrevious = () => {
    setSelectedIndex((current) =>
      current === 0 ? images.length - 1 : current - 1,
    );
  };

  const showNext = () => {
    setSelectedIndex((current) =>
      current === images.length - 1 ? 0 : current + 1,
    );
  };

  if (!images[0]) {
    return <div className="h-full w-full rounded-lg bg-bg" />;
  }

  return (
    <>
      <button
        className="relative block h-full w-full overflow-hidden"
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
            <div className="relative h-[24rem] overflow-hidden rounded-lg border border-border bg-bg sm:h-[32rem]">
              <Image
                alt={alt}
                className="object-cover"
                fill
                sizes="(max-width: 1024px) 100vw, 900px"
                src={selectedImage}
              />
              {hasMultipleImages ? (
                <>
                  <button
                    aria-label="Show previous product image"
                    className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-brand/80 text-bg shadow-lg transition hover:bg-gold hover:text-brand"
                    onClick={showPrevious}
                    type="button"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    aria-label="Show next product image"
                    className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-brand/80 text-bg shadow-lg transition hover:bg-gold hover:text-brand"
                    onClick={showNext}
                    type="button"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <div className="absolute bottom-4 right-4 rounded-full bg-brand/80 px-3 py-1 text-xs text-bg">
                    {selectedIndex + 1} / {images.length}
                  </div>
                </>
              ) : null}
            </div>
            <div className="flex snap-x gap-3 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  className={cn(
                    "relative h-24 w-20 shrink-0 snap-start overflow-hidden rounded-md border border-border transition",
                    selectedImage === image && "border-gold",
                  )}
                  key={image}
                  onClick={() => setSelectedIndex(index)}
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
