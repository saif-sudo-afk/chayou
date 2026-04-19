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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { DiscountRow } from "@/lib/types";
import { discountSchema } from "@/lib/validations";

type DiscountTargets = {
  products: { id: number; name: string }[];
  packs: { id: number; name: string }[];
};

type DiscountFormProps = {
  initialValues?: DiscountRow | null;
  targets: DiscountTargets;
};

type DiscountFormValues = {
  scope: "sitewide" | "product" | "pack";
  productId: number | null;
  packId: number | null;
  percentage: number;
  expiresAt: string | null | "";
  isActive: boolean;
};

export function DiscountForm({ initialValues, targets }: DiscountFormProps) {
  const router = useRouter();
  const isEditing = Boolean(initialValues?.id);
  const scope = initialValues?.productId
    ? "product"
    : initialValues?.packId
      ? "pack"
      : "sitewide";

  const form = useForm<DiscountFormValues>({
    resolver: zodResolver(discountSchema) as Resolver<DiscountFormValues>,
    defaultValues: {
      scope,
      productId: initialValues?.productId ?? null,
      packId: initialValues?.packId ?? null,
      percentage: initialValues?.percentage ?? 10,
      expiresAt: initialValues?.expiresAt
        ? new Date(initialValues.expiresAt).toISOString().slice(0, 10)
        : "",
      isActive: initialValues?.isActive ?? true,
    },
  });

  const activeScope = form.watch("scope");

  const onSubmit = form.handleSubmit(async (values) => {
    const response = await fetch(
      isEditing ? `/api/admin/discounts/${initialValues?.id}` : "/api/admin/discounts",
      {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message ?? "Failed to save discount.");
      return;
    }

    toast.success(isEditing ? "Discount updated." : "Discount created.");
    router.push("/admin/discounts");
    router.refresh();
  });

  const handleDelete = async () => {
    if (!initialValues?.id) {
      return;
    }

    const response = await fetch(`/api/admin/discounts/${initialValues.id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      toast.error("Failed to delete discount.");
      return;
    }

    toast.success("Discount deleted.");
    router.push("/admin/discounts");
    router.refresh();
  };

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button asChild variant="secondary">
            <Link href="/admin/discounts">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          {isEditing ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Discount
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete discount?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action permanently removes the discount rule.
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
              <Label>Scope</Label>
              <Controller
                control={form.control}
                name="scope"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select scope" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sitewide">Sitewide</SelectItem>
                      <SelectItem value="product">Specific product</SelectItem>
                      <SelectItem value="pack">Specific pack</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="percentage">Percentage</Label>
              <Input
                id="percentage"
                max={100}
                min={1}
                step={1}
                type="number"
                {...form.register("percentage")}
              />
            </div>
            {activeScope === "product" ? (
              <div className="space-y-2">
                <Label>Product</Label>
                <Controller
                  control={form.control}
                  name="productId"
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value ? String(field.value) : undefined}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {targets.products.map((product) => (
                          <SelectItem key={product.id} value={String(product.id)}>
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            ) : null}
            {activeScope === "pack" ? (
              <div className="space-y-2">
                <Label>Pack</Label>
                <Controller
                  control={form.control}
                  name="packId"
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value ? String(field.value) : undefined}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select pack" />
                      </SelectTrigger>
                      <SelectContent>
                        {targets.packs.map((pack) => (
                          <SelectItem key={pack.id} value={String(pack.id)}>
                            {pack.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="expiresAt">Expiry Date (optional)</Label>
              <Input id="expiresAt" type="date" {...form.register("expiresAt")} />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-[1.5rem] border border-border bg-black/20 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-white">Discount active</p>
              <p className="text-xs text-muted">Inactive discounts remain stored but ignored.</p>
            </div>
            <Controller
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
          </div>

          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            {isEditing ? "Update Discount" : "Create Discount"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
