"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, type Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import type { PackRow } from "@/lib/types";
import { formatMAD } from "@/lib/utils";
import { packSchema } from "@/lib/validations";

type ProductOption = {
  id: number;
  name: string;
  price: number;
  images: string[];
  isActive: boolean;
};

type PackFormProps = {
  initialValues?: PackRow | null;
  productOptions: ProductOption[];
};

type PackFormValues = {
  name: string;
  description: string;
  price: number;
  discountedPrice: number | null | "";
  productIds: number[];
  image: string;
  isActive: boolean;
};

export function PackForm({ initialValues, productOptions }: PackFormProps) {
  const router = useRouter();
  const isEditing = Boolean(initialValues?.id);

  const form = useForm<PackFormValues>({
    resolver: zodResolver(packSchema) as Resolver<PackFormValues>,
    defaultValues: {
      name: initialValues?.name ?? "",
      description: initialValues?.description ?? "",
      price: initialValues?.price ?? 0,
      discountedPrice: initialValues?.discountedPrice ?? "",
      productIds: initialValues?.productIds ?? [],
      image: initialValues?.image ?? "",
      isActive: initialValues?.isActive ?? true,
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const response = await fetch(
      isEditing ? `/api/admin/packs/${initialValues?.id}` : "/api/admin/packs",
      {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message ?? "Failed to save pack.");
      return;
    }

    toast.success(isEditing ? "Pack updated." : "Pack created.");
    router.push("/admin/packs");
    router.refresh();
  });

  const handleDelete = async () => {
    if (!initialValues?.id) {
      return;
    }

    const response = await fetch(`/api/admin/packs/${initialValues.id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      toast.error("Failed to delete pack.");
      return;
    }

    toast.success("Pack deleted.");
    router.push("/admin/packs");
    router.refresh();
  };

  const selectedProductIds = form.watch("productIds") as number[];

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button asChild variant="secondary">
            <Link href="/admin/packs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          {isEditing ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Pack
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete pack?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action removes the pack and attached discounts.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : null}
        </div>

        <form className="space-y-6" onSubmit={onSubmit}>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...form.register("name")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Pack Price (MAD)</Label>
              <Input id="price" min={0} step={1} type="number" {...form.register("price")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discountedPrice">Discounted Price (optional)</Label>
              <Input
                id="discountedPrice"
                min={0}
                step={1}
                type="number"
                {...form.register("discountedPrice")}
              />
            </div>
            <div className="flex items-center justify-between rounded-[1.5rem] border border-border bg-black/20 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-white">Active pack</p>
                <p className="text-xs text-muted">Inactive packs stay in admin only.</p>
              </div>
              <Controller
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...form.register("description")} />
          </div>

          <Controller
            control={form.control}
            name="image"
            render={({ field }) => (
              <ImageUploadField
                label="Pack Image"
                onChange={(urls) => field.onChange(urls[0] ?? "")}
                single
                value={field.value ? [field.value] : []}
              />
            )}
          />

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-white">Included products</p>
              <p className="text-xs text-muted">
                Select the pieces that belong to this pack.
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {productOptions.map((product) => {
                const checked = selectedProductIds.includes(product.id);

                return (
                  <label
                    className="flex items-start gap-3 rounded-[1.5rem] border border-border bg-black/20 px-4 py-4"
                    key={product.id}
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(nextChecked) => {
                        const currentValue = selectedProductIds ?? [];
                        if (nextChecked) {
                          form.setValue("productIds", [...currentValue, product.id], {
                            shouldValidate: true,
                          });
                        } else {
                          form.setValue(
                            "productIds",
                            currentValue.filter((id) => id !== product.id),
                            { shouldValidate: true },
                          );
                        }
                      }}
                    />
                    <div className="space-y-1">
                      <p className="font-medium text-white">{product.name}</p>
                      <p className="text-xs uppercase tracking-[0.16em] text-muted">
                        {formatMAD(product.price)}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            {isEditing ? "Update Pack" : "Create Pack"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
