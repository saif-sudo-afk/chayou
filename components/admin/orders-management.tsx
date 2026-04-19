"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye, MessageCircle, Search, X } from "lucide-react";
import { useState } from "react";
import { DataTable } from "@/components/admin/data-table";
import { DataTableColumnHeader } from "@/components/admin/data-table-column-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ORDER_STATUSES } from "@/lib/constants";
import type { OrderRow } from "@/lib/types";
import { buildWhatsAppUrl, formatDateTime, formatMAD } from "@/lib/utils";

type OrdersManagementProps = {
  orders: OrderRow[];
  filters: {
    status?: string;
    search?: string;
    from?: string;
    to?: string;
  };
};

export function OrdersManagement({ orders, filters }: OrdersManagementProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(filters.search ?? "");
  const [status, setStatus] = useState(filters.status ?? "all");
  const [from, setFrom] = useState(filters.from ?? "");
  const [to, setTo] = useState(filters.to ?? "");

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (search) params.set("search", search);
    else params.delete("search");

    if (status && status !== "all") params.set("status", status);
    else params.delete("status");

    if (from) params.set("from", from);
    else params.delete("from");

    if (to) params.set("to", to);
    else params.delete("to");

    router.push(`/admin/orders?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("all");
    setFrom("");
    setTo("");
    router.push("/admin/orders");
  };

  const columns: ColumnDef<OrderRow>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Order" />,
      cell: ({ row }) => <span className="font-medium text-white">#{row.original.id}</span>,
    },
    {
      accessorKey: "customerName",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Customer" />,
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-white">{row.original.customerName}</p>
          <a
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-gold"
            href={buildWhatsAppUrl(row.original.customerPhone, `Hello ${row.original.customerName}!`)}
            rel="noreferrer"
            target="_blank"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            {row.original.customerPhone}
          </a>
        </div>
      ),
    },
    {
      accessorKey: "customerCity",
      header: ({ column }) => <DataTableColumnHeader column={column} title="City" />,
      cell: ({ row }) => <span>{row.original.customerCity}</span>,
    },
    {
      id: "items",
      header: "Items",
      cell: ({ row }) => (
        <span className="text-sm text-muted">
          {row.original.items.slice(0, 2).map((item) => `${item.qty}x ${item.name}`).join(", ")}
          {row.original.items.length > 2 ? "..." : ""}
        </span>
      ),
    },
    {
      accessorKey: "totalAmount",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Total" />,
      cell: ({ row }) => <span className="font-medium text-gold">{formatMAD(row.original.totalAmount)}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
      cell: ({ row }) => <span className="text-sm text-muted">{formatDateTime(row.original.createdAt)}</span>,
    },
    {
      id: "view",
      header: "",
      cell: ({ row }) => (
        <Button asChild size="sm" variant="secondary">
          <Link href={`/admin/orders/${row.original.id}`}>
            <Eye className="mr-2 h-3.5 w-3.5" />
            View
          </Link>
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 rounded-[2rem] border border-border bg-panel/50 p-5 lg:grid-cols-[1.5fr_0.8fr_0.8fr_0.8fr_auto_auto] lg:items-end">
        <div className="space-y-2">
          <Label htmlFor="search">Search by name or phone</Label>
          <Input id="search" value={search} onChange={(event) => setSearch(event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select onValueChange={setStatus} value={status}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {ORDER_STATUSES.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="from">From</Label>
          <Input id="from" type="date" value={from} onChange={(event) => setFrom(event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="to">To</Label>
          <Input id="to" type="date" value={to} onChange={(event) => setTo(event.target.value)} />
        </div>
        <Button type="button" onClick={applyFilters}>
          <Search className="mr-2 h-4 w-4" />
          Apply
        </Button>
        <Button type="button" variant="secondary" onClick={clearFilters}>
          <X className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>
      <DataTable columns={columns} data={orders} />
    </div>
  );
}
