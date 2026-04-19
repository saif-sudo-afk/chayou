"use client";

import Image from "next/image";
import { Loader2, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type ImageUploadFieldProps = {
  label: string;
  value: string[];
  onChange: (urls: string[]) => void;
  max?: number;
  single?: boolean;
};

export function ImageUploadField({
  label,
  value,
  onChange,
  max = 6,
  single = false,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) {
      return;
    }

    const formData = new FormData();
    files.slice(0, max).forEach((file) => formData.append("files", file));

    setUploading(true);

    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "Upload failed.");
      }

      onChange(single ? [data.urls[0]] : [...value, ...data.urls].slice(0, max));
      toast.success("Images uploaded.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium">{label}</p>
        <Button
          disabled={uploading}
          type="button"
          variant="secondary"
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Upload className="mr-2 h-4 w-4" />
          )}
          Upload
        </Button>
      </div>
      <input
        accept="image/*"
        className="hidden"
        multiple={!single}
        onChange={handleUpload}
        ref={inputRef}
        type="file"
      />
      {value.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {value.map((url) => (
            <div
              className="relative overflow-hidden rounded-[1.5rem] border border-border bg-black/20"
              key={url}
            >
              <div className="relative h-36">
                <Image alt="Upload preview" className="object-cover" fill sizes="240px" src={url} />
              </div>
              <button
                className="absolute right-3 top-3 rounded-full bg-black/60 p-2 text-white transition hover:bg-brand"
                onClick={() => onChange(value.filter((image) => image !== url))}
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-[1.5rem] border border-dashed border-border bg-black/10 px-4 py-6 text-sm text-muted">
          No images uploaded yet.
        </div>
      )}
    </div>
  );
}
