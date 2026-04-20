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
import type { DiscountRow } from "@/lib/types";
import { formatDate } from "@/lib/utils";

type DiscountItem = DiscountRow & {
  targetName: string;
};

type DiscountsManagementProps = {
  discounts: DiscountItem[];
};

export function DiscountsManagement({ discounts }: DiscountsManagementProps) {
  const router = useRouter();

  const handleDelete = async (id: number) => {
    const response = await fetch(`/api/admin/discounts/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      toast.error("Failed to delete discount.");
      return;
    }

    toast.success("Discount deleted.");
    router.refresh();
  };

  const columns: ColumnDef<DiscountItem>[] = [
    {
      accessorKey: "targetName",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Target" />,
      cell: ({ row }) => <span className="font-medium text-text">{row.original.targetName}</span>,
    },
    {
      accessorKey: "percentage",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Discount" />,
      cell: ({ row }) => <span className="font-medium text-gold">{row.original.percentage}%</span>,
    },
    {
      accessorKey: "expiresAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Expiry" />,
      cell: ({ row }) => (
        <span className="text-sm text-muted">
          {row.original.expiresAt ? formatDate(row.original.expiresAt) : "No expiry"}
        </span>
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
            <Link href={`/admin/discounts/${row.original.id}`}>
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
                <AlertDialogTitle>Delete discount?</AlertDialogTitle>
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
          <Link href="/admin/discounts/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Discount
          </Link>
        </Button>
      </div>
      <DataTable columns={columns} data={discounts} />
    </div>
  );
}
