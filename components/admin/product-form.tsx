"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, type Resolver, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { PRODUCT_CATEGORIES, PRODUCT_CATEGORY_LABELS } from "@/lib/constants";
import type { ProductCategory, ProductRow } from "@/lib/types";
import { productSchema } from "@/lib/validations";

type ProductFormProps = {
  initialValues?: ProductRow | null;
};

type ProductFormValues = {
  name: string;
  description: string;
  price: number;
  discountedPrice: number | null | "";
  category: ProductCategory;
  stock: number;
  images: string[];
  isActive: boolean;
  ringDiameter: number | null | "";
  ringWidth: number | null | "";
};

export function ProductForm({ initialValues }: ProductFormProps) {
  const router = useRouter();
  const isEditing = Boolean(initialValues?.id);
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as Resolver<ProductFormValues>,
    defaultValues: {
      name: initialValues?.name ?? "",
      description: initialValues?.description ?? "",
      price: initialValues?.price ?? 0,
      discountedPrice: initialValues?.discountedPrice ?? "",
      category: initialValues?.category ?? "rings",
      stock: initialValues?.stock ?? 0,
      images: initialValues?.images ?? [],
      isActive: initialValues?.isActive ?? true,
      ringDiameter: initialValues?.ringDiameter ?? "",
      ringWidth: initialValues?.ringWidth ?? "",
    },
  });

  const selectedCategory = useWatch({ control: form.control, name: "category" });

  const onSubmit = form.handleSubmit(async (values) => {
    const response = await fetch(
      isEditing ? `/api/admin/products/${initialValues?.id}` : "/api/admin/products",
      {
        method: isEditing ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message ?? "Failed to save product.");
      return;
    }

    toast.success(isEditing ? "Product updated." : "Product created.");
    router.push("/admin/products");
    router.refresh();
  });

  const handleDelete = async () => {
    if (!initialValues?.id) {
      return;
    }

    const response = await fetch(`/api/admin/products/${initialValues.id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      toast.error("Failed to delete product.");
      return;
    }

    toast.success("Product deleted.");
    router.push("/admin/products");
    router.refresh();
  };

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button asChild variant="secondary">
            <Link href="/admin/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          {isEditing ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Product
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete product?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action removes the product and any attached discounts.
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
              <Label htmlFor="category">Category</Label>
              <Controller
                control={form.control}
                name="category"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRODUCT_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {PRODUCT_CATEGORY_LABELS[category]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <p className="text-xs leading-5 text-muted">
                Choisissez Petit Prix pour les articles à prix réduit groupés dans le menu latéral.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price (MAD)</Label>
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
            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input id="stock" min={0} step={1} type="number" {...form.register("stock")} />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border bg-bg px-4 py-3">
              <div>
                <p className="text-sm font-medium text-text">Active product</p>
                <p className="text-xs text-muted">Inactive products disappear from the storefront.</p>
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

          {(selectedCategory === "rings" || selectedCategory === "bracelets" || selectedCategory === "necklaces") && (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="ringDiameter">
                  {selectedCategory === "necklaces" ? "Longueur (mm)" : "Diamètre intérieur (mm)"}
                </Label>
                <Input
                  id="ringDiameter"
                  min={0}
                  step={0.1}
                  type="number"
                  placeholder="ex : 17.5"
                  {...form.register("ringDiameter")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ringWidth">Largeur (mm)</Label>
                <Input
                  id="ringWidth"
                  min={0}
                  step={0.1}
                  type="number"
                  placeholder="ex : 4"
                  {...form.register("ringWidth")}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...form.register("description")} />
          </div>

          <Controller
            control={form.control}
            name="images"
            render={({ field }) => (
              <ImageUploadField
                description="Upload several product photos at once. Customers can browse every image in the product gallery."
                label="Product Images"
                max={12}
                onChange={field.onChange}
                value={field.value ?? []}
              />
            )}
          />

          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            {isEditing ? "Update Product" : "Create Product"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
