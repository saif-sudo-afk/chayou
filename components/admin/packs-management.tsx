"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { DataTable } from "@/components/admin/data-table";
import { DataTableColumnHeader } from "@/components/admin/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import type { CatalogPack } from "@/lib/types";
import { formatMAD } from "@/lib/utils";

type PacksManagementProps = {
  packs: CatalogPack[];
};

export function PacksManagement({ packs }: PacksManagementProps) {
  const router = useRouter();

  const handleDelete = async (id: number) => {
    const response = await fetch(`/api/admin/packs/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      toast.error("Failed to delete pack.");
      return;
    }

    toast.success("Pack deleted.");
    router.refresh();
  };

  const columns: ColumnDef<CatalogPack>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Pack" />,
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-white">{row.original.name}</p>
          <p className="text-xs uppercase tracking-[0.16em] text-muted">
            {row.original.includedProducts.length} items
          </p>
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
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? "success" : "muted"}>
          {row.original.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="secondary">
            <Link href={`/admin/packs/${row.original.id}`}>
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
                <AlertDialogTitle>Delete pack?</AlertDialogTitle>
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
          <Link href="/admin/packs/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Pack
          </Link>
        </Button>
      </div>
      <DataTable columns={columns} data={packs} />
    </div>
  );
}
