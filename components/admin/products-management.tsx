"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { DataTable } from "@/components/admin/data-table";
import { DataTableColumnHeader } from "@/components/admin/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import type { CatalogProduct } from "@/lib/types";
import { formatMAD } from "@/lib/utils";

type ProductsManagementProps = {
  products: CatalogProduct[];
};

function toProductPayload(product: CatalogProduct, isActive = product.isActive) {
  return {
    name: product.name,
    description: product.description,
    price: product.price,
    discountedPrice: product.discountedPrice,
    category: product.category,
    stock: product.stock,
    images: product.images,
    isActive,
  };
}

export function ProductsManagement({ products }: ProductsManagementProps) {
  const router = useRouter();

  const handleToggle = async (product: CatalogProduct, isActive: boolean) => {
    const response = await fetch(`/api/admin/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toProductPayload(product, isActive)),
    });

    if (!response.ok) {
      toast.error("Failed to update product status.");
      return;
    }

    toast.success("Product status updated.");
    router.refresh();
  };

  const handleDelete = async (id: number) => {
    const response = await fetch(`/api/admin/products/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      toast.error("Failed to delete product.");
      return;
    }

    toast.success("Product deleted.");
    router.refresh();
  };

  const columns: ColumnDef<CatalogProduct>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Product" />,
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="relative h-14 w-12 overflow-hidden rounded-xl border border-border bg-black/30">
            {row.original.primaryImage ? (
              <Image
                alt={row.original.name}
                className="object-cover"
                fill
                sizes="56px"
                src={row.original.primaryImage}
              />
            ) : null}
          </div>
          <div>
            <p className="font-medium text-white">{row.original.name}</p>
            <p className="text-xs uppercase tracking-[0.16em] text-muted">
              {row.original.category}
            </p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "price",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Price" />,
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-gold">{formatMAD(row.original.effectivePrice)}</p>
          {row.original.effectivePrice < row.original.originalPrice ? (
            <p className="text-xs text-muted line-through">
              {formatMAD(row.original.originalPrice)}
            </p>
          ) : null}
        </div>
      ),
    },
    {
      accessorKey: "stock",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Stock" />,
      cell: ({ row }) => <span>{row.original.stock}</span>,
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Switch
            checked={row.original.isActive}
            onCheckedChange={(checked) => handleToggle(row.original, checked)}
          />
          <Badge variant={row.original.isActive ? "success" : "muted"}>
            {row.original.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="secondary">
            <Link href={`/admin/products/${row.original.id}`}>
              <Pencil className="mr-2 h-3.5 w-3.5" />
              Edit
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="destructive">
                <Trash2 className="mr-2 h-3.5 w-3.5" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete product?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDelete(row.original.id)}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>
      <DataTable columns={columns} data={products} />
    </div>
  );
}
